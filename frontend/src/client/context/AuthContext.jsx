// As telas convertidas do cliente importam o auth daqui.
// Reexportamos o AuthContext único da aplicação para manter um só estado de login.
export {
  AuthProvider,
  useAuth,
  ROLE_HOME,
} from "../../contexts/AuthContext.jsx";
