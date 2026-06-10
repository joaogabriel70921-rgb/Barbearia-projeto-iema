import { Navigate } from "react-router";
import { useAuth } from "../context/AuthContext";
function ProtectedRoute({ children }) {
  const { user, isLoading } = useAuth();
  if (isLoading) {
    return <div
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: "var(--bs-off-white)" }}
    >
        <div className="text-center">
          <div
      className="inline-block w-12 h-12 border-4 border-t-transparent rounded-full animate-spin mb-4"
      style={{ borderColor: "var(--bs-gold)", borderTopColor: "transparent" }}
    />
          <p style={{ color: "var(--bs-text-secondary)" }}>Carregando...</p>
        </div>
      </div>;
  }
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}
export {
  ProtectedRoute
};
