import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDatabase } from "./src/config/database.js";
import authRoutes from "./src/routes/authRoutes.js";
import catalogRoutes from "./src/routes/catalogRoutes.js";
import appointmentRoutes from "./src/routes/appointmentRoutes.js";
import employeeRoutes from "./src/routes/employeeRoutes.js";
import notificationRoutes from "./src/routes/notificationRoutes.js";
import adminDashboardRoutes from "./src/routes/adminDashboardRoutes.js";
import adminAppointmentRoutes from "./src/routes/adminAppointmentRoutes.js";
import adminEmployeeRoutes from "./src/routes/adminEmployeeRoutes.js";
import adminClientRoutes from "./src/routes/adminClientRoutes.js";
import adminServiceRoutes from "./src/routes/adminServiceRoutes.js";
import adminReportRoutes from "./src/routes/adminReportRoutes.js";
import adminSettingsRoutes from "./src/routes/adminSettingsRoutes.js";
import { errorHandler, notFound } from "./src/middlewares/errorMiddleware.js";

dotenv.config();

const app = express();

// Origens permitidas via FRONTEND_URL (aceita lista separada por vírgula).
// Sem FRONTEND_URL, libera geral — use apenas em desenvolvimento.
const allowedOrigins = (process.env.FRONTEND_URL || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

if (allowedOrigins.length === 0) {
  console.warn(
    "FRONTEND_URL não definido — CORS liberado para qualquer origem (apenas para desenvolvimento)."
  );
}

app.use(
  cors({
    origin: allowedOrigins.length > 0 ? allowedOrigins : true,
  })
);
app.use(express.json());

connectDatabase();

app.get("/", (req, res) => {
  res.json({
    message: "API da barbearia funcionando",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/catalog", catalogRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/notifications", notificationRoutes);

app.use("/api/admin/dashboard", adminDashboardRoutes);
app.use("/api/admin/appointments", adminAppointmentRoutes);
app.use("/api/admin/employees", adminEmployeeRoutes);
app.use("/api/admin/clients", adminClientRoutes);
app.use("/api/admin/services", adminServiceRoutes);
app.use("/api/admin/reports", adminReportRoutes);
app.use("/api/admin/settings", adminSettingsRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
