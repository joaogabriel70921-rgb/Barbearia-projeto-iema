import express from "express";
import {
  getCancelledAppointments,
  getCompletedAppointments,
  getEmployeePerformance,
  getNoShows,
  getReportSummary,
  getTopServices,
} from "../controllers/adminReportController.js";
import { onlyAdmin, protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(protect);
router.use(onlyAdmin);

router.get("/summary", getReportSummary);
router.get("/completed-appointments", getCompletedAppointments);
router.get("/cancelled-appointments", getCancelledAppointments);
router.get("/no-shows", getNoShows);
router.get("/top-services", getTopServices);
router.get("/employee-performance", getEmployeePerformance);

export default router;
