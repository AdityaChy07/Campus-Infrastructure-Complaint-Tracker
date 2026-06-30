import express from "express";

import {
  getAssignedComplaints,
  updateAssignedComplaintStatus,
  getMaintenanceStats,
} from "../controllers/maintenanceController.js";

import {
  protect,
  maintenanceOnly,
} from "../middleware/authMiddleware.js";

const router = express.Router();

// ===============================
// Dashboard Statistics
// ===============================
router.get(
  "/stats",
  protect,
  maintenanceOnly,
  getMaintenanceStats
);

// ===============================
// Assigned Complaints
// ===============================
router.get(
  "/complaints",
  protect,
  maintenanceOnly,
  getAssignedComplaints
);

// ===============================
// Update Complaint Status
// ===============================
router.put(
  "/complaints/:id/status",
  protect,
  maintenanceOnly,
  updateAssignedComplaintStatus
);

export default router;