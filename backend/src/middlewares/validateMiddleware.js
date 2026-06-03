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
