import api from "./api";

// Create Complaint
export const createComplaint = (data) => {
  return api.post("/complaints", data);
};

// Get Logged-in User Complaints
export const getComplaints = () => {
  return api.get("/complaints");
};

// Get Single Complaint
export const getComplaintById = (id) => {
  return api.get(`/complaints/${id}`);
};

// Update Complaint
export const updateComplaint = (id, data) => {
  return api.put(`/complaints/${id}`, data);
};

// Delete Complaint
export const deleteComplaint = (id) => {
  return api.delete(`/complaints/${id}`);
};

// Get Dashboard Complaint Stats
export const getComplaintStats = () => {
  return api.get("/complaints/stats");
};