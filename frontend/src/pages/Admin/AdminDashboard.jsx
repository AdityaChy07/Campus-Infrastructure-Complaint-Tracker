import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import DashboardLayout from "../../layouts/DashboardLayout";
import DashboardChart from "../../components/DashboardChart";
import StatCard from "../../components/StatCard";

import { useAuth } from "../../context/AuthContext";

import { getAdminDashboard } from "../../services/dashboardService";

import { toast } from "react-toastify";

function AdminDashboard() {
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);

  const [userStats, setUserStats] = useState({
    totalUsers: 0,
    students: 0,
    maintenance: 0,
    admins: 0,
  });

  const [complaintStats, setComplaintStats] = useState({
    totalComplaints: 0,
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

      const data = await getAdminDashboard();

      setUserStats(data.users);

      setComplaintStats(data.complaints);

      setRecentComplaints(data.recentComplaints);

    } catch (error) {

      console.error(error);

      toast.error(
        error.response?.data?.message ||
        "Failed to load admin dashboard"
      );

    } finally {

      setLoading(false);

    }
  };
    return (
    <DashboardLayout>
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>

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
              to="/admin/complaints"
              className="action-btn"
            >
              Manage Complaints
            </Link>

            <Link
              to="/admin/users"
              className="action-btn"
            >
              Manage Users
            </Link>

            <Link
              to="/profile"
              className="action-btn"
            >
              Profile
            </Link>

          </div>

          {/* ================= USER STATISTICS ================= */}

          <div className="stats-grid">

            <StatCard
              title="Total Users"
              value={userStats.totalUsers}
              type="total"
            />

            <StatCard
              title="Students"
              value={userStats.students}
              type="pending"
            />

            <StatCard
              title="Maintenance"
              value={userStats.maintenance}
              type="progress"
            />

            <StatCard
              title="Admins"
              value={userStats.admins}
              type="resolved"
            />

          </div>

          {/* ================= COMPLAINT STATISTICS ================= */}

          <div className="stats-grid">

            <StatCard
              title="Total Complaints"
              value={complaintStats.totalComplaints}
              type="total"
            />

            <StatCard
              title="Pending"
              value={complaintStats.pending}
              type="pending"
            />

            <StatCard
              title="In Progress"
              value={complaintStats.inProgress}
              type="progress"
            />

            <StatCard
              title="Resolved"
              value={complaintStats.resolved}
              type="resolved"
            />

            <StatCard
              title="Rejected"
              value={complaintStats.rejected}
              type="rejected"
            />

          </div>

          {/* ================= CHART ================= */}

          <div className="dashboard-section">

            <DashboardChart
              title="Complaint Status Overview"
              stats={{
                total: complaintStats.totalComplaints,
                pending: complaintStats.pending,
                inProgress: complaintStats.inProgress,
                resolved: complaintStats.resolved,
                rejected: complaintStats.rejected,
              }}
            />

          </div>

          {/* ================= RECENT COMPLAINTS ================= */}

          <div className="dashboard-section">

            <h2>Recent Complaints</h2>

            {recentComplaints.length === 0 ? (

              <p>No complaints found.</p>

            ) : (

              <div className="complaints-grid">

                {recentComplaints.map((complaint) => (

                  <div
                    key={complaint._id}
                    className="complaint-card"
                  >

                    <h3>{complaint.title}</h3>

                    <p>
                      <strong>Category:</strong>{" "}
                      {complaint.category}
                    </p>

                    <p>
                      <strong>Status:</strong>{" "}
                      {complaint.status}
                    </p>

                    <p>
                      <strong>Student:</strong>{" "}
                      {complaint.student?.name}
                    </p>

                    <p>
                      <strong>Email:</strong>{" "}
                      {complaint.student?.email}
                    </p>

                    <p>
                      <strong>Building:</strong>{" "}
                      {complaint.building}
                    </p>

                    <p>
                      <strong>Created:</strong>{" "}
                      {new Date(
                        complaint.createdAt
                      ).toLocaleDateString()}
                    </p>

                    <Link
                      to={`/admin/complaints`}
                      className="action-btn"
                      style={{
                        marginTop: "12px",
                        display: "inline-block",
                      }}
                    >
                      Manage
                    </Link>

                  </div>

                ))}

              </div>

            )}

          </div>

        </>
      )}

    </DashboardLayout>
  );
}

export default AdminDashboard;