import api from "./api";

// ================================
// Student Dashboard
// ================================
export const getStudentDashboard = async () => {
  const res = await api.get("/dashboard/student");
  return res.data;
};

// ================================
// Admin Dashboard
// ================================
export const getAdminDashboard = async () => {
  const res = await api.get("/dashboard/admin");
  return res.data;
};

// ================================
// Maintenance Dashboard
// ================================
export const getMaintenanceDashboard = async () => {
  const res = await api.get("/dashboard/maintenance");
  return res.data;
};