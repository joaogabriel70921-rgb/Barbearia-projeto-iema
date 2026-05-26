import express from "express";
import {
  cancelMyAppointment,
  createAppointment,
  getMyAppointment,
  listMyAppointments,
  rescheduleMyAppointment,
} from "../controllers/appointmentController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.post("/", createAppointment);
router.get("/me", listMyAppointments);
router.get("/:id", getMyAppointment);
router.patch("/:id/cancel", cancelMyAppointment);
router.patch("/:id/reschedule", rescheduleMyAppointment);

export default router;
