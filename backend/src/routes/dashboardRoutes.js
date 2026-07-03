import express from "express";

import {
  getStudentDashboard,
  getAdminDashboard,
  getMaintenanceDashboard,
} from "../controllers/dashboardController.js";

import {
  protect,
} from "../middleware/authMiddleware.js";

import adminOnly from "../middleware/roleMiddleware.js";

const router = express.Router();

/* ==========================================
   Student Dashboard
========================================== */

router.get(
  "/student",
  protect,
  getStudentDashboard
);

/* ==========================================
   Admin Dashboard
========================================== */

router.get(
  "/admin",
  protect,
  adminOnly,
  getAdminDashboard
);

/* ==========================================
   Maintenance Dashboard
========================================== */

router.get(
  "/maintenance",
  protect,
  getMaintenanceDashboard
);

export default router;