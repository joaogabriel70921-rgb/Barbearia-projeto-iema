import express from "express";
import {
  changePassword,
  forgotPassword,
  getMe,
  login,
  register,
  resendVerificationCode,
  resetPassword,
  updateMe,
  verifyEmail,
} from "../controllers/authController.js";
import { protect } from "../middlewares/authMiddleware.js";
import {
  requireFields,
  strongPassword,
  isEmail,
} from "../middlewares/validateMiddleware.js";
import { authLimiter } from "../middlewares/rateLimitMiddleware.js";

const router = express.Router();

router.post(
  "/register",
  authLimiter,
  requireFields(["name", "email", "password"]),
  isEmail("email"),
  strongPassword("password"),
  register
);
router.post("/login", authLimiter, requireFields(["email", "password"]), login);
router.post(
  "/verify-email",
  authLimiter,
  requireFields(["email", "code"]),
  verifyEmail
);
router.post(
  "/resend-code",
  authLimiter,
  requireFields(["email"]),
  resendVerificationCode
);
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
  strongPassword("password"),
  resetPassword
);

router.get("/me", protect, getMe);
router.patch("/me", protect, updateMe);
router.patch(
  "/change-password",
  protect,
  requireFields(["currentPassword", "newPassword"]),
  strongPassword("newPassword"),
  changePassword
);

export default router;
