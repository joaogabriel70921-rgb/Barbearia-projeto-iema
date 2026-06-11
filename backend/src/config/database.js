import mongoose from "mongoose";
import dns from "node:dns";

// Se o DNS do sistema estiver apontando só para loopback (ex.: sobra de VPN ou
// proxy de DNS que não responde), o Node não resolve nenhum host — incluindo o
// SRV do Atlas. Nesse caso, usa um DNS público para conseguir conectar.
// Em ambiente normal (DNS de verdade) isso não faz nada.
function ensureUsableDns() {
  try {
    const servers = dns.getServers();
    const onlyLoopback =
      servers.length === 0 ||
      servers.every((s) => s === "127.0.0.1" || s === "::1");
    if (onlyLoopback) {
      dns.setServers(["1.1.1.1", "8.8.8.8"]);
    }
  } catch {
    // se algo falhar aqui, segue com o DNS padrão do sistema
  }
}

export async function connectDatabase() {
  try {
    ensureUsableDns();
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB conectado com sucesso");
  } catch (error) {
    console.log("Erro ao conectar MongoDB:", error.message);
    process.exit(1);
  }
}