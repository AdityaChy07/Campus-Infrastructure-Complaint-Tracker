import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import DashboardChart from "../../components/DashboardChart";

import {
  getComplaintStats,
  getComplaints,
} from "../../services/complaintService";

import {
  getAllUsers,
  getAllComplaints,
} from "../../services/adminService";

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

  const [studentComplaints, setStudentComplaints] = useState([]);

  const [adminUsers, setAdminUsers] = useState([]);
  const [adminComplaints, setAdminComplaints] = useState([]);

  useEffect(() => {
    if (user?.role === "admin") {
      fetchAdminDashboard();
    } else {
      fetchStudentDashboard();
    }
  }, [user]);

  const fetchStudentDashboard = async () => {
    try {
      setLoading(true);

      const [statsRes, complaintsRes] = await Promise.all([
        getComplaintStats(),
        getComplaints(),
      ]);

      setStudentStats(statsRes.data || {});
      setStudentComplaints(complaintsRes.data || []);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to load dashboard"
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchAdminDashboard = async () => {
    try {
      setLoading(true);

      const [usersRes, complaintsRes] = await Promise.all([
        getAllUsers(),
        getAllComplaints(),
      ]);

      setAdminUsers(usersRes.data || []);
      setAdminComplaints(complaintsRes.data || []);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to load admin dashboard"
      );
    } finally {
      setLoading(false);
    }
  };

  const adminStats = {
    total: adminComplaints.length,
    pending: adminComplaints.filter(
      (c) => c.status === "Pending"
    ).length,
    inProgress: adminComplaints.filter(
      (c) => c.status === "In Progress"
    ).length,
    resolved: adminComplaints.filter(
      (c) => c.status === "Resolved"
    ).length,
    rejected: adminComplaints.filter(
      (c) => c.status === "Rejected"
    ).length,
  };

  const totalUsers = adminUsers.length;

  const recentStudentComplaints = [...studentComplaints].slice(0, 5);

  const recentAdminComplaints = [...adminComplaints].slice(0, 5);

  return (
    <DashboardLayout>
      <div className="dashboard-header">
        <h1>
          {user?.role === "admin"
            ? "Admin Dashboard"
            : "Student Dashboard"}
        </h1>

        <p>
          Welcome,
          <strong> {user?.name}</strong>
        </p>
      </div>

      {loading ? (
        <p>Loading Dashboard...</p>
      ) : user?.role === "admin" ? (
        <>
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
              All Users
            </Link>

            <Link
              to="/profile"
              className="action-btn"
            >
              Profile
            </Link>
          </div>

          <div className="stats-grid">
            <div className="stat-card">
              <h3>Total Users</h3>
              <p>{totalUsers}</p>
            </div>

            <div className="stat-card">
              <h3>Total Complaints</h3>
              <p>{adminStats.total}</p>
            </div>

            <div className="stat-card">
              <h3>Pending</h3>
              <p>{adminStats.pending}</p>
            </div>

            <div className="stat-card">
              <h3>In Progress</h3>
              <p>{adminStats.inProgress}</p>
            </div>

            <div className="stat-card">
              <h3>Resolved</h3>
              <p>{adminStats.resolved}</p>
            </div>

            <div className="stat-card">
              <h3>Rejected</h3>
              <p>{adminStats.rejected}</p>
            </div>
          </div>

          <div className="dashboard-section">
            <DashboardChart
              title="Complaint Status Overview"
              stats={adminStats}
            />
          </div>

          <div className="dashboard-section">
            <h2>Recent Complaints</h2>

            {recentAdminComplaints.length === 0 ? (
              <p>No complaints found.</p>
            ) : (
              <div className="complaints-grid">
                {recentAdminComplaints.map((complaint) => (
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
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      ) : (
        <>
                  {/* STUDENT QUICK ACTIONS */}
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

          {/* STUDENT STATS */}
          <div className="stats-grid">
            <div className="stat-card">
              <h3>Total Complaints</h3>
              <p>{studentStats.total || 0}</p>
            </div>

            <div className="stat-card">
              <h3>Pending</h3>
              <p>{studentStats.pending || 0}</p>
            </div>

            <div className="stat-card">
              <h3>In Progress</h3>
              <p>{studentStats.inProgress || 0}</p>
            </div>

            <div className="stat-card">
              <h3>Resolved</h3>
              <p>{studentStats.resolved || 0}</p>
            </div>

            <div className="stat-card">
              <h3>Rejected</h3>
              <p>{studentStats.rejected || 0}</p>
            </div>
          </div>

          {/* STUDENT CHART */}
          <div className="dashboard-section">
            <DashboardChart
              title="My Complaint Status"
              stats={studentStats}
            />
          </div>

          {/* STUDENT RECENT COMPLAINTS */}
          <div className="dashboard-section">
            <h2>My Recent Complaints</h2>

            {recentStudentComplaints.length === 0 ? (
              <p>
                You have not submitted any complaints yet.
              </p>
            ) : (
              <div className="complaints-grid">
                {recentStudentComplaints.map(
                  (complaint) => (
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

  