import { Link, useLocation, useNavigate } from "react-router";
import { Scissors, Home, CalendarDays, ClipboardList, UserCircle, LogOut, Settings, HelpCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";
function DesktopSidebar() {
  const { pathname } = useLocation();
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const navLinks = [
    { path: "/", label: "In\xEDcio", icon: Home },
    { path: "/agendar", label: "Novo Agendamento", icon: CalendarDays },
    { path: "/agendamentos", label: "Meus Agendamentos", icon: ClipboardList },
    { path: "/perfil", label: "Meu Perfil", icon: UserCircle }
  ];
  const secondaryLinks = [
    { path: "/ajuda", label: "Suporte", icon: HelpCircle },
    { path: "/dados-pessoais", label: "Configura\xE7\xF5es", icon: Settings }
  ];
  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  const userInitials = user?.name?.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase() || "US";
  return <aside className="hidden lg:flex flex-col w-[280px] h-screen sticky top-0 border-r bg-white" style={{ borderColor: "var(--bs-border)", boxShadow: "2px 0 20px rgba(0,0,0,0.02)" }}>
      {
    /* Brand */
  }
      <div className="h-20 px-8 flex items-center border-b" style={{ borderColor: "var(--bs-border)" }}>
        <Link to="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
          <Scissors size={24} color="var(--bs-gold)" aria-hidden="true" />
          <span
    style={{
      fontFamily: "'Inter', sans-serif",
      fontWeight: 800,
      fontSize: "1.25rem",
      color: "var(--bs-text-primary)",
      letterSpacing: "-0.02em"
    }}
  >
            Barber<span style={{ color: "var(--bs-gold)" }}>Scheduler</span>
          </span>
        </Link>
      </div>

      {
    /* Primary Navigation */
  }
      <nav className="px-4 py-8 flex-1 flex flex-col gap-2">
        <p className="px-4 mb-2 text-xs font-bold tracking-wider uppercase" style={{ color: "var(--bs-text-muted)" }}>
          Menu Principal
        </p>
        {navLinks.map((link) => {
    const isActive = pathname === link.path;
    return <Link
      key={link.path}
      to={link.path}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-[15px]`}
      style={{
        background: isActive ? "var(--bs-gold-light)" : "transparent",
        color: isActive ? "var(--bs-gold-dark)" : "var(--bs-text-secondary)"
      }}
    >
              <link.icon size={20} strokeWidth={isActive ? 2.5 : 2} style={{ color: isActive ? "var(--bs-gold-darker)" : "var(--bs-text-muted)" }} />
              {link.label}
            </Link>;
  })}

        <div className="mt-8">
          <p className="px-4 mb-2 text-xs font-bold tracking-wider uppercase" style={{ color: "var(--bs-text-muted)" }}>
            Conta
          </p>
          {secondaryLinks.map((link) => {
    const isActive = pathname.startsWith(link.path);
    return <Link
      key={link.path}
      to={link.path}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-[15px] hover:bg-gray-50`}
      style={{
        background: isActive ? "var(--bs-surface-alt)" : "transparent",
        color: isActive ? "var(--bs-charcoal)" : "var(--bs-text-secondary)"
      }}
    >
                <link.icon size={20} strokeWidth={isActive ? 2.5 : 2} style={{ color: isActive ? "var(--bs-charcoal)" : "var(--bs-text-muted)" }} />
                {link.label}
              </Link>;
  })}
          <button
    onClick={handleLogout}
    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-[15px] hover:bg-red-50 text-red-600 mt-2"
  >
            <LogOut size={20} strokeWidth={2} className="text-red-500" />
            Sair da conta
          </button>
        </div>
      </nav>

      {
    /* User Profile Snippet */
  }
      <div className="p-4 border-t" style={{ borderColor: "var(--bs-border)" }}>
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-50">
          <div
    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
    style={{ background: "var(--bs-charcoal)" }}
  >
            {userInitials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold truncate" style={{ color: "var(--bs-text-primary)" }}>{user?.name || "Usu\xE1rio"}</p>
            <p className="text-xs truncate" style={{ color: "var(--bs-text-muted)" }}>{user?.email || "usuario@email.com"}</p>
          </div>
        </div>
      </div>
    </aside>;
}
export {
  DesktopSidebar
};
