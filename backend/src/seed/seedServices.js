import "dotenv/config";
import mongoose from "mongoose";
import { connectDatabase } from "../config/database.js";
import Service from "../models/Service.js";

await connectDatabase();

const services = [
  {
    name: "Corte Masculino",
    description: "Corte classico ou moderno com acabamento.",
    duration: 30,
    price: 45,
  },
  {
    name: "Barba",
    description: "Modelagem de barba com acabamento.",
    duration: 20,
    price: 30,
  },
  {
    name: "Corte + Barba",
    description: "Combo completo de corte e barba.",
    duration: 45,
    price: 70,
  },
  {
    name: "Platinado",
    description: "Descoloracao e tonalizacao.",
    duration: 90,
    price: 120,
  },
];

for (const service of services) {
  await Service.findOneAndUpdate({ name: service.name }, service, {
    upsert: true,
    new: true,
  });
}

console.log("Servicos iniciais criados/atualizados");
await mongoose.disconnect();
