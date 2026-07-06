import Notification from "../models/Notification.js";

// ========================================
// Get Logged-in User Notifications
// ========================================
export const getNotifications = async (
  req,
  res
) => {
  try {
    const notifications =
      await Notification.find({
        recipient: req.user._id,
      })
        .sort({ createdAt: -1 })
        .populate("complaint", "title status");

    res.json(notifications);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch notifications",
      error: error.message,
    });
  }
};

// ========================================
// Mark Notification as Read
// ========================================
export const markAsRead = async (
  req,
  res
) => {
  try {
    const notification =
      await Notification.findById(
        req.params.id
      );

    if (!notification) {
      return res.status(404).json({
        message: "Notification not found",
      });
    }

    notification.isRead = true;

    await notification.save();

    res.json({
      message:
        "Notification marked as read",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update notification",
      error: error.message,
    });
  }
};

// ========================================
// Delete Notification
// ========================================
export const deleteNotification =
  async (req, res) => {
    try {
      const notification =
        await Notification.findById(
          req.params.id
        );

      if (!notification) {
        return res.status(404).json({
          message: "Notification not found",
        });
      }

      await notification.deleteOne();

      res.json({
        message:
          "Notification deleted successfully",
      });
    } catch (error) {
      res.status(500).json({
        message: "Failed to delete notification",
        error: error.message,
      });
    }
  };