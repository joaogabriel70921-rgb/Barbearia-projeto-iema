import { ApiError } from "../utils/ApiError.js";

export function notFound(req, res, next) {
  next(new ApiError(404, `Rota não encontrada: ${req.originalUrl}`));
}

export function errorHandler(error, req, res, next) {
  let statusCode =
    error.statusCode || (res.statusCode === 200 ? 500 : res.statusCode);
  let message = error.message || "Erro interno do servidor";
  let fields = error.fields;

  // Tratamento amigável dos erros mais comuns do Mongoose
  if (error.code === 11000) {
    statusCode = 400;
    const campo = Object.keys(error.keyValue || {})[0];
    message = campo
      ? `Já existe um registro com esse "${campo}"`
      : "Valor duplicado";
    if (campo) fields = [campo];
  } else if (error.name === "ValidationError") {
    statusCode = 400;
    fields = Object.keys(error.errors || {});
    message = "Dados inválidos";
  } else if (error.name === "CastError") {
    statusCode = 400;
    message = "Identificador inválido";
  }

  // Registra erros inesperados (5xx) para facilitar o debug em produção.
  if (statusCode >= 500) {
    console.error("Erro interno:", error);
  }

  const payload = {
    success: false,
    message,
  };

  if (fields) {
    payload.fields = fields;
  }

  res.status(statusCode).json(payload);
}
