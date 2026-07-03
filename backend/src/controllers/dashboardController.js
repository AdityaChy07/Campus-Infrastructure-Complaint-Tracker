import Complaint from "../models/Complaint.js";
import User from "../models/User.js";

/* ===========================================
   Student Dashboard
=========================================== */

export const getStudentDashboard = async (req, res) => {
  try {
    const studentId = req.user._id;

    const total = await Complaint.countDocuments({
      student: studentId,
    });

    const pending = await Complaint.countDocuments({
      student: studentId,
      status: "Pending",
    });

    const inProgress = await Complaint.countDocuments({
      student: studentId,
      status: "In Progress",
    });

    const resolved = await Complaint.countDocuments({
      student: studentId,
      status: "Resolved",
    });

    const rejected = await Complaint.countDocuments({
      student: studentId,
      status: "Rejected",
    });

    const recentComplaints = await Complaint.find({
      student: studentId,
    })
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      total,
      pending,
      inProgress,
      resolved,
      rejected,
      recentComplaints,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ===========================================
   Admin Dashboard
=========================================== */

export const getAdminDashboard = async (req, res) => {
  try {
    const totalUsers =
      await User.countDocuments();

    const students =
      await User.countDocuments({
        role: "student",
      });

    const maintenance =
      await User.countDocuments({
        role: "maintenance",
      });

    const admins =
      await User.countDocuments({
        role: "admin",
      });

    const totalComplaints =
      await Complaint.countDocuments();

    const pending =
      await Complaint.countDocuments({
        status: "Pending",
      });

    const inProgress =
      await Complaint.countDocuments({
        status: "In Progress",
      });

    const resolved =
      await Complaint.countDocuments({
        status: "Resolved",
      });

    const rejected =
      await Complaint.countDocuments({
        status: "Rejected",
      });

    const recentComplaints =
      await Complaint.find()
        .populate("student", "name email")
        .sort({ createdAt: -1 })
        .limit(10);

    res.status(200).json({
      success: true,

      users: {
        totalUsers,
        students,
        maintenance,
        admins,
      },

      complaints: {
        totalComplaints,
        pending,
        inProgress,
        resolved,
        rejected,
      },

      recentComplaints,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ===========================================
   Maintenance Dashboard
=========================================== */

export const getMaintenanceDashboard =
  async (req, res) => {
    try {
      const maintenanceId =
        req.user._id;

      const assigned =
        await Complaint.countDocuments({
          assignedTo: maintenanceId,
        });

      const pending =
        await Complaint.countDocuments({
          assignedTo: maintenanceId,
          status: "Pending",
        });

      const inProgress =
        await Complaint.countDocuments({
          assignedTo: maintenanceId,
          status: "In Progress",
        });

      const resolved =
        await Complaint.countDocuments({
          assignedTo: maintenanceId,
          status: "Resolved",
        });

      const recentComplaints =
        await Complaint.find({
          assignedTo: maintenanceId,
        })
          .populate(
            "student",
            "name email"
          )
          .sort({
            createdAt: -1,
          })
          .limit(5);

      res.status(200).json({
        success: true,

        assigned,
        pending,
        inProgress,
        resolved,

        recentComplaints,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };