import { Link, useLocation } from "react-router";
import { Home, CalendarDays, ClipboardList, UserCircle } from "lucide-react";
const navItems = [
  { path: "/", icon: Home, label: "Home" },
  { path: "/agendar", icon: CalendarDays, label: "Agendar" },
  { path: "/agendamentos", icon: ClipboardList, label: "Agendamentos" },
  { path: "/perfil", icon: UserCircle, label: "Perfil" }
];
function BottomNav() {
  const { pathname } = useLocation();
  return <nav
    aria-label="Navegação principal"
    className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t lg:hidden"
    style={{ borderColor: "var(--bs-border)", boxShadow: "0 -4px 16px rgba(0,0,0,0.08)" }}
  >
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-2">
        {navItems.map(({ path, icon: Icon, label }) => {
    const isActive = pathname === path;
    return <Link
      key={path}
      to={path}
      aria-label={label}
      aria-current={isActive ? "page" : void 0}
      className="flex flex-col items-center justify-center gap-1 min-w-[44px] min-h-[44px] px-3 rounded-xl transition-all duration-200 focus:outline-none"
      style={{
        color: isActive ? "var(--bs-gold)" : "var(--bs-text-muted)"
      }}
    >
              <Icon
      size={22}
      strokeWidth={isActive ? 2.5 : 1.8}
      aria-hidden="true"
    />
              <span
      className="text-[10px] leading-none"
      style={{ fontWeight: isActive ? 600 : 400 }}
    >
                {label}
              </span>
              {isActive && <span
      className="absolute bottom-0 w-1 h-1 rounded-full"
      style={{ background: "var(--bs-gold)" }}
      aria-hidden="true"
    />}
            </Link>;
  })}
      </div>
    </nav>;
}
export {
  BottomNav
};
