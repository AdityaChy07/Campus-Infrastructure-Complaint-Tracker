import Complaint from "../models/Complaint.js";

// Create Complaint
export const createComplaint = async (
  req,
  res
) => {
  try {
    const complaint =
      await Complaint.create({
        title: req.body.title,
        category: req.body.category,
        description:
          req.body.description,
        building:
          req.body.building,
        floor: req.body.floor,
        room: req.body.room,
        image:
          req.body.image || "",
        student:
          req.user._id,
      });

    res.status(201).json(
      complaint
    );
  } catch (error) {
    res.status(500).json({
      message:
        "Error creating complaint",
      error: error.message,
    });
  }
};

// Get Logged-in User's Complaints
export const getComplaints =
  async (req, res) => {
    try {
      const complaints =
        await Complaint.find({
          student:
            req.user._id,
        }).sort({
          createdAt: -1,
        });

      res.json(complaints);
    } catch (error) {
      res.status(500).json({
        message:
          "Error fetching complaints",
        error: error.message,
      });
    }
  };

// Get Single Complaint
export const getComplaintById =
  async (req, res) => {
    try {
      const complaint =
        await Complaint.findById(
          req.params.id
        );

      if (!complaint) {
        return res
          .status(404)
          .json({
            message:
              "Complaint not found",
          });
      }

      res.json(complaint);
    } catch (error) {
      res.status(500).json({
        message:
          "Error fetching complaint",
        error: error.message,
      });
    }
  };

// Update Complaint
export const updateComplaint =
  async (req, res) => {
    try {
      const complaint =
        await Complaint.findById(
          req.params.id
        );

      if (!complaint) {
        return res
          .status(404)
          .json({
            message:
              "Complaint not found",
          });
      }

      // Optional ownership check
      if (
        complaint.student.toString() !==
        req.user._id.toString()
      ) {
        return res
          .status(403)
          .json({
            message:
              "Not authorized to update this complaint",
          });
      }

      complaint.title =
        req.body.title ||
        complaint.title;
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
      complaint.status =
        req.body.status ||
        complaint.status;
      complaint.image =
        req.body.image ||
        complaint.image;

      const updatedComplaint =
        await complaint.save();

      res.json(
        updatedComplaint
      );
    } catch (error) {
      res.status(500).json({
        message:
          "Error updating complaint",
        error: error.message,
      });
    }
  };

// Delete Complaint
export const deleteComplaint =
  async (req, res) => {
    try {
      const complaint =
        await Complaint.findById(
          req.params.id
        );

      if (!complaint) {
        return res
          .status(404)
          .json({
            message:
              "Complaint not found",
          });
      }

      // Optional ownership check
      if (
        complaint.student.toString() !==
        req.user._id.toString()
      ) {
        return res
          .status(403)
          .json({
            message:
              "Not authorized to delete this complaint",
          });
      }

      await complaint.deleteOne();

      res.json({
        message:
          "Complaint deleted successfully",
      });
    } catch (error) {
      res.status(500).json({
        message:
          "Error deleting complaint",
        error: error.message,
      });
    }
  };

// Dashboard Statistics
export const getComplaintStats =
  async (req, res) => {
    try {
      const complaints =
        await Complaint.find({
          student:
            req.user._id,
        });

      const total =
        complaints.length;

      const pending =
        complaints.filter(
          (c) =>
            c.status ===
            "Pending"
        ).length;

      const inProgress =
        complaints.filter(
          (c) =>
            c.status ===
            "In Progress"
        ).length;

      const resolved =
        complaints.filter(
          (c) =>
            c.status ===
            "Resolved"
        ).length;

      const rejected =
        complaints.filter(
          (c) =>
            c.status ===
            "Rejected"
        ).length;

      res.json({
        total,
        pending,
        inProgress,
        resolved,
        rejected,
      });
    } catch (error) {
      res.status(500).json({
        message:
          "Error fetching statistics",
        error: error.message,
      });
    }
  };