import rateLimit from "express-rate-limit";

// Limite para rotas sensíveis de autenticação:
// protege contra força-bruta no login e spam de email no forgot-password.
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 20, // máx. de requisições por IP na janela
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Muitas tentativas. Tente novamente em alguns minutos.",
  },
});
