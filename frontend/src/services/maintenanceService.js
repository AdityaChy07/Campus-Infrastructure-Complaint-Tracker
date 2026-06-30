import api from "./api";

// ===============================
// Dashboard Statistics
// ===============================
export const getMaintenanceStats = () => {
  return api.get("/maintenance/stats");
};

// ===============================
// Assigned Complaints
// ===============================
export const getAssignedComplaints = () => {
  return api.get("/maintenance/complaints");
};

// ===============================
// Update Complaint Status
// ===============================
export const updateMaintenanceStatus = (
  id,
  status
) => {
  return api.put(
    `/maintenance/complaints/${id}/status`,
    { status }
  );
};