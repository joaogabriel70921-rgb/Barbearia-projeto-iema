import { useEffect, useState } from "react";
import { createBrowserRouter, Navigate, Outlet } from "react-router";
import { AuthProvider, useAuth } from "./contexts/AuthContext.jsx";
import { ThemeProvider, useTheme, areaThemeClass, useDocumentTheme } from "./contexts/ThemeContext.jsx";
import { RoleRoute } from "./routes/RoleRoute.jsx";
import { Toaster } from "./client/components/ui/sonner";

// Páginas públicas de autenticação (redesenhadas)
import Login from "./pages/auth/Login.jsx";
import Register from "./pages/auth/Register.jsx";
import ForgotPassword from "./pages/auth/ForgotPassword.jsx";
import ResetPassword from "./pages/auth/ResetPassword.jsx";
import ConfirmEmail from "./pages/auth/ConfirmEmail.jsx";

// Área do cliente (telas convertidas)
import { RootLayout } from "./client/components/RootLayout";
import { Home } from "./client/pages/Home";
import { Booking } from "./client/pages/Booking";
import { BookingSuccess } from "./client/pages/BookingSuccess";
import { Appointments } from "./client/pages/Appointments";
import { Profile } from "./client/pages/Profile";
import { EditProfile } from "./client/pages/EditProfile";
import { Privacy } from "./client/pages/Privacy";
import { Barbers } from "./client/pages/Barbers";
import { BarberDetails } from "./client/pages/BarberDetails";
import { Services } from "./client/pages/Services";
import { ServiceDetails } from "./client/pages/ServiceDetails";
import { Help } from "./client/pages/Help";

// Área do funcionário (100% ligada ao backend via employeeService)
import { EmployeeDashboard } from "./employee/components/Dashboard/EmployeeDashboard";
import { employeeService } from "./services/employeeService.js";

// Área do admin (dashboard monolítico — dados mock por enquanto)
import { AdminDashboard } from "./admin/components/AdminDashboard";

function Providers() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Outlet />
        <Toaster position="top-center" richColors />
      </AuthProvider>
    </ThemeProvider>
  );
}

function ClientArea() {
  const { themes } = useTheme();
  const cls = areaThemeClass("cliente", themes.cliente);
  useDocumentTheme(cls);
  return (
    <div className={`${cls} min-h-screen bg-background`}>
      <RootLayout />
    </div>
  );
}

function EmployeeArea() {
  const { logout } = useAuth();
  const { themes } = useTheme();
  useDocumentTheme(areaThemeClass("funcionario", themes.funcionario));
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    employeeService
      .getMe()
      .then((e) => active && setEmployee(e))
      .catch((e) => active && setError(e?.message || "Erro ao carregar dados do funcionário"))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className={`${areaThemeClass("funcionario", themes.funcionario)} min-h-screen bg-background`}>
      {loading ? (
        <div className="min-h-screen flex items-center justify-center text-muted-foreground">
          Carregando…
        </div>
      ) : error ? (
        <div className="min-h-screen flex flex-col items-center justify-center gap-3 px-4 text-center">
          <p className="text-destructive font-medium">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 rounded-lg bg-primary text-barbershop-dark font-semibold"
          >
            Tentar novamente
          </button>
        </div>
      ) : (
        <EmployeeDashboard employee={employee} onLogout={logout} />
      )}
    </div>
  );
}

function AdminArea() {
  const { logout } = useAuth();
  const { themes } = useTheme();
  const cls = areaThemeClass("admin", themes.admin);
  useDocumentTheme(cls);
  return (
    <div className={`${cls} min-h-screen bg-background`}>
      <AdminDashboard onLogout={logout} />
    </div>
  );
}

const clientRoutes = [
  { path: "/", Component: Home },
  { path: "/agendar", Component: Booking },
  { path: "/agendamento-sucesso", Component: BookingSuccess },
  { path: "/agendamentos", Component: Appointments },
  { path: "/perfil", Component: Profile },
  { path: "/dados-pessoais", Component: EditProfile },
  { path: "/privacidade", Component: Privacy },
  { path: "/barbeiros", Component: Barbers },
  { path: "/barbeiro/:id", Component: BarberDetails },
  { path: "/servicos", Component: Services },
  { path: "/servico/:id", Component: ServiceDetails },
  { path: "/ajuda", Component: Help },
];

export const router = createBrowserRouter([
  {
    element: <Providers />,
    children: [
      { path: "/login", Component: Login },
      { path: "/cadastro", Component: Register },
      { path: "/confirmar-email", Component: ConfirmEmail },
      { path: "/recuperar-senha", Component: ForgotPassword },
      { path: "/redefinir-senha", Component: ResetPassword },

      {
        element: (
          <RoleRoute role="cliente">
            <ClientArea />
          </RoleRoute>
        ),
        children: clientRoutes,
      },

      {
        path: "/funcionario",
        element: (
          <RoleRoute role="funcionario">
            <EmployeeArea />
          </RoleRoute>
        ),
      },

      {
        path: "/admin",
        element: (
          <RoleRoute role="admin">
            <AdminArea />
          </RoleRoute>
        ),
      },

      { path: "*", element: <Navigate to="/login" replace /> },
    ],
  },
]);
