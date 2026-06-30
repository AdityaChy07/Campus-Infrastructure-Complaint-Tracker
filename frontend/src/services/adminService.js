import api from "./api";

// ===============================
// Get All Users
// ===============================
export const getAllUsers = () => {
  return api.get("/admin/users");
};

// ===============================
// Get All Complaints
// ===============================
export const getAllComplaints = () => {
  return api.get("/admin/complaints");
};

// ===============================
// Get All Maintenance Users
// ===============================
export const getMaintenanceUsers = () => {
  return api.get("/admin/maintenance-users");
};

// ===============================
// Update Complaint Status
// ===============================
export const updateComplaintStatus = (
  id,
  status
) => {
  return api.put(
    `/admin/complaints/${id}/status`,
    { status }
  );
};

// ===============================
// Assign Complaint
// ===============================
export const assignComplaint = (
  complaintId,
  assignedTo
) => {
  return api.put(
    `/admin/complaints/${complaintId}/assign`,
    {
      assignedTo,
    }
  );
};