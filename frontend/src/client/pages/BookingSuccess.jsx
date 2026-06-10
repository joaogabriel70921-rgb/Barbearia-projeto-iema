import { useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router";
import { CheckCircle2, Calendar, Clock, User, Scissors, Home, CalendarDays } from "lucide-react";
import confetti from "canvas-confetti";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
function BookingSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const appointment = location.state?.appointment;
  useEffect(() => {
    const duration = 2e3;
    const end = Date.now() + duration;
    const frame = () => {
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ["#C9A84C", "#1A1A1A", "#F5F5F0"]
      });
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ["#C9A84C", "#1A1A1A", "#F5F5F0"]
      });
      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, []);
  if (!appointment) {
    return <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: "var(--bs-off-white)" }}>
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: "var(--bs-gold-light)" }}>
            <CalendarDays size={32} color="var(--bs-gold-dark)" />
          </div>
          <p className="mb-2" style={{ fontWeight: 700, color: "var(--bs-text-primary)" }}>Nenhum agendamento encontrado</p>
          <p className="text-sm mb-6" style={{ color: "var(--bs-text-secondary)" }}>
            Não encontramos os detalhes do agendamento. Veja seus agendamentos abaixo.
          </p>
          <Link to="/agendamentos">
            <button
      className="h-12 px-8 rounded-xl flex items-center justify-center gap-2 mx-auto transition-all duration-200 active:scale-[0.97]"
      style={{ background: "var(--bs-gold)", color: "var(--bs-text-primary)", fontWeight: 700 }}
    >
              <CalendarDays size={18} aria-hidden="true" />
              Ver Meus Agendamentos
            </button>
          </Link>
        </div>
      </div>;
  }
  const barber = appointment.barber;
  const services = appointment.services ?? [];
  const totalPrice = appointment.totalPrice ?? services.reduce((sum, s) => sum + (s.price || 0), 0);
  const totalDuration = appointment.totalDuration ?? services.reduce((sum, s) => sum + (s.duration || 0), 0);
  const dateObj = parseISO(appointment.date);
  return <div className="min-h-screen flex flex-col" style={{ backgroundColor: "var(--bs-off-white)" }}>
      {
    /* Success header */
  }
      <div
    className="relative overflow-hidden"
    style={{ background: "linear-gradient(135deg, var(--bs-charcoal) 0%, #0D0D0D 100%)" }}
  >
        <div className="max-w-lg mx-auto px-4 py-12 text-center relative z-10">
          <div className="inline-flex items-center justify-center mb-6">
            <div
    className="relative w-24 h-24 rounded-full flex items-center justify-center animate-in zoom-in-50 duration-500"
    style={{ background: "var(--bs-gold)" }}
  >
              <CheckCircle2 size={48} color="var(--bs-text-primary)" strokeWidth={3} aria-hidden="true" />
              <div
    className="absolute inset-0 rounded-full animate-ping"
    style={{ background: "var(--bs-gold)", opacity: 0.3 }}
    aria-hidden="true"
  />
            </div>
          </div>

          <h1
    className="text-white mb-2 animate-in fade-in slide-in-from-bottom-4 duration-700"
    style={{ fontSize: "1.75rem", fontWeight: 800 }}
  >
            Agendamento Confirmado!
          </h1>
          <p
    className="text-[15px] animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100"
    style={{ color: "rgba(255,255,255,0.7)" }}
  >
            Você receberá uma confirmação por WhatsApp
          </p>
        </div>

        <div
    className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl"
    style={{ background: "var(--bs-gold)", opacity: 0.1 }}
    aria-hidden="true"
  />
      </div>

      {
    /* Appointment details */
  }
      <div className="flex-1 max-w-lg mx-auto w-full px-4 py-6">
        <div
    className="rounded-2xl overflow-hidden mb-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200"
    style={{ background: "var(--bs-surface)", boxShadow: "var(--bs-shadow-md)" }}
  >
          <div
    className="px-4 py-3 flex items-center gap-2"
    style={{ background: "var(--bs-charcoal)" }}
  >
            <Scissors size={16} color="var(--bs-gold)" aria-hidden="true" />
            <p style={{ fontWeight: 700, fontSize: "0.9375rem", color: "white" }}>
              Detalhes do Agendamento
            </p>
          </div>

          <div className="p-4 space-y-4">
            {
    /* Barber */
  }
            {barber && <>
                <div className="flex items-center gap-3">
                  <ImageWithFallback
    src={barber.image}
    alt={`Foto do barbeiro ${barber.name}`}
    className="w-12 h-12 rounded-full object-cover"
    style={{ border: "2px solid var(--bs-gold-light)" }}
  />
                  <div className="flex-1">
                    <p className="text-[11px] uppercase tracking-wide" style={{ color: "var(--bs-text-muted)" }}>
                      Barbeiro
                    </p>
                    <p style={{ fontWeight: 700, fontSize: "0.9375rem", color: "var(--bs-text-primary)" }}>
                      {barber.name}
                    </p>
                    <p className="text-[12px]" style={{ color: "var(--bs-text-secondary)" }}>
                      {barber.specialty}
                    </p>
                  </div>
                </div>
                <Divider />
              </>}

            {
    /* Date & Time */
  }
            <div className="flex items-center gap-3">
              <div
    className="w-12 h-12 rounded-xl flex items-center justify-center"
    style={{ background: "var(--bs-gold-light)" }}
    aria-hidden="true"
  >
                <Calendar size={20} color="var(--bs-gold-dark)" />
              </div>
              <div className="flex-1">
                <p className="text-[11px] uppercase tracking-wide" style={{ color: "var(--bs-text-muted)" }}>
                  Data & Hora
                </p>
                <p style={{ fontWeight: 700, fontSize: "0.9375rem", color: "var(--bs-text-primary)" }}>
                  {format(dateObj, "EEEE, dd 'de' MMMM", { locale: ptBR })}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <Clock size={12} color="var(--bs-text-muted)" aria-hidden="true" />
                  <span className="text-[13px]" style={{ color: "var(--bs-text-secondary)" }}>
                    {appointment.time} ({totalDuration} minutos)
                  </span>
                </div>
              </div>
            </div>

            <Divider />

            {
    /* Services */
  }
            <div>
              <p className="text-[11px] uppercase tracking-wide mb-2" style={{ color: "var(--bs-text-muted)" }}>
                Serviços
              </p>
              <div className="space-y-2">
                {services.map((service) => <div key={service.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Scissors size={13} color="var(--bs-text-muted)" aria-hidden="true" />
                      <span className="text-[13px]" style={{ color: "var(--bs-text-primary)", fontWeight: 500 }}>
                        {service.name}
                      </span>
                    </div>
                    <span className="text-[13px]" style={{ color: "var(--bs-text-secondary)" }}>
                      R$ {service.price.toFixed(2)}
                    </span>
                  </div>)}
              </div>
            </div>

            <Divider />

            {
    /* Client */
  }
            <div className="flex items-center gap-3">
              <div
    className="w-12 h-12 rounded-xl flex items-center justify-center"
    style={{ background: "var(--bs-gold-light)" }}
    aria-hidden="true"
  >
                <User size={20} color="var(--bs-gold-dark)" />
              </div>
              <div className="flex-1">
                <p className="text-[11px] uppercase tracking-wide" style={{ color: "var(--bs-text-muted)" }}>
                  Cliente
                </p>
                <p style={{ fontWeight: 600, fontSize: "0.875rem", color: "var(--bs-text-primary)" }}>
                  {appointment.customerName}
                </p>
                <p className="text-[12px]" style={{ color: "var(--bs-text-secondary)" }}>
                  {appointment.customerPhone}
                </p>
              </div>
            </div>

            <Divider />

            {
    /* Total */
  }
            <div className="flex items-center justify-between pt-2">
              <p className="text-[13px]" style={{ color: "var(--bs-text-muted)" }}>
                Total a pagar
              </p>
              <p style={{ fontWeight: 800, fontSize: "1.5rem", color: "var(--bs-gold-dark)" }}>
                R$ {totalPrice.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        {
    /* Info card */
  }
        <div
    className="rounded-2xl p-4 mb-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300"
    style={{ background: "var(--bs-gold-light)", border: "1px solid var(--bs-gold-medium)" }}
  >
          <p className="text-[13px] leading-relaxed" style={{ color: "var(--bs-gold-darker)" }}>
            <strong>Importante:</strong> Chegue com 5 minutos de antecedência. Em caso de atraso superior a 15 minutos,
            o agendamento poderá ser cancelado.
          </p>
        </div>

        {
    /* Action buttons */
  }
        <div className="flex flex-col gap-3 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-400">
          <Link to="/agendamentos" className="w-full">
            <button
    className="w-full h-12 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.98] focus:outline-none"
    style={{
      background: "var(--bs-gold)",
      color: "var(--bs-text-primary)",
      fontWeight: 700,
      fontSize: "0.9375rem",
      boxShadow: "var(--bs-shadow-gold)"
    }}
  >
              <CalendarDays size={18} aria-hidden="true" />
              Ver Meus Agendamentos
            </button>
          </Link>

          <Link to="/" className="w-full">
            <button
    className="w-full h-12 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 active:scale-95 focus:outline-none"
    style={{
      background: "transparent",
      color: "var(--bs-text-primary)",
      border: "2px solid var(--bs-border-medium)",
      fontWeight: 600,
      fontSize: "0.9375rem"
    }}
  >
              <Home size={18} aria-hidden="true" />
              Voltar ao Início
            </button>
          </Link>
        </div>
      </div>
    </div>;
}
function Divider() {
  return <div
    style={{ height: 1, background: "var(--bs-border)" }}
    role="separator"
    aria-hidden="true"
  />;
}
export {
  BookingSuccess
};
