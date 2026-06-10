import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import {
  ArrowLeft,
  Check,
  Clock,
  ChevronRight,
  User,
  Scissors,
  Phone,
  Calendar as CalendarIcon,
  AlertCircle
} from "lucide-react";
import { Calendar } from "../components/ui/calendar";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { StarRating } from "../components/StarRating";
import { ServiceIcon } from "../components/ServiceIcon";
import { catalogService } from "../../services/catalogService.js";
import { appointmentService } from "../../services/appointmentService.js";
import { toast } from "sonner";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
const STEP_LABELS = [
  "Servi\xE7o",
  "Barbeiro",
  "Data & Hora",
  "Confirma\xE7\xE3o"
];
function Booking() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [step, setStep] = useState(1);
  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedBarber, setSelectedBarber] = useState(null);
  const [selectedDate, setSelectedDate] = useState();
  const [selectedTime, setSelectedTime] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [nameFocused, setNameFocused] = useState(false);
  const [phoneFocused, setPhoneFocused] = useState(false);
  const [errors, setErrors] = useState({});
  const [services, setServices] = useState([]);
  const [barbers, setBarbers] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  // Carrega serviços e barbeiros do backend
  useEffect(() => {
    catalogService.listServices().then(setServices).catch(() => {});
    catalogService.listBarbers().then(setBarbers).catch(() => {});
  }, []);
  // Busca os horários disponíveis reais quando barbeiro + data mudam
  useEffect(() => {
    if (!selectedBarber || !selectedDate) {
      setAvailableSlots([]);
      return;
    }
    let active = true;
    setSlotsLoading(true);
    const dateStr = format(selectedDate, "yyyy-MM-dd");
    catalogService
      .getAvailability(selectedBarber.id, dateStr)
      .then((slots) => active && setAvailableSlots(slots))
      .catch(() => active && setAvailableSlots([]))
      .finally(() => active && setSlotsLoading(false));
    return () => {
      active = false;
    };
  }, [selectedBarber, selectedDate]);
  // Pré-seleção via query (?serviceId=&barberId=)
  useEffect(() => {
    const serviceId = searchParams.get("serviceId");
    const barberId = searchParams.get("barberId");
    if (serviceId && services.length) {
      const service = services.find((s) => s.id === serviceId);
      if (service) setSelectedServices((prev) => (prev.length ? prev : [service]));
    }
    if (barberId && barbers.length) {
      const barber = barbers.find((b) => b.id === barberId);
      if (barber) {
        setSelectedBarber((prev) => prev || barber);
        if (serviceId) setStep((st) => (st === 1 ? 3 : st));
      }
    }
  }, [searchParams, services, barbers]);
  const totalPrice = selectedServices.reduce((s, sv) => s + sv.price, 0);
  const totalDuration = selectedServices.reduce((s, sv) => s + sv.duration, 0);
  const handleServiceToggle = (service) => {
    const isSelected = selectedServices.some((s) => s.id === service.id);
    if (isSelected) {
      setSelectedServices(selectedServices.filter((s) => s.id !== service.id));
    } else {
      if (selectedServices.length >= 3) {
        toast.error("M\xE1ximo de 3 servi\xE7os por agendamento", {
          icon: "\u26A0\uFE0F"
        });
        return;
      }
      setSelectedServices([...selectedServices, service]);
    }
  };
  const validateStep = (currentStep) => {
    const newErrors = {};
    if (currentStep === 1 && selectedServices.length === 0) {
      newErrors.services = "Selecione pelo menos um servi\xE7o";
    }
    if (currentStep === 2 && !selectedBarber) {
      newErrors.barber = "Selecione um barbeiro";
    }
    if (currentStep === 3) {
      if (!selectedDate) {
        newErrors.date = "Selecione uma data";
      }
      if (!selectedTime) {
        newErrors.time = "Selecione um hor\xE1rio";
      }
    }
    if (currentStep === 4) {
      if (!customerName.trim()) {
        newErrors.name = "Digite seu nome completo";
      } else if (customerName.trim().length < 3) {
        newErrors.name = "Nome deve ter pelo menos 3 caracteres";
      }
      if (!customerPhone.trim()) {
        newErrors.phone = "Digite seu telefone";
      } else if (customerPhone.trim().length < 10) {
        newErrors.phone = "Telefone inv\xE1lido";
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleNextStep = (nextStep) => {
    if (validateStep(step)) {
      setStep(nextStep);
      setErrors({});
    } else {
      toast.error("Preencha todos os campos obrigat\xF3rios");
    }
  };
  const handleConfirm = async () => {
    if (!validateStep(4)) {
      toast.error("Preencha todos os campos obrigat\xF3rios");
      return;
    }
    setIsSubmitting(true);
    try {
      const dateStr = format(selectedDate, "yyyy-MM-dd");
      const created = await appointmentService.create({
        employeeId: selectedBarber.id,
        serviceIds: selectedServices.map((s) => s.id),
        date: dateStr,
        time: selectedTime,
        notes: customerName.trim()
          ? `Cliente: ${customerName.trim()} · Tel: ${customerPhone.trim()}`
          : ""
      });
      toast.success("Agendamento confirmado!", {
        description: `${format(selectedDate, "dd/MM/yyyy")} \xE0s ${selectedTime}`
      });
      navigate("/agendamento-sucesso", {
        state: {
          appointment: {
            ...created,
            services: selectedServices,
            barber: selectedBarber,
            date: dateStr,
            time: selectedTime,
            customerName: customerName.trim(),
            customerPhone: customerPhone.trim()
          }
        }
      });
    } catch (error) {
      toast.error("Erro ao criar agendamento", {
        description: error.message || "Tente novamente em alguns instantes"
      });
      setIsSubmitting(false);
    }
  };
  const isWeekend = (date) => date.getDay() === 0;
  const progressWidth = `${(step - 1) / 3 * 100}%`;
  return <div
    className="min-h-screen pb-8"
    style={{ background: "var(--bs-off-white)" }}
  >
      {
    /* ── Sticky Header ── */
  }
      <header
    className="sticky top-0 z-40 lg:hidden"
    style={{ background: "var(--bs-charcoal)" }}
  >
        <div className="max-w-lg mx-auto px-4 flex items-center h-14 gap-3">
          <Link to="/" aria-label="Voltar para o início">
            <button
    className="w-10 h-10 rounded-xl flex items-center justify-center transition-colors duration-150 focus:outline-none"
    style={{ background: "rgba(255,255,255,0.08)" }}
    aria-label="Voltar"
  >
              <ArrowLeft size={18} color="white" aria-hidden="true" />
            </button>
          </Link>
          <div className="flex-1">
            <p
    className="text-white"
    style={{ fontWeight: 700, fontSize: "1rem" }}
  >
              Novo Agendamento
            </p>
            <p className="text-[11px]" style={{ color: "rgba(255,255,255,0.5)" }}>
              Passo {step} de 4 · {STEP_LABELS[step - 1]}
            </p>
          </div>
          <Scissors size={18} color="var(--bs-gold)" aria-hidden="true" />
        </div>

        {
    /* Progress bar */
  }
        <div style={{ background: "rgba(255,255,255,0.1)", height: 3 }}>
          <div
    style={{
      width: progressWidth,
      height: "100%",
      background: "var(--bs-gold)",
      transition: "width 0.4s ease"
    }}
    aria-valuenow={step}
    aria-valuemin={1}
    aria-valuemax={4}
    role="progressbar"
    aria-label={`Passo ${step} de 4`}
  />
        </div>
      </header>

      {
    /* ── Step indicators ── */
  }
      <div
    className="sticky z-30 px-4 py-3"
    style={{ top: 61, background: "var(--bs-off-white)", borderBottom: "1px solid var(--bs-border)" }}
  >
        <div className="max-w-lg mx-auto flex items-center gap-2">
          {STEP_LABELS.map((label, i) => {
    const s = i + 1;
    const isCompleted = s < step;
    const isActive = s === step;
    return <div key={s} className="flex items-center flex-1 min-w-0">
                <div className="flex flex-col items-center gap-0.5 flex-shrink-0">
                  <div
      className="w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300"
      style={{
        background: isCompleted ? "var(--bs-gold)" : isActive ? "var(--bs-charcoal)" : "var(--bs-border)",
        color: isCompleted || isActive ? "white" : "var(--bs-text-muted)",
        fontSize: "11px",
        fontWeight: 700
      }}
      aria-label={`Passo ${s}: ${label}${isCompleted ? " (completo)" : isActive ? " (atual)" : ""}`}
    >
                    {isCompleted ? <Check size={13} aria-hidden="true" /> : <span aria-hidden="true">{s}</span>}
                  </div>
                  <span
      className="text-[9px] whitespace-nowrap hidden sm:block"
      style={{
        color: isActive ? "var(--bs-charcoal)" : "var(--bs-text-muted)",
        fontWeight: isActive ? 600 : 400
      }}
    >
                    {label}
                  </span>
                </div>
                {s < 4 && <div
      className="flex-1 mx-1"
      style={{
        height: 2,
        background: isCompleted ? "var(--bs-gold)" : "var(--bs-border)",
        transition: "background 0.3s ease"
      }}
      aria-hidden="true"
    />}
              </div>;
  })}
        </div>
      </div>

      {
    /* ── Main content ── */
  }
      <div className="max-w-lg mx-auto px-4 py-5">

        {
    /* ── Step 1: Choose Service ── */
  }
        {step === 1 && <section aria-labelledby="step1-heading">
            <h2
    id="step1-heading"
    style={{ fontWeight: 700, fontSize: "1.25rem", color: "var(--bs-text-primary)", marginBottom: 4 }}
  >
              Escolha os Serviços
            </h2>
            <p className="text-[13px] mb-4" style={{ color: "var(--bs-text-secondary)" }}>
              Selecione até <strong>3 serviços</strong> para o mesmo horário
            </p>

            <div className="flex flex-col gap-3" role="list" aria-label="Serviços disponíveis">
              {services.map((service) => {
    const isSelected = selectedServices.some((s) => s.id === service.id);
    return <button
      key={service.id}
      role="listitem"
      onClick={() => handleServiceToggle(service)}
      className="w-full text-left rounded-2xl p-4 flex items-center gap-4 transition-all duration-200 active:scale-[0.98] focus:outline-none"
      style={{
        background: isSelected ? "var(--bs-charcoal)" : "var(--bs-surface)",
        boxShadow: isSelected ? "var(--bs-shadow-md)" : "var(--bs-shadow-sm)",
        border: isSelected ? "2px solid var(--bs-gold)" : "2px solid transparent"
      }}
      aria-pressed={isSelected}
      aria-label={`${service.name}, ${service.duration} minutos, R$ ${service.price.toFixed(2)}`}
    >
                    {
      /* Icon */
    }
                    <div
      className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
      style={{
        background: isSelected ? "rgba(201,168,76,0.18)" : "var(--bs-gold-light)"
      }}
      aria-hidden="true"
    >
                      <ServiceIcon
      name={service.iconName}
      size={24}
      color={isSelected ? "var(--bs-gold)" : "var(--bs-gold-dark)"}
    />
                    </div>

                    {
      /* Info */
    }
                    <div className="flex-1 min-w-0">
                      <p
      style={{
        fontWeight: 700,
        fontSize: "0.9375rem",
        color: isSelected ? "white" : "var(--bs-text-primary)"
      }}
    >
                        {service.name}
                      </p>
                      <p
      className="text-[12px] mt-0.5 leading-snug"
      style={{
        color: isSelected ? "rgba(255,255,255,0.65)" : "var(--bs-text-secondary)"
      }}
    >
                        {service.description}
                      </p>
                      <div className="flex items-center gap-3 mt-1.5">
                        <span
      className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full"
      style={{
        background: isSelected ? "rgba(255,255,255,0.1)" : "var(--bs-off-white)",
        color: isSelected ? "rgba(255,255,255,0.7)" : "var(--bs-text-muted)"
      }}
    >
                          <Clock size={10} aria-hidden="true" />
                          {service.duration} min
                        </span>
                      </div>
                    </div>

                    {
      /* Price + check */
    }
                    <div className="flex flex-col items-end gap-2 flex-shrink-0">
                      <p
      style={{
        fontWeight: 700,
        fontSize: "1rem",
        color: isSelected ? "var(--bs-gold)" : "var(--bs-gold-dark)"
      }}
    >
                        R${service.price}
                      </p>
                      <div
      className="w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200"
      style={{
        background: isSelected ? "var(--bs-gold)" : "var(--bs-border)",
        border: isSelected ? "none" : "2px solid var(--bs-border)"
      }}
      aria-hidden="true"
    >
                        {isSelected && <Check size={13} color="white" strokeWidth={3} />}
                      </div>
                    </div>
                  </button>;
  })}
            </div>

            {
    /* Summary bar */
  }
            {selectedServices.length > 0 && <div
    className="mt-4 rounded-2xl p-4 flex items-center justify-between"
    style={{ background: "var(--bs-gold-light)", border: "1px solid var(--bs-gold-medium)" }}
    aria-live="polite"
    aria-atomic="true"
  >
                <div>
                  <p style={{ fontWeight: 700, fontSize: "0.875rem", color: "var(--bs-gold-dark)" }}>
                    {selectedServices.length}{" "}
                    {selectedServices.length === 1 ? "servi\xE7o" : "servi\xE7os"} selecionado
                    {selectedServices.length > 1 ? "s" : ""}
                  </p>
                  <p className="text-[12px]" style={{ color: "var(--bs-gold-darker)" }}>
                    <Clock size={11} className="inline mr-1" aria-hidden="true" />
                    {totalDuration} min · <strong>R$ {totalPrice.toFixed(2)}</strong>
                  </p>
                </div>
              </div>}

            {
    /* Error message */
  }
            {errors.services && <ErrorMessage message={errors.services} />}

            <div className="mt-5 flex justify-end">
              <GoldButton
    onClick={() => handleNextStep(2)}
    disabled={selectedServices.length === 0}
    className="w-full sm:w-auto"
  >
                Próximo <ChevronRight size={16} aria-hidden="true" />
              </GoldButton>
            </div>
          </section>}

        {
    /* ── Step 2: Choose Barber ── */
  }
        {step === 2 && <section aria-labelledby="step2-heading">
            <h2
    id="step2-heading"
    style={{ fontWeight: 700, fontSize: "1.25rem", color: "var(--bs-text-primary)", marginBottom: 4 }}
  >
              Escolha o Barbeiro
            </h2>
            <p className="text-[13px] mb-4" style={{ color: "var(--bs-text-secondary)" }}>
              Selecione o profissional de sua preferência
            </p>

            <div className="flex flex-col gap-3" role="list" aria-label="Barbeiros disponíveis">
              {barbers.map((barber) => {
    const isSelected = selectedBarber?.id === barber.id;
    return <button
      key={barber.id}
      role="listitem"
      onClick={() => setSelectedBarber(barber)}
      className="w-full text-left rounded-2xl p-4 flex items-center gap-4 transition-all duration-200 active:scale-[0.98] focus:outline-none"
      style={{
        background: isSelected ? "var(--bs-charcoal)" : "var(--bs-surface)",
        boxShadow: isSelected ? "var(--bs-shadow-md)" : "var(--bs-shadow-sm)",
        border: isSelected ? "2px solid var(--bs-gold)" : "2px solid transparent"
      }}
      aria-pressed={isSelected}
      aria-label={`${barber.name}, especialidade: ${barber.specialty}`}
    >
                    {
      /* Avatar */
    }
                    <div className="relative flex-shrink-0">
                      <ImageWithFallback
      src={barber.image}
      alt={`Foto do barbeiro ${barber.name}`}
      className="w-16 h-16 rounded-full object-cover"
      style={{
        border: isSelected ? "2px solid var(--bs-gold)" : "2px solid var(--bs-border)"
      }}
    />
                      {barber.availableToday && <span
      className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2"
      style={{
        background: "var(--bs-success)",
        borderColor: isSelected ? "var(--bs-charcoal)" : "var(--bs-surface)"
      }}
      aria-label="Disponível hoje"
    />}
                    </div>

                    {
      /* Info */
    }
                    <div className="flex-1 min-w-0">
                      <p
      style={{
        fontWeight: 700,
        fontSize: "0.9375rem",
        color: isSelected ? "white" : "var(--bs-text-primary)"
      }}
    >
                        {barber.name}
                      </p>
                      <p
      className="text-[12px] mt-0.5"
      style={{
        color: isSelected ? "rgba(255,255,255,0.6)" : "var(--bs-text-secondary)"
      }}
    >
                        {barber.specialty}
                      </p>
                      {
      /* Next available chip */
    }
                      <span
      className="inline-flex items-center gap-1 mt-2 text-[11px] px-2 py-0.5 rounded-full"
      style={{
        background: barber.availableToday ? isSelected ? "rgba(34,168,107,0.2)" : "var(--bs-success-light)" : isSelected ? "rgba(255,255,255,0.08)" : "var(--bs-off-white)",
        color: barber.availableToday ? "var(--bs-success)" : isSelected ? "rgba(255,255,255,0.6)" : "var(--bs-text-muted)",
        fontWeight: 500
      }}
    >
                        <Clock size={10} aria-hidden="true" />
                        {barber.availableToday ? "Dispon\xEDvel hoje" : "Indispon\xEDvel hoje"}
                      </span>
                    </div>

                    {
      /* Check */
    }
                    <div
      className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-200"
      style={{
        background: isSelected ? "var(--bs-gold)" : "var(--bs-border)"
      }}
      aria-hidden="true"
    >
                      {isSelected && <Check size={13} color="white" strokeWidth={3} />}
                    </div>
                  </button>;
  })}
            </div>

            {
    /* Error message */
  }
            {errors.barber && <ErrorMessage message={errors.barber} />}

            <div className="mt-5 flex gap-3">
              <OutlineButton onClick={() => setStep(1)} className="flex-1 sm:flex-initial">
                <ArrowLeft size={16} aria-hidden="true" /> Voltar
              </OutlineButton>
              <GoldButton
    onClick={() => handleNextStep(3)}
    disabled={!selectedBarber}
    className="flex-1 sm:flex-initial"
  >
                Próximo <ChevronRight size={16} aria-hidden="true" />
              </GoldButton>
            </div>
          </section>}

        {
    /* ── Step 3: Date & Time ── */
  }
        {step === 3 && <section aria-labelledby="step3-heading">
            <h2
    id="step3-heading"
    style={{ fontWeight: 700, fontSize: "1.25rem", color: "var(--bs-text-primary)", marginBottom: 4 }}
  >
              Data &amp; Horário
            </h2>
            <p className="text-[13px] mb-4" style={{ color: "var(--bs-text-secondary)" }}>
              Domingos não disponíveis
            </p>

            {
    /* Calendar */
  }
            <div
    className="rounded-2xl p-4 mb-4"
    style={{ background: "var(--bs-surface)", boxShadow: "var(--bs-shadow-sm)" }}
  >
              <Calendar
    mode="single"
    selected={selectedDate}
    onSelect={(d) => {
      setSelectedDate(d);
      setSelectedTime("");
    }}
    disabled={isWeekend}
    locale={ptBR}
    className="w-full"
    style={{
      "--rdp-accent-color": "var(--bs-gold)",
      "--rdp-accent-color-dark": "var(--bs-gold-dark)"
    }}
  />
            </div>

            {
    /* Time slots */
  }
            <div
    className="rounded-2xl p-4"
    style={{ background: "var(--bs-surface)", boxShadow: "var(--bs-shadow-sm)" }}
  >
              <p
    className="mb-3 flex items-center gap-2"
    style={{ fontWeight: 600, fontSize: "0.875rem", color: "var(--bs-text-primary)" }}
  >
                <Clock size={15} color="var(--bs-gold)" aria-hidden="true" />
                Horários Disponíveis
              </p>

              {!selectedDate ? <div className="flex flex-col items-center py-8 gap-2">
                  <CalendarIcon size={32} color="var(--bs-border)" aria-hidden="true" />
                  <p className="text-[13px]" style={{ color: "var(--bs-text-muted)" }}>
                    Selecione uma data primeiro
                  </p>
                </div> : availableSlots.length === 0 ? <div className="flex flex-col items-center py-8 gap-2">
                  <Clock size={32} color="var(--bs-border)" aria-hidden="true" />
                  <p className="text-[13px]" style={{ color: "var(--bs-text-muted)" }}>
                    Sem horários disponíveis nesta data
                  </p>
                </div> : <div
    className="grid gap-2"
    style={{ gridTemplateColumns: "repeat(auto-fill, minmax(70px, 1fr))" }}
    role="group"
    aria-label="Horários disponíveis"
  >
                  {availableSlots.map((time) => {
    const isSelected = selectedTime === time;
    return <button
      key={time}
      onClick={() => setSelectedTime(time)}
      className="h-11 rounded-xl text-[13px] transition-all duration-150 active:scale-95 focus:outline-none"
      style={{
        fontWeight: isSelected ? 700 : 500,
        background: isSelected ? "var(--bs-charcoal)" : "var(--bs-off-white)",
        color: isSelected ? "var(--bs-gold)" : "var(--bs-text-secondary)",
        border: isSelected ? "2px solid var(--bs-gold)" : "2px solid transparent"
      }}
      aria-pressed={isSelected}
      aria-label={`Hor\xE1rio ${time}${isSelected ? " selecionado" : ""}`}
    >
                        {time}
                      </button>;
  })}
                </div>}
            </div>

            {
    /* Error messages */
  }
            {(errors.date || errors.time) && <ErrorMessage message={errors.date || errors.time || ""} />}

            <div className="mt-5 flex gap-3">
              <OutlineButton onClick={() => setStep(2)} className="flex-1 sm:flex-initial">
                <ArrowLeft size={16} aria-hidden="true" /> Voltar
              </OutlineButton>
              <GoldButton
    onClick={() => handleNextStep(4)}
    disabled={!selectedDate || !selectedTime}
    className="flex-1 sm:flex-initial"
  >
                Próximo <ChevronRight size={16} aria-hidden="true" />
              </GoldButton>
            </div>
          </section>}

        {
    /* ── Step 4: Confirmation ── */
  }
        {step === 4 && <section aria-labelledby="step4-heading">
            <h2
    id="step4-heading"
    style={{ fontWeight: 700, fontSize: "1.25rem", color: "var(--bs-text-primary)", marginBottom: 4 }}
  >
              Confirmar Agendamento
            </h2>
            <p className="text-[13px] mb-4" style={{ color: "var(--bs-text-secondary)" }}>
              Revise os detalhes e insira seus dados
            </p>

            {
    /* Summary card */
  }
            <div
    className="rounded-2xl overflow-hidden mb-4"
    style={{ background: "var(--bs-surface)", boxShadow: "var(--bs-shadow-md)" }}
  >
              {
    /* Card header */
  }
              <div
    className="px-4 py-3 flex items-center gap-2"
    style={{ background: "var(--bs-charcoal)" }}
  >
                <Scissors size={16} color="var(--bs-gold)" aria-hidden="true" />
                <p
    style={{ fontWeight: 700, fontSize: "0.9375rem", color: "white" }}
  >
                  Resumo do Agendamento
                </p>
              </div>

              {
    /* Summary rows */
  }
              <div className="px-4 py-4 space-y-3">
                {
    /* Services */
  }
                <div className="flex gap-3">
                  <div
    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
    style={{ background: "var(--bs-gold-light)" }}
    aria-hidden="true"
  >
                    <Scissors size={15} color="var(--bs-gold-dark)" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[11px] uppercase tracking-wide" style={{ color: "var(--bs-text-muted)" }}>
                      Serviços
                    </p>
                    {selectedServices.map((s) => <p
    key={s.id}
    className="text-[13px] mt-0.5"
    style={{ color: "var(--bs-text-primary)", fontWeight: 500 }}
  >
                        {s.name} · R$ {s.price.toFixed(2)}
                      </p>)}
                  </div>
                </div>

                <Divider />

                {
    /* Barber */
  }
                <div className="flex gap-3 items-center">
                  <div className="relative flex-shrink-0">
                    <ImageWithFallback
    src={selectedBarber.image}
    alt={`Foto do barbeiro ${selectedBarber.name}`}
    className="w-8 h-8 rounded-lg object-cover"
  />
                  </div>
                  <div className="flex-1">
                    <p className="text-[11px] uppercase tracking-wide" style={{ color: "var(--bs-text-muted)" }}>
                      Barbeiro
                    </p>
                    <p className="text-[13px] mt-0.5" style={{ color: "var(--bs-text-primary)", fontWeight: 500 }}>
                      {selectedBarber.name}
                    </p>
                  </div>
                </div>

                <Divider />

                {
    /* Date & time */
  }
                <div className="flex gap-3 items-center">
                  <div
    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
    style={{ background: "var(--bs-gold-light)" }}
    aria-hidden="true"
  >
                    <CalendarIcon size={15} color="var(--bs-gold-dark)" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[11px] uppercase tracking-wide" style={{ color: "var(--bs-text-muted)" }}>
                      Data & Hora
                    </p>
                    <p className="text-[13px] mt-0.5" style={{ color: "var(--bs-text-primary)", fontWeight: 500 }}>
                      {format(selectedDate, "EEEE, dd 'de' MMMM", { locale: ptBR })} · {selectedTime}
                    </p>
                  </div>
                </div>

                <Divider />

                {
    /* Totals */
  }
                <div className="flex items-center justify-between pt-1">
                  <div>
                    <p className="text-[12px]" style={{ color: "var(--bs-text-muted)" }}>
                      <Clock size={11} className="inline mr-1" aria-hidden="true" />
                      Duração total
                    </p>
                    <p style={{ fontWeight: 600, color: "var(--bs-text-primary)" }}>
                      {totalDuration} minutos
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[12px]" style={{ color: "var(--bs-text-muted)" }}>
                      Total a pagar
                    </p>
                    <p style={{ fontWeight: 800, fontSize: "1.25rem", color: "var(--bs-gold-dark)" }}>
                      R$ {totalPrice.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {
    /* Client form */
  }
            <div
    className="rounded-2xl p-4 mb-5 space-y-4"
    style={{ background: "var(--bs-surface)", boxShadow: "var(--bs-shadow-sm)" }}
  >
              <p
    className="flex items-center gap-2"
    style={{ fontWeight: 600, fontSize: "0.875rem", color: "var(--bs-text-primary)" }}
  >
                <User size={15} color="var(--bs-gold)" aria-hidden="true" />
                Seus dados
              </p>

              {
    /* Name field */
  }
              <div className="space-y-1.5">
                <label
    htmlFor="customer-name"
    style={{
      fontSize: "0.8125rem",
      fontWeight: 600,
      color: errors.name ? "var(--bs-error)" : nameFocused ? "var(--bs-gold-dark)" : "var(--bs-text-secondary)",
      transition: "color 0.2s"
    }}
  >
                  Nome completo *
                </label>
                <div className="relative">
                  <User
    size={16}
    className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
    color={errors.name ? "var(--bs-error)" : nameFocused ? "var(--bs-gold)" : "var(--bs-text-muted)"}
    aria-hidden="true"
  />
                  <input
    id="customer-name"
    type="text"
    placeholder="Seu nome completo"
    value={customerName}
    onChange={(e) => {
      setCustomerName(e.target.value);
      if (errors.name) {
        setErrors({ ...errors, name: "" });
      }
    }}
    onFocus={() => setNameFocused(true)}
    onBlur={() => setNameFocused(false)}
    autoComplete="name"
    className="w-full h-12 pl-9 pr-4 rounded-xl transition-all duration-200 outline-none"
    style={{
      border: errors.name ? "2px solid var(--bs-error)" : nameFocused ? "2px solid var(--bs-gold)" : "2px solid var(--bs-border)",
      background: "var(--bs-off-white)",
      color: "var(--bs-text-primary)",
      fontSize: "0.9375rem"
    }}
    aria-required="true"
    aria-invalid={!!errors.name}
    aria-label="Nome completo"
  />
                </div>
                {errors.name && <p className="text-[12px] mt-1 flex items-center gap-1" style={{ color: "var(--bs-error)" }}>
                    <AlertCircle size={12} aria-hidden="true" />
                    {errors.name}
                  </p>}
              </div>

              {
    /* Phone field */
  }
              <div className="space-y-1.5">
                <label
    htmlFor="customer-phone"
    style={{
      fontSize: "0.8125rem",
      fontWeight: 600,
      color: errors.phone ? "var(--bs-error)" : phoneFocused ? "var(--bs-gold-dark)" : "var(--bs-text-secondary)",
      transition: "color 0.2s"
    }}
  >
                  Telefone (WhatsApp) *
                </label>
                <div className="relative">
                  <Phone
    size={16}
    className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
    color={errors.phone ? "var(--bs-error)" : phoneFocused ? "var(--bs-gold)" : "var(--bs-text-muted)"}
    aria-hidden="true"
  />
                  <input
    id="customer-phone"
    type="tel"
    placeholder="(11) 99999-9999"
    value={customerPhone}
    onChange={(e) => {
      setCustomerPhone(e.target.value);
      if (errors.phone) {
        setErrors({ ...errors, phone: "" });
      }
    }}
    onFocus={() => setPhoneFocused(true)}
    onBlur={() => setPhoneFocused(false)}
    autoComplete="tel"
    className="w-full h-12 pl-9 pr-4 rounded-xl transition-all duration-200 outline-none"
    style={{
      border: errors.phone ? "2px solid var(--bs-error)" : phoneFocused ? "2px solid var(--bs-gold)" : "2px solid var(--bs-border)",
      background: "var(--bs-off-white)",
      color: "var(--bs-text-primary)",
      fontSize: "0.9375rem"
    }}
    aria-required="true"
    aria-invalid={!!errors.phone}
    aria-label="Telefone para contato"
  />
                </div>
                {errors.phone && <p className="text-[12px] mt-1 flex items-center gap-1" style={{ color: "var(--bs-error)" }}>
                    <AlertCircle size={12} aria-hidden="true" />
                    {errors.phone}
                  </p>}
              </div>
            </div>

            <div className="flex gap-3">
              <OutlineButton
    onClick={() => setStep(3)}
    className="flex-1 sm:flex-initial"
    disabled={isSubmitting}
  >
                <ArrowLeft size={16} aria-hidden="true" /> Voltar
              </OutlineButton>
              <GoldButton
    onClick={handleConfirm}
    disabled={!customerName.trim() || !customerPhone.trim() || isSubmitting}
    loading={isSubmitting}
    className="flex-1 sm:flex-initial"
  >
                {isSubmitting ? "Confirmando\u2026" : "Confirmar Agendamento"}
              </GoldButton>
            </div>
          </section>}
      </div>
    </div>;
}
function GoldButton({ children, disabled, loading, className = "", style: s, ...rest }) {
  return <button
    {...rest}
    disabled={disabled || loading}
    className={`h-12 px-6 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.97] focus:outline-none ${className}`}
    style={{
      background: disabled || loading ? "rgba(201,168,76,0.4)" : "var(--bs-gold)",
      color: "var(--bs-text-primary)",
      fontWeight: 700,
      fontSize: "0.9375rem",
      cursor: disabled || loading ? "not-allowed" : "pointer",
      ...s
    }}
    aria-busy={loading}
  >
      {loading ? <span className="flex items-center gap-2">
          <SpinnerIcon />
          {children}
        </span> : children}
    </button>;
}
function OutlineButton({ children, disabled, className = "", style: s, ...rest }) {
  return <button
    {...rest}
    disabled={disabled}
    className={`h-12 px-6 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.97] focus:outline-none ${className}`}
    style={{
      background: "transparent",
      color: disabled ? "var(--bs-text-muted)" : "var(--bs-text-primary)",
      border: `2px solid ${disabled ? "var(--bs-border)" : "var(--bs-border-medium)"}`,
      fontWeight: 600,
      fontSize: "0.9375rem",
      cursor: disabled ? "not-allowed" : "pointer",
      ...s
    }}
  >
      {children}
    </button>;
}
function Divider() {
  return <div
    style={{ height: 1, background: "var(--bs-border)" }}
    role="separator"
    aria-hidden="true"
  />;
}
function SpinnerIcon() {
  return <svg
    className="animate-spin"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
  >
      <circle
    cx="12"
    cy="12"
    r="10"
    stroke="currentColor"
    strokeWidth="3"
    strokeOpacity="0.3"
  />
      <path
    d="M12 2a10 10 0 0 1 10 10"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
  />
    </svg>;
}
function ErrorMessage({ message }) {
  return <div
    className="mt-4 rounded-xl p-3 flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-200"
    style={{ background: "var(--bs-error-light)", border: "1px solid var(--bs-error)" }}
    role="alert"
  >
      <AlertCircle size={16} color="var(--bs-error)" aria-hidden="true" />
      <p className="text-[13px]" style={{ color: "var(--bs-error-dark)", fontWeight: 500 }}>
        {message}
      </p>
    </div>;
}
export {
  Booking
};
