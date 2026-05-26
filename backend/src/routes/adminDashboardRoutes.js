import express from "express";
import {
  getDashboardSummary,
  getOnlineEmployees,
  getTodayAppointments,
} from "../controllers/adminDashboardController.js";
import { onlyAdmin, protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(protect);
router.use(onlyAdmin);

router.get("/summary", getDashboardSummary);
router.get("/today-appointments", getTodayAppointments);
router.get("/online-employees", getOnlineEmployees);

export default router;
