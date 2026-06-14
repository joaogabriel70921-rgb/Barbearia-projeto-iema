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

export function isEmail(field) {
  return (req, res, next) => {
    const value = req.body[field];
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (typeof value === "string" && !emailRegex.test(value.trim())) {
      return next(new ApiError(400, "Email inválido", [field]));
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

// Política de senha: mínimo 8 caracteres, com pelo menos uma letra e um número.
// Bloqueia senhas fracas como "12345678" (só número) ou "password" (sem número).
export function strongPassword(field) {
  return (req, res, next) => {
    const value = req.body[field];

    if (typeof value === "string") {
      const hasMinLength = value.length >= 8;
      const hasLetter = /[a-zA-Z]/.test(value);
      const hasNumber = /\d/.test(value);

      if (!hasMinLength || !hasLetter || !hasNumber) {
        return next(
          new ApiError(
            400,
            "A senha deve ter no mínimo 8 caracteres, incluindo letra e número",
            [field]
          )
        );
      }
    }

    next();
  };
}
