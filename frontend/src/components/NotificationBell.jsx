import { useEffect, useState } from "react";
import {
  getNotifications,
  markAsRead,
  deleteNotification,
} from "../services/notificationService";

import { FaBell, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";

import { formatDistanceToNow } from "date-fns";



function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

useEffect(() => {
  fetchNotifications();

  const interval = setInterval(() => {
    fetchNotifications();
  }, 30000);

  return () => clearInterval(interval);
}, []);

  const fetchNotifications = async () => {
    try {
      const res = await getNotifications();
      setNotifications(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const unreadCount = notifications.filter(
    (notification) => !notification.isRead
  ).length;

  const handleRead = async (id) => {
    try {
      await markAsRead(id);
      fetchNotifications();
    } catch (error) {
      toast.error("Failed to mark notification as read");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteNotification(id);
      toast.success("Notification deleted");
      fetchNotifications();
    } catch (error) {
      toast.error("Failed to delete notification");
    }
  };

  return (
    <div
      style={{
        position: "relative",
        cursor: "pointer",
      }}
    >
      <div
        onClick={() =>
          setShowDropdown(!showDropdown)
        }
      >
        <FaBell size={22} />

        {unreadCount > 0 && (
          <span
            style={{
              position: "absolute",
              top: "-8px",
              right: "-8px",
              background: "red",
              color: "white",
              borderRadius: "50%",
              width: "20px",
              height: "20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "12px",
            }}
          >
            {unreadCount}
          </span>
        )}
      </div>

      {showDropdown && (
        <div
          style={{
            position: "absolute",
            top: "35px",
            right: "0",
            width: "320px",
            background: "white",
            borderRadius: "10px",
            boxShadow:
              "0 0 10px rgba(0,0,0,0.2)",
            zIndex: 100,
            maxHeight: "400px",
            overflowY: "auto",
          }}
        >
          {notifications.length === 0 ? (
            <p
              style={{
                padding: "15px",
              }}
            >
              No notifications
            </p>
          ) : (
            notifications.map(
              (notification) => (
                <div
                  key={notification._id}
                  style={{
                    padding: "12px",
                    borderBottom:
                      "1px solid #ddd",
                    background:
                      notification.isRead
                        ? "#fff"
                        : "#eef6ff",
                  }}
                >
                  <h4>
                    {notification.title}
                  </h4>

                  <p>
  {notification.message}
</p>

<p
  style={{
    fontSize: "12px",
    color: "#777",
    marginTop: "8px",
  }}
>
  {formatDistanceToNow(
    new Date(notification.createdAt),
    { addSuffix: true }
  )}
</p>

                  <div
                    style={{
                      display: "flex",
                      justifyContent:
                        "space-between",
                      marginTop: "10px",
                    }}
                  >
                    {!notification.isRead && (
                      <button
                        onClick={() =>
                          handleRead(
                            notification._id
                          )
                        }
                      >
                        Mark Read
                      </button>
                    )}

                    <button
                      onClick={() =>
                        handleDelete(
                          notification._id
                        )
                      }
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              )
            )
          )}
        </div>
      )}
    </div>
  );
}

export default NotificationBell;