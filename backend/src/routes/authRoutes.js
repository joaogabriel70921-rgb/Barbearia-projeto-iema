import express from "express";
import {
  changePassword,
  forgotPassword,
  getMe,
  login,
  register,
  resetPassword,
  updateMe,
} from "../controllers/authController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { requireFields } from "../middlewares/validateMiddleware.js";

const router = express.Router();

router.post("/register", requireFields(["name", "email", "password"]), register);
router.post("/login", requireFields(["email", "password"]), login);
router.post("/forgot-password", requireFields(["email"]), forgotPassword);
router.post("/reset-password", requireFields(["token", "password"]), resetPassword);

router.get("/me", protect, getMe);
router.patch("/me", protect, updateMe);
router.patch(
  "/change-password",
  protect,
  requireFields(["currentPassword", "newPassword"]),
  changePassword
);

export default router;
