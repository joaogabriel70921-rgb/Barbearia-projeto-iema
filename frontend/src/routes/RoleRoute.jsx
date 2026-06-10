import { Navigate, useLocation } from "react-router";
import { useAuth, ROLE_HOME } from "../contexts/AuthContext.jsx";

// Protege rotas: exige login e, opcionalmente, um papel específico.
export function RoleRoute({ role, children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-muted-foreground">
        Carregando...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (role && user.role !== role) {
    // Usuário logado tentando acessar área de outro papel → manda pra dele.
    return <Navigate to={ROLE_HOME[user.role] ?? "/login"} replace />;
  }

  return children;
}
