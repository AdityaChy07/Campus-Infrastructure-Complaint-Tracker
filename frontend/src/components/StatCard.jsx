import {
  FaClipboardList,
  FaClock,
  FaTools,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";

const icons = {
  total: <FaClipboardList />,
  pending: <FaClock />,
  progress: <FaTools />,
  resolved: <FaCheckCircle />,
  rejected: <FaTimesCircle />,
};

const colors = {
  total: "#3b82f6",
  pending: "#f59e0b",
  progress: "#8b5cf6",
  resolved: "#10b981",
  rejected: "#ef4444",
};

function StatCard({ title, value, type }) {
  return (
    <div className="dashboard-stat-card">
      <div
        className="dashboard-stat-icon"
        style={{
          background: colors[type],
        }}
      >
        {icons[type]}
      </div>

      <div className="dashboard-stat-content">
        <h4>{title}</h4>

        <h2>{value}</h2>

        <span className="dashboard-stat-text">
          Live Data
        </span>
      </div>
    </div>
  );
}

export default StatCard;