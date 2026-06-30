import jwt from "jsonwebtoken";
import User from "../models/User.js";

// ===============================
// Protect Route
// ===============================
export const protect = async (
  req,
  res,
  next
) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token =
        req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET
      );

      req.user = await User.findById(
        decoded.id
      ).select("-password");

      if (!req.user) {
        return res.status(401).json({
          message: "User not found",
        });
      }

      next();
    } else {
      return res.status(401).json({
        message: "Not authorized, no token",
      });
    }
  } catch (error) {
    return res.status(401).json({
      message: "Not authorized",
      error: error.message,
    });
  }
};

// ===============================
// Admin Only
// ===============================
export const adminOnly = (
  req,
  res,
  next
) => {
  if (
    req.user &&
    req.user.role === "admin"
  ) {
    return next();
  }

  return res.status(403).json({
    message: "Admin access only",
  });
};

// ===============================
// Maintenance Only
// ===============================
export const maintenanceOnly = (
  req,
  res,
  next
) => {
  if (
    req.user &&
    req.user.role === "maintenance"
  ) {
    return next();
  }

  return res.status(403).json({
    message:
      "Maintenance access only",
  });
};