import Complaint from "../models/Complaint.js";
import Notification from "../models/Notification.js";
import User from "../models/User.js";

// ===============================
// Create Complaint
// ===============================
export const createComplaint = async (req, res) => {
  try {
    const {
      title,
      category,
      description,
      building,
      floor,
      room,
      image,
    } = req.body;

    if (
      !title ||
      !category ||
      !description ||
      !building ||
      !floor ||
      !room
    ) {
      return res.status(400).json({
        message: "Please fill all required fields",
      });
    }

    const complaint = await Complaint.create({
      title,
      category,
      description,
      building,
      floor,
      room,
      image: image || "",
      student: req.user._id,
      status: "Pending",
    });

    // ===============================
    // Notify All Admins
    // ===============================

    const admins = await User.find({
      role: "admin",
    });

    for (const admin of admins) {
      await Notification.create({
        recipient: admin._id,
        title: "New Complaint Submitted",
        message: `${req.user.name} submitted a new complaint: ${complaint.title}`,
        complaint: complaint._id,
      });
    }

    return res.status(201).json({
      message: "Complaint created successfully",
      complaint,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error creating complaint",
      error: error.message,
    });
  }
};

// ===============================
// Get Logged-in User's Complaints
// ===============================
export const getComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({
      student: req.user._id,
    }).sort({ createdAt: -1 });

    return res.status(200).json(complaints);
  } catch (error) {
    return res.status(500).json({
      message: "Error fetching complaints",
      error: error.message,
    });
  }
};

// ===============================
// Get Single Complaint
// ===============================
export const getComplaintById = async (req, res) => {
  try {
    const complaint = await Complaint.findById(
      req.params.id
    );

    if (!complaint) {
      return res.status(404).json({
        message: "Complaint not found",
      });
    }

    if (
      complaint.student.toString() !==
        req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        message:
          "Not authorized to view this complaint",
      });
    }

    return res.status(200).json(complaint);
  } catch (error) {
    return res.status(500).json({
      message: "Error fetching complaint",
      error: error.message,
    });
  }
};

// ===============================
// Update Complaint
// ===============================
export const updateComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(
      req.params.id
    );

    if (!complaint) {
      return res.status(404).json({
        message: "Complaint not found",
      });
    }

    // Only complaint owner can update
    if (
      complaint.student.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        message:
          "Not authorized to update this complaint",
      });
    }

// Students can edit only pending complaints
if (
  req.user.role === "student" &&
  complaint.status !== "Pending"
) {
  return res.status(400).json({
    message:
      "Complaint cannot be edited after it is under process.",
  });
}

    complaint.title =
      req.body.title || complaint.title;

    complaint.category =
      req.body.category ||
      complaint.category;

    complaint.description =
      req.body.description ||
      complaint.description;

    complaint.building =
      req.body.building ||
      complaint.building;

    complaint.floor =
      req.body.floor ||
      complaint.floor;

    complaint.room =
      req.body.room ||
      complaint.room;

    if (req.body.image !== undefined) {
      complaint.image = req.body.image;
    }

    const updatedComplaint =
      await complaint.save();

    return res.status(200).json({
      message:
        "Complaint updated successfully",
      complaint: updatedComplaint,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error updating complaint",
      error: error.message,
    });
  }
};

// ===============================
// Delete Complaint
// ===============================
export const deleteComplaint = async (
  req,
  res
) => {
  try {
    const complaint = await Complaint.findById(
      req.params.id
    );

    if (!complaint) {
      return res.status(404).json({
        message: "Complaint not found",
      });
    }

    if (
      complaint.student.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        message:
          "Not authorized to delete this complaint",
      });
    }

// Students can delete only pending complaints
if (
  req.user.role === "student" &&
  complaint.status !== "Pending"
) {
  return res.status(400).json({
    message:
      "Complaint cannot be deleted after it is under process.",
  });
}

    await complaint.deleteOne();

    return res.status(200).json({
      message:
        "Complaint deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error deleting complaint",
      error: error.message,
    });
  }
};

// ===============================
// Dashboard Statistics
// ===============================
export const getComplaintStats = async (
  req,
  res
) => {
  try {
    const complaints = await Complaint.find({
      student: req.user._id,
    });

    const total = complaints.length;

    const pending = complaints.filter(
      (c) => c.status === "Pending"
    ).length;

    const inProgress = complaints.filter(
      (c) =>
        c.status === "In Progress"
    ).length;

    const resolved = complaints.filter(
      (c) =>
        c.status === "Resolved"
    ).length;

    const rejected = complaints.filter(
      (c) =>
        c.status === "Rejected"
    ).length;

    return res.status(200).json({
      total,
      pending,
      inProgress,
      resolved,
      rejected,
    });
  } catch (error) {
    return res.status(500).json({
      message:
        "Error fetching complaint statistics",
      error: error.message,
    });
  }
};