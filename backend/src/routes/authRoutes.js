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
import { requireFields, minLength } from "../middlewares/validateMiddleware.js";
import { authLimiter } from "../middlewares/rateLimitMiddleware.js";

const router = express.Router();

router.post(
  "/register",
  authLimiter,
  requireFields(["name", "email", "password"]),
  minLength("password", 6),
  register
);
router.post("/login", authLimiter, requireFields(["email", "password"]), login);
router.post(
  "/forgot-password",
  authLimiter,
  requireFields(["email"]),
  forgotPassword
);
router.post(
  "/reset-password",
  authLimiter,
  requireFields(["token", "password"]),
  minLength("password", 6),
  resetPassword
);

router.get("/me", protect, getMe);
router.patch("/me", protect, updateMe);
router.patch(
  "/change-password",
  protect,
  requireFields(["currentPassword", "newPassword"]),
  minLength("newPassword", 6),
  changePassword
);

export default router;
