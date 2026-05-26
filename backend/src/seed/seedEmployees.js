import "dotenv/config";
import mongoose from "mongoose";
import { connectDatabase } from "../config/database.js";
import Employee from "../models/Employee.js";
import User from "../models/User.js";
import { createUser } from "../services/authService.js";

await connectDatabase();

const employees = [
  {
    name: "Carlos Silva",
    email: "carlos@barbearia.com",
    phone: "(11) 98765-4321",
    password: "func123",
    position: "Barbeiro Senior",
    specialties: ["Corte Masculino", "Barba", "Degrade"],
  },
  {
    name: "Bruno Santos",
    email: "bruno@barbearia.com",
    phone: "(11) 91234-5678",
    password: "func123",
    position: "Barbeiro",
    specialties: ["Corte Masculino", "Platinado"],
  },
];

for (const item of employees) {
  let user = await User.findOne({ email: item.email });

  if (!user) {
    user = await createUser({ ...item, role: "funcionario" });
  }

  await Employee.findOneAndUpdate(
    { userId: user._id },
    {
      userId: user._id,
      position: item.position,
      specialties: item.specialties,
      status: "offline",
    },
    { upsert: true, new: true }
  );
}

console.log("Funcionarios iniciais criados/atualizados");
await mongoose.disconnect();
