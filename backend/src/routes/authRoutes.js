import express from "express";
import {
  changePassword,
  getMe,
  login,
  register,
} from "../controllers/authController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { requireFields } from "../middlewares/validateMiddleware.js";

const router = express.Router();

router.post("/register", requireFields(["name", "email", "password"]), register);
router.post("/login", requireFields(["email", "password"]), login);
router.get("/me", protect, getMe);
router.patch(
  "/change-password",
  protect,
  requireFields(["currentPassword", "newPassword"]),
  changePassword
);

export default router;
