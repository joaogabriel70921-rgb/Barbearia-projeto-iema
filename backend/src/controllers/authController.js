import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { createUser, checkPassword } from "../services/authService.js";
import { generateToken } from "../utils/generateToken.js";

function publicUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
  };
}

export async function register(req, res, next) {
  try {
    const user = await createUser(req.body);

    res.status(201).json({
      message: "Conta criada com sucesso",
      token: generateToken(user),
      user: publicUser(user),
    });
  } catch (error) {
    next(error);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");

    if (!user || !user.active) {
      return res.status(401).json({ message: "Email ou senha invalidos" });
    }

    const passwordMatches = await checkPassword(password, user.password);

    if (!passwordMatches) {
      return res.status(401).json({ message: "Email ou senha invalidos" });
    }

    res.json({
      message: "Login realizado com sucesso",
      token: generateToken(user),
      user: publicUser(user),
    });
  } catch (error) {
    next(error);
  }
}

export async function getMe(req, res) {
  res.json({
    user: publicUser(req.user),
  });
}

export async function changePassword(req, res, next) {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id).select("+password");
    const passwordMatches = await bcrypt.compare(currentPassword, user.password);

    if (!passwordMatches) {
      return res.status(401).json({ message: "Senha atual incorreta" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: "Senha alterada com sucesso" });
  } catch (error) {
    next(error);
  }
}
