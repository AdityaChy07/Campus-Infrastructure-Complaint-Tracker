import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import DashboardLayout from "../../layouts/DashboardLayout";

import { changePassword } from "../../services/authService";
import { useTheme } from "../../context/ThemeContext";

function Settings() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const { dark, toggleTheme } = useTheme();

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const [emailNotifications, setEmailNotifications] =
    useState(true);

  const [complaintUpdates, setComplaintUpdates] =
    useState(true);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (
      !oldPassword ||
      !newPassword ||
      !confirmPassword
    ) {
      toast.error(
        "Please fill all password fields"
      );
      return;
    }

    if (newPassword.length < 6) {
      toast.error(
        "New password must be at least 6 characters"
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error(
        "Passwords do not match"
      );
      return;
    }

    try {
      setLoading(true);

      const res = await changePassword({
        oldPassword,
        newPassword,
      });

      toast.success(
        res.data?.message ||
          "Password changed successfully"
      );

      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to change password"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSavePreferences = () => {
    toast.success(
      "Preferences saved successfully"
    );
  };

  return (
    <DashboardLayout>

      <div className="settings-page">

        <h1 className="settings-title">
          Settings
        </h1>

        <div className="settings-card">

          <h2>Account Information</h2>

          <div className="settings-info-grid">

            <div className="settings-info-item">
              <span className="settings-label">
                Full Name
              </span>

              <span className="settings-value">
                {user?.name || "N/A"}
              </span>
            </div>

            <div className="settings-info-item">
              <span className="settings-label">
                Email
              </span>

              <span className="settings-value">
                {user?.email || "N/A"}
              </span>
            </div>

            <div className="settings-info-item">
              <span className="settings-label">
                Role
              </span>

              <span className="settings-value">
                {user?.role || "N/A"}
              </span>
            </div>

            <div className="settings-info-item">
              <span className="settings-label">
                Department
              </span>

              <span className="settings-value">
                {user?.department || "N/A"}
              </span>
            </div>

          </div>

        </div>

        <div className="settings-card">

          <h2>Change Password</h2>

          <form
            className="settings-form"
            onSubmit={handlePasswordChange}
          >

            <div className="settings-form-group">
              <label>Current Password</label>

              <input
                type="password"
                placeholder="Enter current password"
                value={oldPassword}
                onChange={(e) =>
                  setOldPassword(
                    e.target.value
                  )
                }
              />
            </div>

            <div className="settings-form-group">
              <label>New Password</label>

              <input
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) =>
                  setNewPassword(
                    e.target.value
                  )
                }
              />
                          </div>

            <div className="settings-form-group">
              <label>Confirm New Password</label>

              <input
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(
                    e.target.value
                  )
                }
              />
            </div>

            <button
              type="submit"
              className="settings-btn primary-btn"
              disabled={loading}
            >
              {loading
                ? "Updating..."
                : "Update Password"}
            </button>

          </form>

        </div>

        {/* ================= Preferences ================= */}

        <div className="settings-card">

          <h2>Preferences</h2>

          <div className="toggle-list">

            <div className="toggle-item">

              <div>
                <h4>Email Notifications</h4>
                <p>
                  Receive important updates by
                  email
                </p>
              </div>

              <label className="switch">

                <input
                  type="checkbox"
                  checked={emailNotifications}
                  onChange={() =>
                    setEmailNotifications(
                      !emailNotifications
                    )
                  }
                />

                <span className="slider"></span>

              </label>

            </div>

            <div className="toggle-item">

              <div>
                <h4>
                  Complaint Status Updates
                </h4>

                <p>
                  Get notified when complaint
                  status changes
                </p>
              </div>

              <label className="switch">

                <input
                  type="checkbox"
                  checked={complaintUpdates}
                  onChange={() =>
                    setComplaintUpdates(
                      !complaintUpdates
                    )
                  }
                />

                <span className="slider"></span>

              </label>

            </div>

            <div className="toggle-item">

              <div>
                <h4>Dark Mode</h4>

                <p>
                  Switch between Light and Dark
                  Mode
                </p>
              </div>

              <label className="switch">

                <input
                  type="checkbox"
                  checked={dark}
                  onChange={toggleTheme}
                />

                <span className="slider"></span>

              </label>

            </div>

          </div>

          <button
            className="settings-btn primary-btn"
            onClick={handleSavePreferences}
          >
            Save Preferences
          </button>

        </div>

        {/* ================= Danger Zone ================= */}

        <div className="settings-card danger-card">

          <h2>Danger Zone</h2>

          <p>
            Logout from the current session.
          </p>

          <button
            className="settings-btn danger-btn"
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>

      </div>

    </DashboardLayout>
  );
}

export default Settings;