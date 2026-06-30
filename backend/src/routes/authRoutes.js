import express from "express";
import {
  registerUser,
  loginUser,
  changePassword,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Register
router.post("/register", registerUser);

// Login
router.post("/login", loginUser);

// Change Password
router.put(
  "/change-password",
  protect,
  changePassword
);

export default router;