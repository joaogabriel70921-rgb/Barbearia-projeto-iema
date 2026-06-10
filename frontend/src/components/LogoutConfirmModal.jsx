import { createPortal } from "react-dom";
import { LogOut } from "lucide-react";

// Modal de confirmação de logout. Renderizado via portal no body, com estilo
// próprio (independente do tema da área) para ficar consistente em todas as telas.
export function LogoutConfirmModal({ open, onCancel, onConfirm }) {
  if (!open) return null;
  return createPortal(
    <div
      onClick={onCancel}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 10000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0,0,0,0.6)",
        backdropFilter: "blur(2px)",
        padding: 16,
        animation: "fadeIn 0.15s ease",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="logout-confirm-title"
        style={{
          width: "100%",
          maxWidth: 390,
          background: "#2E2823",
          border: "1px solid rgba(212,167,69,0.25)",
          borderRadius: 16,
          padding: 24,
          boxShadow: "0 24px 60px rgba(0,0,0,0.55)",
          color: "#FFFEFA",
          fontFamily: "Inter, system-ui, sans-serif",
        }}
      >
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 9999,
            background: "rgba(217,64,64,0.14)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 14,
          }}
        >
          <LogOut size={22} color="#e06363" />
        </div>
        <h3 id="logout-confirm-title" style={{ fontSize: "1.125rem", fontWeight: 700, marginBottom: 6 }}>
          Sair da conta?
        </h3>
        <p style={{ fontSize: "0.9rem", color: "#cfc7bb", marginBottom: 22, lineHeight: 1.5 }}>
          Você precisará entrar novamente para acessar a sua conta.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
          <button
            onClick={onCancel}
            style={{
              padding: "10px 18px",
              borderRadius: 10,
              fontWeight: 600,
              fontSize: "0.9rem",
              background: "transparent",
              color: "#FFFEFA",
              border: "1px solid rgba(255,255,255,0.18)",
              cursor: "pointer",
            }}
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            style={{
              padding: "10px 18px",
              borderRadius: 10,
              fontWeight: 700,
              fontSize: "0.9rem",
              background: "#D94040",
              color: "#fff",
              border: "none",
              cursor: "pointer",
            }}
          >
            Sair
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
