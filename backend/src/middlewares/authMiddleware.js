import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { ApiError } from "../utils/ApiError.js";

export async function protect(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new ApiError(401, "Token não enviado");
    }

    const token = authHeader.replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || !user.active) {
      throw new ApiError(401, "Usuário não autorizado");
    }

    req.user = user;
    next();
  } catch (error) {
    // ApiError lançado acima passa direto; erros do jwt.verify viram "Token inválido".
    next(error instanceof ApiError ? error : new ApiError(401, "Token inválido"));
  }
}

export function onlyEmployee(req, res, next) {
  if (!["funcionario", "admin"].includes(req.user.role)) {
    return next(new ApiError(403, "Acesso permitido apenas para funcionários"));
  }

  next();
}

export function onlyAdmin(req, res, next) {
  if (req.user.role !== "admin") {
    return next(new ApiError(403, "Acesso permitido apenas para admin"));
  }

  next();
}
