import api from "./api";

// Get Notifications
export const getNotifications = () => {
  return api.get("/notifications");
};

// Mark Notification as Read
export const markAsRead = (id) => {
  return api.put(`/notifications/${id}/read`);
};

// Delete Notification
export const deleteNotification = (id) => {
  return api.delete(`/notifications/${id}`);
};