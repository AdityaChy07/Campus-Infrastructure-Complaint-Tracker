import express from "express";

import {
  getAllUsers,
  getAllComplaints,
  updateComplaintStatus,
  assignComplaint,
  getMaintenanceUsers,
} from "../controllers/adminController.js";

import {
  protect,
  adminOnly,
} from "../middleware/authMiddleware.js";

const router = express.Router();

// Users
router.get(
  "/users",
  protect,
  adminOnly,
  getAllUsers
);

// Maintenance Users
router.get(
  "/maintenance-users",
  protect,
  adminOnly,
  getMaintenanceUsers
);

// Complaints
router.get(
  "/complaints",
  protect,
  adminOnly,
  getAllComplaints
);

// Update Status
router.put(
  "/complaints/:id/status",
  protect,
  adminOnly,
  updateComplaintStatus
);

// Assign Complaint
router.put(
  "/complaints/:id/assign",
  protect,
  adminOnly,
  assignComplaint
);

export default router;