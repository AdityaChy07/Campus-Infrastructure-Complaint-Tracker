import Complaint from "../models/Complaint.js";
import Notification from "../models/Notification.js";
// ===============================
// Get Assigned Complaints
// ===============================
export const getAssignedComplaints = async (
  req,
  res
) => {
  try {
    const complaints = await Complaint.find({
      assignedTo: req.user._id,
    })
      .populate("student", "name email")
      .sort({ createdAt: -1 });

    res.json(complaints);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching assigned complaints",
      error: error.message,
    });
  }
};

// ===============================
// Update Complaint Status
// ===============================
export const updateAssignedComplaintStatus =
  async (req, res) => {
    try {
      const { status } = req.body;

      const complaint =
        await Complaint.findById(req.params.id);

      if (!complaint) {
        return res.status(404).json({
          message: "Complaint not found",
        });
      }

      // Only assigned maintenance user can update
      if (
        complaint.assignedTo?.toString() !==
        req.user._id.toString()
      ) {
        return res.status(403).json({
          message:
            "You are not assigned to this complaint",
        });
      }

      // Update complaint status
      complaint.status = status;

      await complaint.save();

      // ===============================
      // Notify Student
      // ===============================
      await Notification.create({
        recipient: complaint.student,

        title: "Complaint Status Updated",

        message: `Your complaint "${complaint.title}" is now "${status}".`,

        complaint: complaint._id,
      });

      return res.status(200).json({
        message:
          "Status updated successfully",
        complaint,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Error updating status",
        error: error.message,
      });
    }
  };

  
// ===============================
// Dashboard Statistics
// ===============================
export const getMaintenanceStats =
  async (req, res) => {
    try {
      const complaints =
        await Complaint.find({
          assignedTo: req.user._id,
        });

      const total = complaints.length;

      const pending =
        complaints.filter(
          (c) => c.status === "Pending"
        ).length;

      const inProgress =
        complaints.filter(
          (c) =>
            c.status ===
            "In Progress"
        ).length;

      const resolved =
        complaints.filter(
          (c) => c.status === "Resolved"
        ).length;

      res.json({
        total,
        pending,
        inProgress,
        resolved,
      });
    } catch (error) {
      res.status(500).json({
        message:
          "Error fetching maintenance stats",
        error: error.message,
      });
    }
  };