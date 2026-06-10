import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useNavigate } from "react-router";
import { authService } from "../services/authService.js";
import { LogoutConfirmModal } from "../components/LogoutConfirmModal.jsx";

const AuthContext = createContext(null);

// Para onde cada papel é redirecionado após o login.
export const ROLE_HOME = {
  cliente: "/",
  funcionario: "/funcionario",
  admin: "/admin",
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [logoutConfirm, setLogoutConfirm] = useState(false);
  const navigate = useNavigate();

  // Ao carregar: se há token, reidrata o usuário via /auth/me.
  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      setLoading(false);
      return;
    }
    authService
      .me()
      .then((u) => setUser(u))
      .catch(() => localStorage.removeItem("auth_token"))
      .finally(() => setLoading(false));
  }, []);

  const redirectByRole = useCallback(
    (u) => navigate(ROLE_HOME[u.role] ?? "/", { replace: true }),
    [navigate]
  );

  const login = useCallback(
    async (email, password) => {
      const { token, user: u } = await authService.login({ email, password });
      localStorage.setItem("auth_token", token);
      setUser(u);
      redirectByRole(u);
      return u;
    },
    [redirectByRole]
  );

  const register = useCallback(
    async (payload) => {
      const { token, user: u } = await authService.register(payload);
      localStorage.setItem("auth_token", token);
      setUser(u);
      redirectByRole(u);
      return u;
    },
    [redirectByRole]
  );

  // logout() apenas ABRE a confirmação; o logout real roda em doLogout().
  const logout = useCallback(() => setLogoutConfirm(true), []);

  const doLogout = useCallback(() => {
    setLogoutConfirm(false);
    localStorage.removeItem("auth_token");
    setUser(null);
    navigate("/login", { replace: true });
  }, [navigate]);

  const updateUser = useCallback(
    (patch) => setUser((prev) => (prev ? { ...prev, ...patch } : prev)),
    []
  );

  const value = {
    user,
    loading,
    isLoading: loading, // alias p/ compatibilidade com telas convertidas
    login,
    register,
    registerAndLogin: register, // alias
    logout,
    forceLogout: doLogout, // logout direto, sem o modal de confirmação
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
      <LogoutConfirmModal
        open={logoutConfirm}
        onCancel={() => setLogoutConfirm(false)}
        onConfirm={doLogout}
      />
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return ctx;
}
