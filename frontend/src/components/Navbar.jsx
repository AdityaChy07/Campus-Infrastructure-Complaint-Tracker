import {
  FaMoon,
  FaSun,
  FaUserCircle,
} from "react-icons/fa";

import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

import NotificationBell from "./NotificationBell";

function Navbar() {
  const { user } = useAuth();

  const { dark, toggleTheme } = useTheme();

  return (
    <header className="navbar">

      <div className="navbar-left">
        <h2>Campus Infrastructure Complaint Tracker</h2>
      </div>

      <div className="nav-right">

        {/* Notifications */}
        <NotificationBell />

        {/* Theme Toggle */}
        <button
          className="theme-btn"
          onClick={toggleTheme}
          title="Toggle Theme"
        >
          {dark ? <FaSun /> : <FaMoon />}
        </button>

        {/* User */}
        <div className="profile-box">

          <FaUserCircle
            className="profile-icon"
          />

          <div className="profile-info">
            <h4>{user?.name}</h4>

            <p>
              {user?.role}
            </p>
          </div>

        </div>

      </div>

    </header>
  );
}

export default Navbar;