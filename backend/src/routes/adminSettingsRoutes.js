import express from "express";
import {
  getAdminProfile,
  getSettings,
  updateAdminProfile,
  updateSettings,
} from "../controllers/adminSettingsController.js";
import { onlyAdmin, protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(protect);
router.use(onlyAdmin);

router.get("/profile", getAdminProfile);
router.patch("/profile", updateAdminProfile);
router.get("/barbershop", getSettings);
router.patch("/barbershop", updateSettings);

export default router;
