import { Sun, Moon } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext.jsx";

// Botão de alternar tema claro/escuro de uma área (cliente | funcionario | admin).
export function ThemeToggle({ area, className = "" }) {
  const { themes, toggleTheme } = useTheme();
  const isDark = themes[area] === "dark";

  return (
    <button
      type="button"
      onClick={() => toggleTheme(area)}
      className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-card text-foreground hover:bg-accent transition-colors font-medium text-sm ${className}`}
    >
      {isDark ? <Sun className="w-4 h-4 text-primary" /> : <Moon className="w-4 h-4 text-primary" />}
      {isDark ? "Mudar para tema claro" : "Mudar para tema escuro"}
    </button>
  );
}
