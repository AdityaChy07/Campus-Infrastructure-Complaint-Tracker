import express from "express";

import {
  createComplaint,
  getComplaints,
  getComplaintById,
  updateComplaint,
  deleteComplaint,
  getComplaintStats,
} from "../controllers/complaintController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Dashboard Statistics
router.get(
  "/stats",
  protect,
  getComplaintStats
);

// Create Complaint
router.post(
  "/",
  protect,
  createComplaint
);

// Get Logged-in User's Complaints
router.get(
  "/",
  protect,
  getComplaints
);

// Get Single Complaint
router.get(
  "/:id",
  protect,
  getComplaintById
);

// Update Complaint
router.put(
  "/:id",
  protect,
  updateComplaint
);

// Delete Complaint
router.delete(
  "/:id",
  protect,
  deleteComplaint
);

export default router;