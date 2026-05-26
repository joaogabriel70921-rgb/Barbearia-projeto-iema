import express from "express";
import {
  acceptAppointment,
  completeAppointment,
  getEmployeeMe,
  getMyAvailability,
  listEmployeeAppointments,
  markNoShow,
  rejectAppointment,
  startAppointment,
  suggestAppointmentTime,
  updateEmployeeMe,
  updateEmployeeStatus,
  updateMyAvailability,
} from "../controllers/employeeController.js";
import { onlyEmployee, protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(protect);
router.use(onlyEmployee);

router.get("/me", getEmployeeMe);
router.patch("/me", updateEmployeeMe);
router.patch("/me/status", updateEmployeeStatus);

router.get("/me/availability", getMyAvailability);
router.put("/me/availability", updateMyAvailability);

router.get("/me/appointments", listEmployeeAppointments);
router.patch("/me/appointments/:id/accept", acceptAppointment);
router.patch("/me/appointments/:id/reject", rejectAppointment);
router.patch("/me/appointments/:id/start", startAppointment);
router.patch("/me/appointments/:id/complete", completeAppointment);
router.patch("/me/appointments/:id/no-show", markNoShow);
router.post("/me/appointments/:id/suggest-time", suggestAppointmentTime);

export default router;
