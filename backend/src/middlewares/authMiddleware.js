import jwt from "jsonwebtoken";
import User from "../models/User.js";

export async function protect(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Token nao enviado" });
    }

    const token = authHeader.replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || !user.active) {
      return res.status(401).json({ message: "Usuario nao autorizado" });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: "Token invalido" });
  }
}

export function onlyEmployee(req, res, next) {
  if (!["funcionario", "admin"].includes(req.user.role)) {
    return res.status(403).json({ message: "Acesso permitido apenas para funcionarios" });
  }

  next();
}

export function onlyAdmin(req, res, next) {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Acesso permitido apenas para admin" });
  }

  next();
}
