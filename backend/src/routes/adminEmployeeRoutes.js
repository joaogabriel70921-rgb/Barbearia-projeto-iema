import express from "express";
import {
  createEmployee,
  deleteEmployee,
  getEmployee,
  getEmployeeAvailability,
  getEmployeeHistory,
  listEmployees,
  updateEmployee,
  updateEmployeeAvailability,
  updateEmployeeStatus,
} from "../controllers/adminEmployeeController.js";
import { onlyAdmin, protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(protect);
router.use(onlyAdmin);

router.get("/", listEmployees);
router.get("/:id", getEmployee);
router.post("/", createEmployee);
router.patch("/:id", updateEmployee);
router.delete("/:id", deleteEmployee);
router.patch("/:id/status", updateEmployeeStatus);
router.get("/:id/availability", getEmployeeAvailability);
router.put("/:id/availability", updateEmployeeAvailability);
router.get("/:id/history", getEmployeeHistory);

export default router;
