import express from "express";
import {
  getAvailableSlots,
  getEmployee,
  getService,
  listEmployees,
  listServices,
} from "../controllers/catalogController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.get("/services", listServices);
router.get("/services/:id", getService);
router.get("/employees", listEmployees);
router.get("/employees/:id", getEmployee);
router.get("/availability", getAvailableSlots);

export default router;
