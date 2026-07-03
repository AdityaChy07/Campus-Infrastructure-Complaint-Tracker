import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import DashboardLayout from "../../layouts/DashboardLayout";
import DashboardChart from "../../components/DashboardChart";
import StatCard from "../../components/StatCard";

import { useAuth } from "../../context/AuthContext";

import { getStudentDashboard } from "../../services/dashboardService";

import { toast } from "react-toastify";

function Dashboard() {
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);

  const [studentStats, setStudentStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0,
    rejected: 0,
  });

  const [recentComplaints, setRecentComplaints] = useState([]);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);

      const data = await getStudentDashboard();

      setStudentStats({
        total: data.total,
        pending: data.pending,
        inProgress: data.inProgress,
        resolved: data.resolved,
        rejected: data.rejected,
      });

      setRecentComplaints(data.recentComplaints || []);
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
          "Failed to load dashboard"
      );
    } finally {
      setLoading(false);
    }
  };
    return (
    <DashboardLayout>
      <div className="dashboard-header">
        <h1>Student Dashboard</h1>

        <p>
          Welcome,
          <strong> {user?.name}</strong>
        </p>
      </div>

      {loading ? (
        <p>Loading Dashboard...</p>
      ) : (
        <>
          {/* ================= QUICK ACTIONS ================= */}

          <div className="quick-actions">
            <Link
              to="/submit"
              className="action-btn"
            >
              Submit Complaint
            </Link>

            <Link
              to="/complaints"
              className="action-btn"
            >
              My Complaints
            </Link>

            <Link
              to="/profile"
              className="action-btn"
            >
              Profile
            </Link>
          </div>

          {/* ================= STATISTICS ================= */}

          <div className="stats-grid">

            <StatCard
              title="Total Complaints"
              value={studentStats.total}
              type="total"
            />

            <StatCard
              title="Pending"
              value={studentStats.pending}
              type="pending"
            />

            <StatCard
              title="In Progress"
              value={studentStats.inProgress}
              type="progress"
            />

            <StatCard
              title="Resolved"
              value={studentStats.resolved}
              type="resolved"
            />

            <StatCard
              title="Rejected"
              value={studentStats.rejected}
              type="rejected"
            />

          </div>

          {/* ================= CHART ================= */}

          <div className="dashboard-section">

            <DashboardChart
              title="Complaint Status"
              stats={studentStats}
            />

          </div>

          {/* ================= RECENT COMPLAINTS ================= */}

          <div className="dashboard-section">

            <h2>Recent Complaints</h2>

            {recentComplaints.length === 0 ? (
              <p>
                You haven't submitted any complaints yet.
              </p>
            ) : (
              <div className="complaints-grid">

                {recentComplaints.map(
                  (complaint) => (
                    <div
                      key={complaint._id}
                      className="complaint-card"
                    >
                      <h3>
                        {complaint.title}
                      </h3>

                      <p>
                        <strong>Category:</strong>{" "}
                        {complaint.category}
                      </p>

                      <p>
                        <strong>Status:</strong>{" "}
                        {complaint.status}
                      </p>

                      <p>
                        <strong>Building:</strong>{" "}
                        {complaint.building}
                      </p>

                      <p>
                        <strong>Room:</strong>{" "}
                        {complaint.room}
                      </p>

                      <p>
                        <strong>Created:</strong>{" "}
                        {new Date(
                          complaint.createdAt
                        ).toLocaleDateString()}
                      </p>

                      <Link
                        to={`/complaints/${complaint._id}`}
                        className="action-btn"
                        style={{
                          marginTop: "12px",
                          display: "inline-block",
                        }}
                      >
                        View Details
                      </Link>

                    </div>
                  )
                )}

              </div>
            )}

          </div>
        </>
      )}
    </DashboardLayout>
  );
}

export default Dashboard;