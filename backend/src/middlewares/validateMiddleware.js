import { ApiError } from "../utils/ApiError.js";

export function requireFields(fields) {
  return (req, res, next) => {
    const missingFields = fields.filter((field) => {
      const value = req.body[field];
      return value === undefined || value === null || value === "";
    });

    if (missingFields.length > 0) {
      return next(
        new ApiError(400, "Campos obrigatórios ausentes", missingFields)
      );
    }

    next();
  };
}

export function minLength(field, length) {
  return (req, res, next) => {
    const value = req.body[field];

    if (typeof value === "string" && value.length < length) {
      return next(
        new ApiError(
          400,
          `O campo "${field}" deve ter no mínimo ${length} caracteres`,
          [field]
        )
      );
    }

    next();
  };
}
