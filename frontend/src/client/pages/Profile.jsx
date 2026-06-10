import { useState } from "react";
import { useNavigate } from "react-router";
import {
  User,
  Bell,
  Shield,
  HelpCircle,
  LogOut,
  ChevronRight,
  Scissors,
  Star,
  Phone,
  Mail
} from "lucide-react";
import { BottomNav } from "../components/BottomNav";
import { useAuth } from "../context/AuthContext";
import { ThemeToggle } from "../../components/ThemeToggle.jsx";
const settingsGroups = [
  {
    title: "Conta",
    items: [
      { icon: User, label: "Dados pessoais", sublabel: "Nome, telefone, e-mail", path: "/dados-pessoais" },
      { icon: Bell, label: "Notifica\xE7\xF5es", sublabel: "Push, SMS, e-mail", path: "/notificacoes" },
      { icon: Shield, label: "Privacidade", sublabel: "Dados e seguran\xE7a", path: "/privacidade" }
    ]
  },
  {
    title: "Suporte",
    items: [
      { icon: HelpCircle, label: "Ajuda", sublabel: "FAQ e suporte", path: "/ajuda" }
    ]
  },
  {
    title: "Sess\xE3o",
    items: [
      { icon: LogOut, label: "Sair da conta", danger: true }
    ]
  }
];
function Profile() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  const userInitials = user?.name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase() || "US";
  return <div
    className="min-h-screen pb-24 lg:pb-8"
    style={{ background: "var(--bs-off-white)" }}
  >
      {
    /* Header (mobile only) */
  }
      <header
    className="sticky top-0 z-40 px-4 pt-safe lg:hidden"
    style={{ background: "var(--bs-charcoal)" }}
  >
        <div className="max-w-lg mx-auto flex items-center justify-between h-14">
          <h1 className="text-white" style={{ fontSize: "1.125rem", fontWeight: 700 }}>
            Meu Perfil
          </h1>
          <Scissors size={20} color="var(--bs-gold)" aria-hidden="true" />
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4">
        {
    /* Profile card */
  }
        <div
    className="rounded-2xl p-6 mt-4 flex items-center gap-4"
    style={{ background: "var(--bs-surface)", boxShadow: "var(--bs-shadow-md)" }}
  >
          {
    /* Avatar */
  }
          <div
    className="w-20 h-20 rounded-full flex items-center justify-center flex-shrink-0 text-white"
    style={{
      background: "linear-gradient(135deg, var(--bs-charcoal), var(--bs-charcoal-light))",
      fontSize: "1.75rem",
      fontWeight: 700
    }}
    aria-label={`Avatar do usu\xE1rio: ${userInitials}`}
  >
            {userInitials}
          </div>

          {
    /* Info */
  }
          <div className="flex-1 min-w-0">
            <p style={{ fontWeight: 700, fontSize: "1.125rem", color: "var(--bs-text-primary)" }}>
              {user?.name}
            </p>
            {user?.phone && <div className="flex items-center gap-1.5 mt-1">
                <Phone size={12} color="var(--bs-text-muted)" aria-hidden="true" />
                <p className="text-[13px]" style={{ color: "var(--bs-text-secondary)" }}>
                  {user.phone}
                </p>
              </div>}
            <div className="flex items-center gap-1.5 mt-0.5">
              <Mail size={12} color="var(--bs-text-muted)" aria-hidden="true" />
              <p className="text-[13px]" style={{ color: "var(--bs-text-secondary)" }}>
                {user?.email}
              </p>
            </div>
          </div>

          {
    /* Edit button */
  }
          <button
    onClick={() => navigate("/dados-pessoais")}
    className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl border transition-all duration-200 active:scale-95"
    style={{
      borderColor: "var(--bs-gold)",
      color: "var(--bs-gold)",
      background: "var(--bs-gold-light)"
    }}
    aria-label="Editar perfil"
  >
            <User size={18} />
          </button>
        </div>

        {
    /* Tema da interface */
  }
        <div className="mt-3">
          <ThemeToggle area="cliente" className="w-full" />
        </div>

        {
    /* Settings groups */
  }
        {settingsGroups.map((group) => <div key={group.title} className="mt-5">
            <p
    className="px-1 mb-2 uppercase tracking-widest text-[11px]"
    style={{ color: "var(--bs-text-muted)", fontWeight: 600 }}
  >
              {group.title}
            </p>
            <div
    className="rounded-2xl overflow-hidden divide-y"
    style={{
      background: "var(--bs-surface)",
      boxShadow: "var(--bs-shadow-sm)",
      borderColor: "var(--bs-border)"
    }}
  >
              {group.items.map((item) => {
    const Icon = item.icon;
    const handleClick = () => {
      if (item.danger) {
        handleLogout();
      } else if (item.path) {
        navigate(item.path);
      }
    };
    return <button
      key={item.label}
      onClick={handleClick}
      className="w-full flex items-center gap-3 px-4 py-3.5 min-h-[52px] transition-colors duration-150 text-left active:bg-gray-50 hover:bg-gray-50/70"
      style={{ color: item.danger ? "var(--bs-error)" : "var(--bs-text-primary)" }}
      aria-label={item.label}
    >
                    <span
      className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
      style={{
        background: item.danger ? "var(--bs-error-light)" : "var(--bs-off-white)"
      }}
    >
                      <Icon size={18} aria-hidden="true" />
                    </span>
                    <div className="flex-1 min-w-0">
                      <p style={{ fontWeight: 500 }}>{item.label}</p>
                      {item.sublabel && <p className="text-[12px]" style={{ color: "var(--bs-text-muted)" }}>
                          {item.sublabel}
                        </p>}
                    </div>
                    {!item.danger && <ChevronRight
      size={16}
      aria-hidden="true"
      style={{ color: "var(--bs-text-muted)" }}
    />}
                  </button>;
  })}
            </div>
          </div>)}

        <p
    className="text-center text-[11px] mt-8 mb-2"
    style={{ color: "var(--bs-text-muted)" }}
  >
          Barber Scheduler v1.0.0 · © 2026
        </p>
      </div>

      <BottomNav />
    </div>;
}
export {
  Profile
};
