import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router";
import {
  Scissors,
  Clock,
  User,
  ChevronRight,
  RefreshCw,
  CalendarDays,
  Calendar as CalendarIcon,
  X,
  AlertCircle
} from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { BottomNav } from "../components/BottomNav";
import { StatusBadge } from "../components/StatusBadge";
import { Skeleton } from "../components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "../components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "../components/ui/dialog";
import { appointmentService } from "../../services/appointmentService.js";
import { toast } from "sonner";
import { format, parseISO, isToday, isFuture } from "date-fns";
import { ptBR } from "date-fns/locale";
// Status que o cliente pode cancelar (espelha o backend).
const CANCELABLE = ["pendente", "confirmado"];
const TABS = [
  { key: "all", label: "Todos" },
  { key: "confirmed", label: "Confirmados" },
  { key: "cancelar", label: "Cancelar" },
  { key: "cancelled", label: "Cancelados" }
];
function matchesFilter(apt, filter) {
  if (filter === "all") return true;
  if (filter === "confirmed") return ["pendente", "confirmado", "em_andamento", "concluido"].includes(apt.status);
  if (filter === "cancelar") return CANCELABLE.includes(apt.status);
  if (filter === "cancelled") return apt.status === "cancelado";
  return true;
}
function Appointments() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [cancelId, setCancelId] = useState(null);
  const [cancelling, setCancelling] = useState(false);
  const [detailsId, setDetailsId] = useState(null);
  const load = useCallback(async (animate = false) => {
    if (animate) setRefreshing(true);
    setError("");
    try {
      const all = await appointmentService.listMine();
      all.sort((a, b) => {
        const da = new Date(`${a.date}T${a.time}`);
        const db = new Date(`${b.date}T${b.time}`);
        return db.getTime() - da.getTime();
      });
      setAppointments(all);
    } catch (e) {
      setError(e?.message || "N\xE3o foi poss\xEDvel carregar seus agendamentos.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);
  useEffect(() => {
    load();
  }, [load]);
  const handleCancel = async (id) => {
    setCancelling(true);
    try {
      await appointmentService.cancel(id);
      toast.success("Agendamento cancelado", {
        description: "O hor\xE1rio ficou dispon\xEDvel novamente."
      });
      setCancelId(null);
      await load();
    } catch (e) {
      toast.error("N\xE3o foi poss\xEDvel cancelar", {
        description: e?.message || "Tente novamente em alguns instantes."
      });
    } finally {
      setCancelling(false);
    }
  };
  const filtered = appointments.filter((a) => matchesFilter(a, activeTab));
  const detailsAppointment = appointments.find((a) => a.id === detailsId);
  return <div
    className="min-h-screen pb-24 lg:pb-8"
    style={{ background: "var(--bs-off-white)" }}
  >
      {
    /* ── Sticky Header (mobile only) ── */
  }
      <header
    className="sticky top-0 z-40 lg:hidden"
    style={{ background: "var(--bs-charcoal)" }}
  >
        <div className="max-w-lg mx-auto px-4 flex items-center justify-between h-14">
          <div className="flex items-center gap-2">
            <CalendarDays size={20} color="var(--bs-gold)" aria-hidden="true" />
            <h1 className="text-white" style={{ fontSize: "1.0625rem", fontWeight: 700 }}>
              Meus Agendamentos
            </h1>
          </div>
          <button
    onClick={() => load(true)}
    className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 focus:outline-none"
    style={{ background: "rgba(255,255,255,0.08)" }}
    aria-label="Atualizar agendamentos"
  >
            <RefreshCw
    size={17}
    color="white"
    aria-hidden="true"
    className={refreshing ? "animate-spin" : ""}
  />
          </button>
        </div>

        {
    /* ── Tab bar ── */
  }
        <div
    className="flex max-w-lg mx-auto px-2 overflow-x-auto scrollbar-none"
    role="tablist"
    aria-label="Filtrar agendamentos"
    style={{ scrollbarWidth: "none" }}
  >
          {TABS.map(({ key, label }) => {
    const isActive = activeTab === key;
    const count = appointments.filter((a) => matchesFilter(a, key)).length;
    const isCancelar = key === "cancelar";
    return <button
      key={key}
      role="tab"
      aria-selected={isActive}
      aria-controls={`tab-panel-${key}`}
      id={`tab-${key}`}
      onClick={() => setActiveTab(key)}
      className="flex items-center gap-1.5 py-3 px-3 text-[12px] whitespace-nowrap transition-all duration-200 focus:outline-none relative flex-shrink-0"
      style={{
        color: isActive ? isCancelar ? "var(--bs-error)" : "var(--bs-gold)" : "rgba(255,255,255,0.5)",
        fontWeight: isActive ? 700 : 400,
        borderBottom: isActive ? `2px solid ${isCancelar ? "var(--bs-error)" : "var(--bs-gold)"}` : "2px solid transparent"
      }}
    >
                {label}
                {count > 0 && <span
      className="flex items-center justify-center rounded-full min-w-[17px] h-[17px] px-1 text-[10px]"
      style={{
        background: isActive ? isCancelar ? "var(--bs-error)" : "var(--bs-gold)" : "rgba(255,255,255,0.15)",
        color: isActive ? "white" : "rgba(255,255,255,0.6)",
        fontWeight: 700
      }}
      aria-label={`${count} agendamento${count > 1 ? "s" : ""}`}
    >
                    {count}
                  </span>}
              </button>;
  })}
        </div>
      </header>

      {
    /* ── Content ── */
  }
      <div
    className="max-w-lg mx-auto px-4 py-4"
    role="tabpanel"
    id={`tab-panel-${activeTab}`}
    aria-labelledby={`tab-${activeTab}`}
  >
        {
    /* New appointment CTA */
  }
        <Link to="/agendar" className="block mb-4">
          <button
    className="w-full h-12 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.98] focus:outline-none"
    style={{
      background: "var(--bs-gold)",
      color: "var(--bs-text-primary)",
      fontWeight: 700,
      fontSize: "0.9375rem",
      boxShadow: "var(--bs-shadow-gold)"
    }}
    aria-label="Fazer novo agendamento"
  >
            <Scissors size={18} aria-hidden="true" />
            Novo Agendamento
          </button>
        </Link>

        {
    /* Skeleton state */
  }
        {loading ? <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => <AppointmentSkeleton key={i} />)}
          </div> : error ? <ErrorState message={error} onRetry={() => load(true)} /> : filtered.length === 0 ? <EmptyState tab={activeTab} /> : <div className="space-y-3" role="list" aria-label={`Agendamentos ${TABS.find((t) => t.key === activeTab)?.label.toLowerCase()}`}>
            {filtered.map((apt) => <AppointmentCard
    key={apt.id}
    appointment={apt}
    onCancel={() => setCancelId(apt.id)}
    onViewDetails={() => setDetailsId(apt.id)}
    onReschedule={(apt2) => {
      navigate(`/agendar?serviceId=${apt2.serviceIds?.[0] || ""}&barberId=${apt2.barberId}`);
    }}
    cancelMode={activeTab === "cancelar"}
  />)}
          </div>}
      </div>

      {
    /* ── Cancel confirmation dialog ── */
  }
      <AlertDialog open={cancelId !== null} onOpenChange={() => setCancelId(null)}>
        <AlertDialogContent className="max-w-[90vw] sm:max-w-md rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle style={{ fontWeight: 700, color: "var(--bs-text-primary)" }}>
              Cancelar agendamento?
            </AlertDialogTitle>
            <AlertDialogDescription style={{ color: "var(--bs-text-secondary)" }}>
              Esta ação não pode ser desfeita. O horário ficará disponível para outros clientes.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
            <AlertDialogCancel
    className="w-full sm:w-auto m-0 rounded-xl h-11"
    style={{ fontWeight: 600 }}
  >
              Manter agendamento
            </AlertDialogCancel>
            <AlertDialogAction
    onClick={(e) => {
      e.preventDefault();
      if (cancelId && !cancelling) handleCancel(cancelId);
    }}
    disabled={cancelling}
    className="w-full sm:w-auto m-0 rounded-xl h-11 disabled:opacity-60"
    style={{
      background: "var(--bs-error)",
      color: "white",
      fontWeight: 700
    }}
  >
              {cancelling ? "Cancelando…" : "Sim, cancelar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {
    /* ── Appointment details modal ── */
  }
      {detailsAppointment && <AppointmentDetailsModal
    appointment={detailsAppointment}
    open={!!detailsId}
    onClose={() => setDetailsId(null)}
    onCancel={() => {
      setDetailsId(null);
      setCancelId(detailsAppointment.id);
    }}
    onReschedule={(apt) => {
      setDetailsId(null);
      navigate(`/agendar?serviceId=${apt.serviceIds?.[0] || ""}&barberId=${apt.barberId}`);
    }}
  />}

      <BottomNav />
    </div>;
}
function AppointmentCard({ appointment, onCancel, onViewDetails, onReschedule, cancelMode = false }) {
  const services = appointment.services ?? [];
  const barber = appointment.barber;
  const totalPrice = appointment.totalPrice ?? 0;
  if (services.length === 0 || !barber) return null;
  const dateObj = parseISO(appointment.date);
  const appointmentDateTime = /* @__PURE__ */ new Date(`${appointment.date}T${appointment.time}`);
  const isUpcoming = isFuture(appointmentDateTime) || isToday(appointmentDateTime);
  const canCancel = CANCELABLE.includes(appointment.status);
  return <article
    role="listitem"
    className="rounded-2xl overflow-hidden transition-all duration-200 cursor-pointer active:scale-[0.99]"
    style={{
      background: "var(--bs-surface)",
      boxShadow: "var(--bs-shadow-sm)",
      opacity: appointment.status === "cancelled" ? 0.8 : 1
    }}
    aria-label={`Agendamento com ${barber.name} em ${format(dateObj, "dd/MM/yyyy")} \xE0s ${appointment.time}`}
    onClick={onViewDetails}
  >
      {
    /* Gold top accent for upcoming confirmed */
  }
      {isUpcoming && appointment.status !== "cancelled" && <div
    style={{ height: 3, background: "linear-gradient(90deg, var(--bs-gold), var(--bs-gold-dark))" }}
    aria-hidden="true"
  />}

      <div className="p-4">
        {
    /* Row 1: barber info + status */
  }
        <div className="flex items-center gap-3 mb-3">
          <Link
    to={`/barbeiro/${barber.id}`}
    onClick={(e) => e.stopPropagation()}
    className="flex-shrink-0"
  >
            <ImageWithFallback
    src={barber.image}
    alt={`Foto do barbeiro ${barber.name}`}
    className="w-12 h-12 rounded-full object-cover transition-all duration-200 hover:ring-2 hover:ring-gold"
    style={{ border: "2px solid var(--bs-gold-light)" }}
  />
          </Link>
          <div className="flex-1 min-w-0">
            <Link
    to={`/barbeiro/${barber.id}`}
    onClick={(e) => e.stopPropagation()}
    className="hover:underline"
  >
              <p style={{ fontWeight: 700, fontSize: "0.9375rem", color: "var(--bs-text-primary)" }}>
                {barber.name}
              </p>
            </Link>
            <p className="text-[12px] mt-0.5 truncate" style={{ color: "var(--bs-text-muted)" }}>
              {barber.specialty}
            </p>
          </div>
          <StatusBadge status={appointment.status} />
        </div>

        {
    /* Row 2: services */
  }
        <div
    className="rounded-xl p-3 mb-3"
    style={{ background: "var(--bs-off-white)" }}
    aria-label="Serviços agendados"
  >
          {services.map((service, idx) => <div key={service.id} className={idx > 0 ? "mt-2" : ""}>
              <div className="flex items-center justify-between">
                <Link
    to={`/servico/${service.id}`}
    onClick={(e) => e.stopPropagation()}
    className="flex items-center gap-2 hover:underline flex-1"
  >
                  <Scissors size={13} color="var(--bs-text-muted)" aria-hidden="true" />
                  <span className="text-[13px]" style={{ color: "var(--bs-text-primary)", fontWeight: 500 }}>
                    {service.name}
                  </span>
                </Link>
                <span className="text-[12px]" style={{ color: "var(--bs-text-secondary)" }}>
                  R$ {service.price.toFixed(2)}
                </span>
              </div>
            </div>)}
        </div>

        {
    /* Row 3: meta info */
  }
        <div className="flex items-center gap-4 mb-3">
          <div className="flex items-center gap-1.5">
            <CalendarIcon size={13} color="var(--bs-gold)" aria-hidden="true" />
            <span className="text-[12px]" style={{ color: "var(--bs-text-secondary)" }}>
              {format(dateObj, "dd 'de' MMM", { locale: ptBR })}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock size={13} color="var(--bs-gold)" aria-hidden="true" />
            <span className="text-[12px]" style={{ color: "var(--bs-text-secondary)" }}>
              {appointment.time}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <User size={13} color="var(--bs-gold)" aria-hidden="true" />
            <span className="text-[12px] truncate" style={{ color: "var(--bs-text-secondary)" }}>
              {appointment.customerName}
            </span>
          </div>
        </div>

        {
    /* Row 4: price + actions */
  }
        {cancelMode && canCancel ? (
    /* Cancel-mode: full-width cancel button */
    <div className="pt-1">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-[10px] uppercase tracking-wide" style={{ color: "var(--bs-text-muted)" }}>
                  Total
                </p>
                <p style={{ fontWeight: 800, fontSize: "1.0625rem", color: "var(--bs-gold-dark)" }}>
                  R$ {totalPrice.toFixed(2)}
                </p>
              </div>
              <span
      className="text-[11px] px-2.5 py-1 rounded-full"
      style={{
        background: isUpcoming ? "rgba(34,197,94,0.1)" : "rgba(156,163,175,0.15)",
        color: isUpcoming ? "var(--bs-success)" : "var(--bs-text-muted)",
        fontWeight: 600
      }}
    >
                {isUpcoming ? "Pr\xF3ximo" : "Realizado"}
              </span>
            </div>
            <button
      onClick={(e) => {
        e.stopPropagation();
        onCancel();
      }}
      className="w-full h-11 rounded-xl flex items-center justify-center gap-2 text-[13px] transition-all duration-200 active:scale-[0.98] focus:outline-none"
      style={{
        background: "var(--bs-error)",
        color: "white",
        fontWeight: 700
      }}
      aria-label="Cancelar agendamento"
    >
              <X size={15} aria-hidden="true" />
              Cancelar Agendamento
            </button>
          </div>
  ) : <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[10px] uppercase tracking-wide" style={{ color: "var(--bs-text-muted)" }}>
                Total
              </p>
              <p style={{ fontWeight: 800, fontSize: "1.0625rem", color: "var(--bs-gold-dark)" }}>
                R$ {totalPrice.toFixed(2)}
              </p>
            </div>

            {canCancel && <div className="flex gap-2">
                <button
    onClick={(e) => {
      e.stopPropagation();
      onCancel();
    }}
    className="h-10 px-4 rounded-xl border text-[13px] transition-all duration-200 active:scale-95 focus:outline-none min-w-[44px]"
    style={{
      borderColor: "var(--bs-error)",
      color: "var(--bs-error)",
      fontWeight: 600,
      background: "transparent"
    }}
    aria-label="Cancelar agendamento"
  >
                  Cancelar
                </button>

                {isUpcoming && <button
    onClick={(e) => {
      e.stopPropagation();
      onReschedule(appointment);
    }}
    className="h-10 px-4 rounded-xl flex items-center gap-1.5 text-[13px] transition-all duration-200 active:scale-95 focus:outline-none min-w-[44px]"
    style={{
      background: "var(--bs-charcoal)",
      color: "white",
      fontWeight: 700
    }}
    aria-label="Reagendar"
  >
                    Reagendar <ChevronRight size={14} aria-hidden="true" />
                  </button>}
              </div>}
          </div>}
      </div>
    </article>;
}
function ErrorState({ message, onRetry }) {
  return <div
    className="rounded-2xl p-8 flex flex-col items-center text-center gap-4"
    style={{ background: "var(--bs-surface)", boxShadow: "var(--bs-shadow-sm)" }}
    role="alert"
  >
      <div
    className="w-16 h-16 rounded-full flex items-center justify-center"
    style={{ background: "var(--bs-error-light)" }}
    aria-hidden="true"
  >
        <AlertCircle size={30} style={{ color: "var(--bs-error)" }} />
      </div>
      <div>
        <p style={{ fontWeight: 700, fontSize: "1.0625rem", color: "var(--bs-text-primary)" }}>
          Algo deu errado
        </p>
        <p className="mt-1 text-[13px]" style={{ color: "var(--bs-text-secondary)" }}>
          {message}
        </p>
      </div>
      <button
    onClick={onRetry}
    className="h-11 px-6 rounded-full flex items-center gap-2 transition-all duration-200 active:scale-[0.97] focus:outline-none"
    style={{ background: "var(--bs-charcoal)", color: "white", fontWeight: 700, fontSize: "0.875rem" }}
  >
        <RefreshCw size={16} aria-hidden="true" />
        Tentar novamente
      </button>
    </div>;
}
function EmptyState({ tab }) {
  const config = {
    all: { title: "Nenhum agendamento", desc: "Voc\xEA ainda n\xE3o tem agendamentos. Que tal marcar um hor\xE1rio agora?", cta: true },
    confirmed: { title: "Nenhum agendamento confirmado", desc: "Voc\xEA n\xE3o tem agendamentos confirmados no momento.", cta: true },
    cancelar: { title: "Nada para cancelar", desc: "Voc\xEA n\xE3o tem agendamentos ativos que possam ser cancelados.", cta: false },
    cancelled: { title: "Nenhum cancelamento", desc: "\xD3timo! Voc\xEA n\xE3o tem agendamentos cancelados.", cta: false }
  };
  const { title, desc, cta } = config[tab];
  return <div
    className="rounded-2xl p-8 flex flex-col items-center text-center gap-4"
    style={{ background: "var(--bs-surface)", boxShadow: "var(--bs-shadow-sm)" }}
    role="status"
    aria-live="polite"
  >
      {
    /* Barber chair illustration */
  }
      <div
    className="w-24 h-24 rounded-full flex items-center justify-center"
    style={{ background: "var(--bs-gold-light)" }}
    aria-hidden="true"
  >
        <BarberChairIcon />
      </div>

      <div>
        <p style={{ fontWeight: 700, fontSize: "1.0625rem", color: "var(--bs-text-primary)" }}>
          {title}
        </p>
        <p className="mt-1 text-[13px]" style={{ color: "var(--bs-text-secondary)" }}>
          {desc}
        </p>
      </div>

      {cta && <Link to="/agendar">
          <button
    className="h-12 px-8 rounded-full flex items-center gap-2 transition-all duration-200 active:scale-[0.97] focus:outline-none"
    style={{
      background: "var(--bs-gold)",
      color: "var(--bs-text-primary)",
      fontWeight: 700,
      fontSize: "0.9375rem",
      boxShadow: "var(--bs-shadow-gold)"
    }}
    aria-label="Fazer um agendamento"
  >
            <Scissors size={18} aria-hidden="true" />
            Agendar agora
          </button>
        </Link>}
    </div>;
}
function AppointmentSkeleton() {
  return <div
    className="rounded-2xl p-4 space-y-3"
    style={{ background: "var(--bs-surface)" }}
    aria-hidden="true"
  >
      <div className="flex items-center gap-3">
        <Skeleton className="w-12 h-12 rounded-full flex-shrink-0" />
        <div className="flex-1 space-y-1.5">
          <Skeleton className="w-32 h-3.5 rounded" />
          <Skeleton className="w-24 h-2.5 rounded" />
        </div>
        <Skeleton className="w-20 h-5 rounded-full" />
      </div>
      <Skeleton className="w-full h-14 rounded-xl" />
      <div className="flex gap-4">
        <Skeleton className="w-16 h-3 rounded" />
        <Skeleton className="w-12 h-3 rounded" />
      </div>
      <div className="flex justify-between items-center">
        <Skeleton className="w-16 h-5 rounded" />
        <div className="flex gap-2">
          <Skeleton className="w-20 h-10 rounded-xl" />
          <Skeleton className="w-24 h-10 rounded-xl" />
        </div>
      </div>
    </div>;
}
function AppointmentDetailsModal({ appointment, open, onClose, onCancel, onReschedule }) {
  const services = appointment.services ?? [];
  const barber = appointment.barber;
  const totalPrice = appointment.totalPrice ?? 0;
  const totalDuration = appointment.totalDuration ?? 0;
  if (!barber) return null;
  const dateObj = parseISO(appointment.date);
  const appointmentDateTime = /* @__PURE__ */ new Date(`${appointment.date}T${appointment.time}`);
  const isUpcoming = isFuture(appointmentDateTime) || isToday(appointmentDateTime);
  const canCancel = CANCELABLE.includes(appointment.status);
  return <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
    className="max-w-[90vw] sm:max-w-md rounded-2xl p-0 gap-0"
    style={{ background: "var(--bs-surface)" }}
  >
        <DialogDescription className="sr-only">
          Detalhes do agendamento selecionado
        </DialogDescription>
        {
    /* Header */
  }
        <div
    className="px-4 py-3 flex items-center justify-between"
    style={{ background: "var(--bs-charcoal)", borderRadius: "1rem 1rem 0 0" }}
  >
          <DialogHeader className="flex-1 p-0">
            <DialogTitle className="text-left" style={{ color: "white", fontWeight: 700, fontSize: "1rem" }}>
              Detalhes do Agendamento
            </DialogTitle>
          </DialogHeader>
          <button
    onClick={onClose}
    className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors duration-150"
    style={{ background: "rgba(255,255,255,0.1)" }}
    aria-label="Fechar"
  >
            <X size={16} color="white" />
          </button>
        </div>

        {
    /* Content */
  }
        <div className="p-4 space-y-4 max-h-[70vh] overflow-y-auto">
          {
    /* Status badge */
  }
          <div className="flex justify-center">
            <StatusBadge status={appointment.status} />
          </div>

          {
    /* Barber */
  }
          <div className="flex items-center gap-3">
            <ImageWithFallback
    src={barber.image}
    alt={`Foto do barbeiro ${barber.name}`}
    className="w-14 h-14 rounded-full object-cover"
    style={{ border: "2px solid var(--bs-gold-light)" }}
  />
            <div className="flex-1">
              <p className="text-[11px] uppercase tracking-wide" style={{ color: "var(--bs-text-muted)" }}>
                Barbeiro
              </p>
              <p style={{ fontWeight: 700, fontSize: "1rem", color: "var(--bs-text-primary)" }}>
                {barber.name}
              </p>
              <p className="text-[13px]" style={{ color: "var(--bs-text-secondary)" }}>
                {barber.specialty}
              </p>
            </div>
          </div>

          <Divider />

          {
    /* Date & Time */
  }
          <div className="flex items-center gap-3">
            <div
    className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
    style={{ background: "var(--bs-gold-light)" }}
    aria-hidden="true"
  >
              <CalendarIcon size={20} color="var(--bs-gold-dark)" />
            </div>
            <div className="flex-1">
              <p className="text-[11px] uppercase tracking-wide" style={{ color: "var(--bs-text-muted)" }}>
                Data & Hora
              </p>
              <p style={{ fontWeight: 700, fontSize: "0.9375rem", color: "var(--bs-text-primary)" }}>
                {format(dateObj, "EEEE, dd 'de' MMMM", { locale: ptBR })}
              </p>
              <div className="flex items-center gap-2 mt-0.5">
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
              Serviços ({services.length})
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
    /* Client info */
  }
          <div className="flex items-center gap-3">
            <div
    className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
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
              Total
            </p>
            <p style={{ fontWeight: 800, fontSize: "1.5rem", color: "var(--bs-gold-dark)" }}>
              R$ {totalPrice.toFixed(2)}
            </p>
          </div>

          {
    /* Actions */
  }
          {canCancel && <div className="flex flex-col gap-2 pt-2">
              {isUpcoming && <button
    onClick={() => onReschedule(appointment)}
    className="w-full h-11 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 active:scale-95 focus:outline-none"
    style={{
      background: "var(--bs-gold)",
      color: "var(--bs-text-primary)",
      fontWeight: 700,
      fontSize: "0.875rem"
    }}
  >
                  <CalendarDays size={16} aria-hidden="true" />
                  Reagendar
                </button>}
              <button
    onClick={onCancel}
    className="w-full h-11 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 active:scale-95 focus:outline-none"
    style={{
      background: "transparent",
      color: "var(--bs-error)",
      border: "2px solid var(--bs-error)",
      fontWeight: 600,
      fontSize: "0.875rem"
    }}
  >
                <X size={16} aria-hidden="true" />
                Cancelar Agendamento
              </button>
            </div>}
        </div>
      </DialogContent>
    </Dialog>;
}
function Divider() {
  return <div
    style={{ height: 1, background: "var(--bs-border)" }}
    role="separator"
    aria-hidden="true"
  />;
}
function BarberChairIcon() {
  return <svg
    width="52"
    height="52"
    viewBox="0 0 52 52"
    fill="none"
    aria-hidden="true"
    role="img"
  >
      {
    /* Scissors */
  }
      <path
    d="M16 16 L36 36 M36 16 L16 36"
    stroke="var(--bs-gold-dark)"
    strokeWidth="3"
    strokeLinecap="round"
  />
      <circle cx="14" cy="14" r="4" fill="none" stroke="var(--bs-gold-dark)" strokeWidth="2.5" />
      <circle cx="38" cy="38" r="4" fill="none" stroke="var(--bs-gold-dark)" strokeWidth="2.5" />
      <circle cx="38" cy="14" r="4" fill="none" stroke="var(--bs-gold)" strokeWidth="2.5" />
      <circle cx="14" cy="38" r="4" fill="none" stroke="var(--bs-gold)" strokeWidth="2.5" />
      {
    /* Center circle */
  }
      <circle cx="26" cy="26" r="4" fill="var(--bs-gold)" />
    </svg>;
}
export {
  Appointments
};
