import crypto from "crypto";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { createUser, checkPassword } from "../services/authService.js";
import { generateToken } from "../utils/generateToken.js";
import {
  sendPasswordResetEmail,
  sendVerificationEmail,
} from "../services/notificationService.js";
import { sendSuccess } from "../utils/apiResponse.js";
import { ApiError } from "../utils/ApiError.js";

const RESET_TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hora
const VERIFICATION_TTL_MS = 15 * 60 * 1000; // 15 minutos

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
  return crypto.createHash("sha256").update(String(token)).digest("hex");
}

// Código numérico de 6 dígitos para confirmação de email.
function generateVerificationCode() {
  return String(crypto.randomInt(100000, 1000000));
}

export async function register(req, res, next) {
  try {
    const user = await createUser({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      password: req.body.password,
    });

    // A conta nasce NÃO verificada: gera o código, manda por email e bloqueia
    // o login até confirmar. Por isso aqui NÃO retornamos token.
    const code = generateVerificationCode();
    user.verificationCode = hashResetToken(code);
    user.verificationCodeExpires = new Date(Date.now() + VERIFICATION_TTL_MS);
    await user.save();

    sendVerificationEmail(user, code).catch((e) =>
      console.error("Falha ao enviar código de verificação:", e.message)
    );

    sendSuccess(
      res,
      { email: user.email },
      "Conta criada. Enviamos um código de confirmação para o seu email.",
      201
    );
  } catch (error) {
    next(error);
  }
}

export async function verifyEmail(req, res, next) {
  try {
    const { email, code } = req.body;
    const user = await User.findOne({ email }).select(
      "+verificationCode +verificationCodeExpires"
    );

    if (!user) {
      throw new ApiError(400, "Código inválido ou expirado");
    }

    // Já verificado: apenas entra (idempotente).
    if (user.verified) {
      return sendSuccess(
        res,
        { token: generateToken(user), user: publicUser(user) },
        "Email já confirmado"
      );
    }

    const codeMatches =
      user.verificationCode === hashResetToken(code) &&
      user.verificationCodeExpires &&
      user.verificationCodeExpires > new Date();

    if (!codeMatches) {
      throw new ApiError(400, "Código inválido ou expirado");
    }

    user.verified = true;
    user.verificationCode = undefined;
    user.verificationCodeExpires = undefined;
    await user.save();

    sendSuccess(
      res,
      { token: generateToken(user), user: publicUser(user) },
      "Email confirmado com sucesso"
    );
  } catch (error) {
    next(error);
  }
}

export async function resendVerificationCode(req, res, next) {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    // Responde sempre igual para não revelar quais emails existem.
    if (user && !user.verified) {
      const code = generateVerificationCode();
      user.verificationCode = hashResetToken(code);
      user.verificationCodeExpires = new Date(Date.now() + VERIFICATION_TTL_MS);
      await user.save();

      sendVerificationEmail(user, code).catch((e) =>
        console.error("Falha ao reenviar código de verificação:", e.message)
      );
    }

    sendSuccess(
      res,
      null,
      "Se a conta existir e não estiver confirmada, enviamos um novo código."
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

    // 403 (não 401) para o front distinguir "não verificado" de "senha errada".
    if (!user.verified) {
      throw new ApiError(
        403,
        "Confirme seu email para entrar. Enviamos um código para o seu email.",
        ["unverified"]
      );
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
      // 400 (não 401): é erro de input, não de sessão. Com 401 o interceptor do
      // front apagaria o token e deslogaria o usuário ao errar a senha atual.
      throw new ApiError(400, "Senha atual incorreta");
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
