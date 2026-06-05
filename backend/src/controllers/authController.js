import crypto from "crypto";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { createUser, checkPassword } from "../services/authService.js";
import { generateToken } from "../utils/generateToken.js";
import { sendPasswordResetEmail } from "../services/notificationService.js";
import { sendSuccess } from "../utils/apiResponse.js";
import { ApiError } from "../utils/ApiError.js";

const RESET_TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hora

function publicUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
  };
}

function hashResetToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export async function register(req, res, next) {
  try {
    // Apenas campos seguros: o "role" NUNCA vem do cliente (default = "cliente").
    const user = await createUser({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      password: req.body.password,
    });

    sendSuccess(
      res,
      { token: generateToken(user), user: publicUser(user) },
      "Conta criada com sucesso",
      201
    );
  } catch (error) {
    next(error);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");

    if (!user || !user.active) {
      throw new ApiError(401, "Email ou senha inválidos");
    }

    const passwordMatches = await checkPassword(password, user.password);

    if (!passwordMatches) {
      throw new ApiError(401, "Email ou senha inválidos");
    }

    sendSuccess(
      res,
      { token: generateToken(user), user: publicUser(user) },
      "Login realizado com sucesso"
    );
  } catch (error) {
    next(error);
  }
}

export async function getMe(req, res) {
  sendSuccess(res, { user: publicUser(req.user) });
}

export async function updateMe(req, res, next) {
  try {
    const allowedFields = ["name", "phone", "email"];
    const update = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        update[field] = req.body[field];
      }
    }

    const user = await User.findByIdAndUpdate(req.user._id, update, {
      new: true,
      runValidators: true,
    });

    sendSuccess(res, { user: publicUser(user) }, "Perfil atualizado");
  } catch (error) {
    next(error);
  }
}

export async function changePassword(req, res, next) {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id).select("+password");
    const passwordMatches = await bcrypt.compare(currentPassword, user.password);

    if (!passwordMatches) {
      throw new ApiError(401, "Senha atual incorreta");
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    sendSuccess(res, null, "Senha alterada com sucesso");
  } catch (error) {
    next(error);
  }
}

export async function forgotPassword(req, res, next) {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    // Só envia o email se o usuário existir e estiver ativo,
    // mas responde sempre da mesma forma para não revelar quais emails existem.
    if (user && user.active) {
      const rawToken = crypto.randomBytes(32).toString("hex");

      await User.updateOne(
        { _id: user._id },
        {
          resetPasswordToken: hashResetToken(rawToken),
          resetPasswordExpires: new Date(Date.now() + RESET_TOKEN_TTL_MS),
        }
      );

      const baseUrl = process.env.FRONTEND_URL || "http://localhost:5173";
      const resetUrl = `${baseUrl}/redefinir-senha?token=${rawToken}`;

      await sendPasswordResetEmail(user, resetUrl);
    }

    sendSuccess(
      res,
      null,
      "Se o email estiver cadastrado, enviaremos instruções de recuperação."
    );
  } catch (error) {
    next(error);
  }
}

export async function resetPassword(req, res, next) {
  try {
    const { token, password } = req.body;

    const user = await User.findOne({
      resetPasswordToken: hashResetToken(token),
      resetPasswordExpires: { $gt: new Date() },
    }).select("+password +resetPasswordToken +resetPasswordExpires");

    if (!user) {
      throw new ApiError(400, "Token inválido ou expirado");
    }

    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    sendSuccess(res, null, "Senha redefinida com sucesso");
  } catch (error) {
    next(error);
  }
}
