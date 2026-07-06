import express from "express";

import {
  getNotifications,
  markAsRead,
  deleteNotification,
} from "../controllers/notificationController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// ===============================
// Get Logged-in User Notifications
// ===============================
router.get(
  "/",
  protect,
  getNotifications
);

// ===============================
// Mark Notification as Read
// ===============================
router.put(
  "/:id/read",
  protect,
  markAsRead
);

// ===============================
// Delete Notification
// ===============================
router.delete(
  "/:id",
  protect,
  deleteNotification
);

export default router;