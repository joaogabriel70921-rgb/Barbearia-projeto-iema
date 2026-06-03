import Notification from "../models/Notification.js";
import { sendSuccess } from "../utils/apiResponse.js";
import { ApiError } from "../utils/ApiError.js";

export async function listMyNotifications(req, res, next) {
  try {
    const filter = { userId: req.user._id };

    if (req.query.read === "true") filter.read = true;
    if (req.query.read === "false") filter.read = false;

    const notifications = await Notification.find(filter)
      .sort({ createdAt: -1 })
      .limit(100);

    sendSuccess(res, notifications);
  } catch (error) {
    next(error);
  }
}

export async function getUnreadCount(req, res, next) {
  try {
    const count = await Notification.countDocuments({
      userId: req.user._id,
      read: false,
    });

    sendSuccess(res, { count });
  } catch (error) {
    next(error);
  }
}

export async function markRead(req, res, next) {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { read: true },
      { new: true }
    );

    if (!notification) {
      throw new ApiError(404, "Notificação não encontrada");
    }

    sendSuccess(res, notification, "Notificação marcada como lida");
  } catch (error) {
    next(error);
  }
}

export async function markAllRead(req, res, next) {
  try {
    const result = await Notification.updateMany(
      { userId: req.user._id, read: false },
      { read: true }
    );

    sendSuccess(
      res,
      { modified: result.modifiedCount },
      "Notificações marcadas como lidas"
    );
  } catch (error) {
    next(error);
  }
}

export async function deleteNotification(req, res, next) {
  try {
    const notification = await Notification.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!notification) {
      throw new ApiError(404, "Notificação não encontrada");
    }

    sendSuccess(res, null, "Notificação removida");
  } catch (error) {
    next(error);
  }
}
