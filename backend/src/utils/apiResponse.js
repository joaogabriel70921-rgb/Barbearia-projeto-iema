// Helper para padronizar TODAS as respostas de sucesso da API.
// Formato: { success: true, message: string|null, data: any }
export function sendSuccess(res, data = null, message = null, statusCode = 200) {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
}
