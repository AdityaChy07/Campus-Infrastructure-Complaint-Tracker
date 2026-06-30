import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

// ===============================
// Register User
// ===============================
export const registerUser = async (
  req,
  res
) => {
  try {
    const {
      name,
      email,
      password,
      role,
      department,
    } = req.body;

    // Check required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        message:
          "Please provide name, email and password",
      });
    }

    // Restrict student registration to JUIT email
if ((role || "student") === "student") {
  if (!email.toLowerCase().endsWith("@juitsolan.in")) {
    return res.status(400).json({
      message:
        "Only JUIT student email addresses (@juitsolan.in) are allowed for student registration.",
    });
  }
}

    // Check if user already exists
    const userExists = await User.findOne({
      email,
    });

    if (userExists) {
      return res.status(400).json({
        message:
          "User already exists with this email",
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword =
      await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "student",
      department: department || "",
    });

    return res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      createdAt: user.createdAt,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error(
      "Register error:",
      error
    );

    return res.status(500).json({
      message: "Registration failed",
      error: error.message,
    });
  }
};

// ===============================
// Login User
// ===============================
export const loginUser = async (
  req,
  res
) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        message:
          "Please provide email and password",
      });
    }

    // Find user
    const user = await User.findOne({
      email,
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // Compare password
    const isMatch =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    return res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      createdAt: user.createdAt,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error(
      "Login error:",
      error
    );

    return res.status(500).json({
      message: "Login failed",
      error: error.message,
    });
  }
};

// ===============================
// Change Password
// ===============================
export const changePassword = async (
  req,
  res
) => {
  try {
    const { oldPassword, newPassword } =
      req.body;

    // Validate input
    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        message:
          "Old password and new password are required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        message:
          "New password must be at least 6 characters long",
      });
    }

    // req.user comes from protect middleware
    const user = await User.findById(
      req.user._id
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Compare old password
    const isMatch =
      await bcrypt.compare(
        oldPassword,
        user.password
      );

    if (!isMatch) {
      return res.status(400).json({
        message:
          "Current password is incorrect",
      });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword =
      await bcrypt.hash(
        newPassword,
        salt
      );

    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({
      message:
        "Password changed successfully",
    });
  } catch (error) {
    console.error(
      "Change password error:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to change password",
      error: error.message,
    });
  }
};