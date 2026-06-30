import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

import DashboardLayout from "../../layouts/DashboardLayout";

function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <DashboardLayout>
      <div className="profile-page">
        <div className="profile-card">

          <div className="profile-avatar-section">
            <div className="profile-avatar">
              {user?.name
                ? user.name.charAt(0).toUpperCase()
                : "U"}
            </div>

            <h2>{user?.name || "User"}</h2>

            <p className="profile-role">
              {user?.role
                ? user.role.toUpperCase()
                : "USER"}
            </p>
          </div>

          <div className="profile-details">

            <div className="profile-row">
              <span className="profile-label">
                Full Name
              </span>

              <span className="profile-value">
                {user?.name || "N/A"}
              </span>
            </div>

            <div className="profile-row">
              <span className="profile-label">
                Email
              </span>

              <span className="profile-value">
                {user?.email || "N/A"}
              </span>
            </div>

            <div className="profile-row">
              <span className="profile-label">
                Role
              </span>

              <span className="profile-value">
                {user?.role || "N/A"}
              </span>
            </div>

            <div className="profile-row">
              <span className="profile-label">
                Department
              </span>

              <span className="profile-value">
                {user?.department || "N/A"}
              </span>
            </div>

            <div className="profile-row">
              <span className="profile-label">
                User ID
              </span>

              <span className="profile-value">
                {user?._id || "N/A"}
              </span>
            </div>

            <div className="profile-row">
              <span className="profile-label">
                Joined On
              </span>

              <span className="profile-value">
                {user?.createdAt
                  ? new Date(user.createdAt).toLocaleDateString()
                  : "N/A"}
              </span>
            </div>

          </div>

          <div className="profile-actions">
            <button
              className="profile-btn logout-profile-btn"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
}

export default Profile;