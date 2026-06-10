import { createContext, useContext, useState, useCallback, useEffect } from "react";

const ThemeContext = createContext(null);
const STORAGE_KEY = "ui_themes";

// Tema padrão por área: cliente/funcionário claros, admin escuro.
const DEFAULTS = { cliente: "light", funcionario: "light", admin: "dark" };

function load() {
  try {
    return { ...DEFAULTS, ...JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}") };
  } catch {
    return { ...DEFAULTS };
  }
}

// Classe CSS aplicada no wrapper de cada área conforme o tema escolhido.
// dark usa a paleta quente (.dark / admin-theme = mesma cor de fundo do admin).
export function areaThemeClass(area, theme) {
  if (theme === "dark") {
    // Inclui `.dark` para ativar as variantes `dark:` do Tailwind nas telas
    // (sem isso, cores tipo `bg-blue-100 dark:bg-blue-900/20` ficavam iguais
    // no claro e no escuro). Os tokens vêm de `.admin-theme` (definida depois
    // no CSS, então prevalece sobre os de `.dark`).
    if (area === "admin") return "admin-theme dark";
    if (area === "cliente") return "client-dark dark";
    return "dark"; // funcionario
  }
  if (area === "funcionario") return "employee-theme";
  if (area === "cliente") return "client-theme";
  return "admin-light"; // admin claro = paleta dourada/branca
}

// Aplica a classe de tema no <html> também, para que conteúdo em PORTAL
// (Dialog, Select, Popover, Toaster) — que é renderizado no document.body, fora
// do wrapper da área — herde os tokens do tema correto (senão fica claro no escuro).
export function useDocumentTheme(themeClass) {
  useEffect(() => {
    const classes = (themeClass || "").split(" ").filter(Boolean);
    if (!classes.length) return undefined;
    const el = document.documentElement;
    el.classList.add(...classes);
    return () => el.classList.remove(...classes);
  }, [themeClass]);
}

export function ThemeProvider({ children }) {
  const [themes, setThemes] = useState(load);

  const toggleTheme = useCallback((area) => {
    setThemes((prev) => {
      const next = { ...prev, [area]: prev[area] === "dark" ? "light" : "dark" };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  return (
    <ThemeContext.Provider value={{ themes, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme deve ser usado dentro de um ThemeProvider");
  }
  return ctx;
}
