import { Link, useLocation } from "react-router";
import { Scissors, UserCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";
function DesktopTopbar() {
  const { pathname } = useLocation();
  const { user } = useAuth();
  const navLinks = [
    { path: "/", label: "In\xEDcio" },
    { path: "/servicos", label: "Servi\xE7os" },
    { path: "/barbeiros", label: "Equipe" },
    { path: "/ajuda", label: "Sobre n\xF3s" }
  ];
  return <header className="hidden lg:block sticky top-0 z-50 bg-white border-b" style={{ borderColor: "var(--bs-border)", boxShadow: "0 4px 20px rgba(0,0,0,0.03)" }}>
      <div className="max-w-7xl mx-auto px-8 h-20 flex items-center justify-between">
        {
    /* Logo */
  }
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
            Barbearia <span style={{ color: "var(--bs-gold)" }}>IEMA</span>
          </span>
        </Link>

        {
    /* Desktop Navigation */
  }
        <nav className="flex items-center gap-8">
          {navLinks.map((link) => {
    const isActive = pathname === link.path;
    return <Link
      key={link.path}
      to={link.path}
      className="relative text-[15px] font-medium transition-colors"
      style={{ color: isActive ? "var(--bs-text-primary)" : "var(--bs-text-secondary)" }}
    >
                {link.label}
                {isActive && <span className="absolute -bottom-2 left-0 right-0 h-0.5 rounded-full" style={{ background: "var(--bs-gold)" }} />}
              </Link>;
  })}
        </nav>

        {
    /* Actions */
  }
        <div className="flex items-center gap-4">
          <Link to="/agendamentos" className="text-[14px] font-medium hover:text-[var(--bs-gold)] transition-colors" style={{ color: "var(--bs-text-secondary)" }}>
            Meus Agendamentos
          </Link>
          <Link to="/agendar">
            <button
    className="h-10 px-5 rounded-full flex items-center gap-2 transition-all duration-200 hover:scale-105 active:scale-95 focus:outline-none"
    style={{
      background: "var(--bs-charcoal)",
      color: "white",
      fontWeight: 600,
      fontSize: "0.875rem"
    }}
  >
              Agendar Agora
            </button>
          </Link>
          <Link
    to="/perfil"
    className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:bg-gray-100"
    aria-label="Perfil do usuário"
  >
            <UserCircle size={24} style={{ color: "var(--bs-text-primary)" }} />
          </Link>
        </div>
      </div>
    </header>;
}
export {
  DesktopTopbar
};
