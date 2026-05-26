import express from "express";
import {
  createAppointment,
  deleteAppointment,
  getAppointment,
  listAppointments,
  rescheduleAppointment,
  updateAppointment,
  updateAppointmentStatus,
} from "../controllers/adminAppointmentController.js";
import { onlyAdmin, protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(protect);
router.use(onlyAdmin);

router.get("/", listAppointments);
router.get("/:id", getAppointment);
router.post("/", createAppointment);
router.patch("/:id", updateAppointment);
router.delete("/:id", deleteAppointment);
router.patch("/:id/status", updateAppointmentStatus);
router.patch("/:id/reschedule", rescheduleAppointment);

export default router;
