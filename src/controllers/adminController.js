import Complaint from "../models/Complaint.js";
import User from "../models/User.js";
import Notification from "../models/Notification.js";

// ===============================
// Get All Complaints
// ===============================
export const getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .populate("student", "name email")
      .populate("assignedTo", "name email role")
      .sort({ createdAt: -1 });

    res.json(complaints);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching complaints",
      error: error.message,
    });
  }
};

// ===============================
// Get All Users
// ===============================
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");

    res.json(users);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching users",
      error: error.message,
    });
  }
};

// ===============================
// Get Maintenance Users
// ===============================
export const getMaintenanceUsers = async (req, res) => {
  try {
    const users = await User.find({
      role: "maintenance",
    }).select("name email role");

    res.json(users);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching maintenance users",
      error: error.message,
    });
  }
};

// ===============================
// Update Complaint Status
// ===============================
export const updateComplaintStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({
        message: "Complaint not found",
      });
    }

    complaint.status = status;

    await complaint.save();

    res.json({
      message: "Status updated successfully",
      complaint,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating complaint status",
      error: error.message,
    });
  }
};

// ===============================
// Assign Complaint
// ===============================
export const assignComplaint = async (req, res) => {
  try {
    const { assignedTo } = req.body;

    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({
        message: "Complaint not found",
      });
    }

    const maintenanceUser = await User.findById(
      assignedTo
    );

    if (!maintenanceUser) {
      return res.status(404).json({
        message: "Maintenance user not found",
      });
    }

    if (maintenanceUser.role !== "maintenance") {
      return res.status(400).json({
        message:
          "Selected user is not maintenance staff",
      });
    }

    // Assign complaint
    complaint.assignedTo = assignedTo;

    await complaint.save();

    // ===============================
    // Notify Maintenance User
    // ===============================
    await Notification.create({
      recipient: maintenanceUser._id,

      title: "New Complaint Assigned",

      message: `Complaint "${complaint.title}" has been assigned to you.`,

      complaint: complaint._id,
    });

    return res.status(200).json({
      message: "Complaint assigned successfully",
      complaint,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error assigning complaint",
      error: error.message,
    });
  }
};