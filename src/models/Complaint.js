import mongoose from "mongoose";

const complaintSchema =
  new mongoose.Schema(
    {
      title: {
        type: String,
        required: true,
      },

      category: {
        type: String,
        required: true,
      },

      description: {
        type: String,
        required: true,
      },

      building: String,
      floor: String,
      room: String,

      status: {
        type: String,
        enum: [
          "Pending",
          "In Progress",
          "Resolved",
          "Rejected",
        ],
        default: "Pending",
      },

      student: {
        type:
          mongoose.Schema.Types
            .ObjectId,

        ref: "User",
      },

      assignedTo: {
        type:
          mongoose.Schema.Types
            .ObjectId,

        ref: "User",
      },

      image: String,
    },
    {
      timestamps: true,
    }
  );

export default mongoose.model(
  "Complaint",
  complaintSchema
);