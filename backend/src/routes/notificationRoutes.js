import express from "express";
import {
  deleteNotification,
  getUnreadCount,
  listMyNotifications,
  markAllRead,
  markRead,
} from "../controllers/notificationController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.get("/", listMyNotifications);
router.get("/unread-count", getUnreadCount);
router.patch("/read-all", markAllRead);
router.patch("/:id/read", markRead);
router.delete("/:id", deleteNotification);

export default router;
