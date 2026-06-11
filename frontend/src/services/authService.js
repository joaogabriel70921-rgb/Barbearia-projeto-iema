import { http } from "./http.js";

// Cada método já devolve o conteúdo útil (o `data` do envelope).
export const authService = {
  login: async ({ email, password }) => {
    const body = await http.post("/auth/login", { email, password });
    return body.data; // { token, user }
  },
  register: async (payload) => {
    const body = await http.post("/auth/register", payload);
    return body.data; // { email } (não loga: precisa confirmar o email)
  },
  verifyEmail: async ({ email, code }) => {
    const body = await http.post("/auth/verify-email", { email, code });
    return body.data; // { token, user }
  },
  resendCode: (email) => http.post("/auth/resend-code", { email }),
  me: async () => {
    const body = await http.get("/auth/me");
    return body.data.user; // user
  },
  updateProfile: async (payload) => {
    const body = await http.patch("/auth/me", payload);
    return body.data.user; // user
  },
  changePassword: (payload) => http.patch("/auth/change-password", payload),
  forgotPassword: (email) => http.post("/auth/forgot-password", { email }),
  resetPassword: (payload) => http.post("/auth/reset-password", payload),
};
