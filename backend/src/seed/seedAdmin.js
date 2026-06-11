import "dotenv/config";
import mongoose from "mongoose";
import { connectDatabase } from "../config/database.js";
import { createUser } from "../services/authService.js";
import User from "../models/User.js";

await connectDatabase();

const email =
  process.env.ADMIN_EMAIL ||
  process.env.SEED_ADMIN_EMAIL ||
  "admin@barbearia.com";
const password = process.env.SEED_ADMIN_PASSWORD || "admin123";

// Procura um admin existente (pelo email alvo OU por papel admin) e mantém
// idempotente: garante o email do dono + conta verificada.
const admin = await User.findOne({ $or: [{ email }, { role: "admin" }] });

if (admin) {
  admin.email = email;
  admin.role = "admin";
  admin.verified = true;
  admin.active = true;
  await admin.save();
  console.log("Admin atualizado:", email);
} else {
  await createUser({
    name: "Admin Barbearia",
    email,
    password,
    role: "admin",
    verified: true,
  });

  console.log("Admin criado:", email);
}

await mongoose.disconnect();
