import {
  FaHome,
  FaPlusCircle,
  FaClipboardList,
  FaUser,
  FaCog,
  FaSignOutAlt,
  FaUsers,
  FaTools,
} from "react-icons/fa";

import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className="sidebar">
      <div className="logo">
        <h2>🏢 JUIT</h2>
      </div>

      <nav>
        {/* Student Menu */}
        {user?.role === "student" && (
          <>
            <Link
              to="/dashboard"
              className="nav-link"
            >
              <FaHome /> Dashboard
            </Link>

            <Link
              to="/submit"
              className="nav-link"
            >
              <FaPlusCircle /> Submit Complaint
            </Link>

            <Link
              to="/complaints"
              className="nav-link"
            >
              <FaClipboardList /> My Complaints
            </Link>

            <Link
              to="/profile"
              className="nav-link"
            >
              <FaUser /> Profile
            </Link>

            <Link
              to="/settings"
              className="nav-link"
            >
              <FaCog /> Settings
            </Link>
          </>
        )}

        {/* Admin Menu */}
        {user?.role === "admin" && (
          <>
            <Link
              to="/dashboard"
              className="nav-link"
            >
              <FaHome /> Dashboard
            </Link>

            <Link
              to="/admin/complaints"
              className="nav-link"
            >
              <FaClipboardList /> Manage Complaints
            </Link>

            <Link
              to="/admin/users"
              className="nav-link"
            >
              <FaUsers /> All Users
            </Link>

            <Link
              to="/profile"
              className="nav-link"
            >
              <FaUser /> Profile
            </Link>

            <Link
              to="/settings"
              className="nav-link"
            >
              <FaCog /> Settings
            </Link>
          </>
        )}

        {user?.role === "maintenance" && (
  <>
    <Link
      to="/maintenance/dashboard"
      className="nav-link"
    >
      <FaHome /> Dashboard
    </Link>

    <Link
      to="/maintenance/complaints"
      className="nav-link"
    >
      <FaTools /> Assigned Complaints
    </Link>

    <Link
      to="/profile"
      className="nav-link"
    >
      <FaUser /> Profile
    </Link>

    <Link
      to="/settings"
      className="nav-link"
    >
      <FaCog /> Settings
    </Link>
  </>
)}

      </nav>

      <button
        className="logout-btn"
        onClick={handleLogout}
      >
        <FaSignOutAlt /> Logout
      </button>
    </aside>
  );
}

export default Sidebar;