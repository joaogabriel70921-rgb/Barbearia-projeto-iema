import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { ApiError } from "../utils/ApiError.js";

export async function createUser({ name, email, phone, password, role = "cliente" }) {
  const userExists = await User.findOne({ email });

  if (userExists) {
    throw new ApiError(400, "Email já cadastrado");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  return User.create({
    name,
    email,
    phone,
    password: hashedPassword,
    role,
  });
}

export async function checkPassword(password, hashedPassword) {
  return bcrypt.compare(password, hashedPassword);
}
