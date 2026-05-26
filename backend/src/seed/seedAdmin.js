import "dotenv/config";
import mongoose from "mongoose";
import { connectDatabase } from "../config/database.js";
import { createUser } from "../services/authService.js";
import User from "../models/User.js";

await connectDatabase();

const email = process.env.SEED_ADMIN_EMAIL || "admin@barbearia.com";
const password = process.env.SEED_ADMIN_PASSWORD || "admin123";

const existingAdmin = await User.findOne({ email });

if (existingAdmin) {
  console.log("Admin ja existe:", email);
} else {
  await createUser({
    name: "Admin Barbearia",
    email,
    password,
    role: "admin",
  });

  console.log("Admin criado:", email);
}

await mongoose.disconnect();
