import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import DashboardLayout from "../../layouts/DashboardLayout";
import { getMaintenanceStats } from "../../services/maintenanceService";

function MaintenanceDashboard() {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await getMaintenanceStats();
      setStats(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <DashboardLayout>
      <Sidebar />

      <h1>Maintenance Dashboard</h1>

      <div className="stats-grid">
        <div className="stat-card">
          <h2>{stats.total}</h2>
          <p>Total Assigned</p>
        </div>

        <div className="stat-card">
          <h2>{stats.pending}</h2>
          <p>Pending</p>
        </div>

        <div className="stat-card">
          <h2>{stats.inProgress}</h2>
          <p>In Progress</p>
        </div>

        <div className="stat-card">
          <h2>{stats.resolved}</h2>
          <p>Resolved</p>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default MaintenanceDashboard;