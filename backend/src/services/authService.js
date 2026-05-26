import bcrypt from "bcryptjs";
import User from "../models/User.js";

export async function createUser({ name, email, phone, password, role = "cliente" }) {
  const userExists = await User.findOne({ email });

  if (userExists) {
    const error = new Error("Email ja cadastrado");
    error.statusCode = 400;
    throw error;
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
