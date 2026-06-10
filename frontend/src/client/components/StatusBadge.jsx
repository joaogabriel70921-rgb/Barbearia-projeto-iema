import { CheckCircle, Clock, XCircle, Scissors, CheckCheck, UserX } from "lucide-react";
// Status vêm do backend em português:
// pendente | confirmado | em_andamento | concluido | cancelado | nao_compareceu
const config = {
  pendente: {
    label: "Pendente",
    icon: Clock,
    bg: "var(--bs-warning-light)",
    text: "var(--bs-warning)"
  },
  confirmado: {
    label: "Confirmado",
    icon: CheckCircle,
    bg: "var(--bs-success-light)",
    text: "var(--bs-success)"
  },
  em_andamento: {
    label: "Em andamento",
    icon: Scissors,
    bg: "var(--bs-gold-light)",
    text: "var(--bs-gold-darker)"
  },
  concluido: {
    label: "Concluído",
    icon: CheckCheck,
    bg: "var(--bs-success-light)",
    text: "var(--bs-success)"
  },
  cancelado: {
    label: "Cancelado",
    icon: XCircle,
    bg: "var(--bs-error-light)",
    text: "var(--bs-error)"
  },
  nao_compareceu: {
    label: "Não compareceu",
    icon: UserX,
    bg: "var(--bs-error-light)",
    text: "var(--bs-error)"
  }
};
const fallback = {
  label: "—",
  icon: Clock,
  bg: "var(--bs-surface-alt)",
  text: "var(--bs-text-muted)"
};
function StatusBadge({ status, className = "" }) {
  const { label, icon: Icon, bg, text } = config[status] || fallback;
  return <span
    role="status"
    aria-label={label}
    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold ${className}`}
    style={{ background: bg, color: text }}
  >
      <Icon size={11} aria-hidden="true" />
      {label}
    </span>;
}
export {
  StatusBadge
};
