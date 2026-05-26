export function notFound(req, res, next) {
  res.status(404);
  next(new Error(`Rota nao encontrada: ${req.originalUrl}`));
}

export function errorHandler(error, req, res, next) {
  const statusCode = error.statusCode || (res.statusCode === 200 ? 500 : res.statusCode);

  res.status(statusCode).json({
    message: error.message || "Erro interno do servidor",
  });
}
