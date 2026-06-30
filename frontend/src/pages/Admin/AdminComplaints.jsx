import { useEffect, useState } from "react";
import {
  getAllComplaints,
  updateComplaintStatus,
  getMaintenanceUsers,
  assignComplaint,
} from "../../services/adminService";

import Sidebar from "../../components/Sidebar";
import { toast } from "react-toastify";

function AdminComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  const [maintenanceUsers, setMaintenanceUsers] = useState([]);

  const [selectedMaintenance, setSelectedMaintenance] =
    useState({});

  useEffect(() => {
    fetchComplaints();
    fetchMaintenanceUsers();
  }, []);

  // ===============================
  // Fetch All Complaints
  // ===============================
  const fetchComplaints = async () => {
    try {
      setLoading(true);

      const res = await getAllComplaints();

      setComplaints(res.data);
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
          "Failed to load complaints"
      );
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // Fetch Maintenance Users
  // ===============================
  const fetchMaintenanceUsers =
    async () => {
      try {
        const res =
          await getMaintenanceUsers();

        setMaintenanceUsers(
          res.data
        );
      } catch (error) {
        console.error(error);

        toast.error(
          "Failed to load maintenance users"
        );
      }
    };

  // ===============================
  // Assign Complaint
  // ===============================
  const handleAssign =
    async (complaintId) => {
      try {
        const maintenanceId =
          selectedMaintenance[
            complaintId
          ];

        if (!maintenanceId) {
          toast.error(
            "Please select a maintenance user"
          );

          return;
        }

        const res =
          await assignComplaint(
            complaintId,
            maintenanceId
          );

        toast.success(
          res.data?.message ||
            "Complaint assigned successfully"
        );

        fetchComplaints();

        setSelectedMaintenance({
          ...selectedMaintenance,
          [complaintId]: "",
        });
      } catch (error) {
        console.error(error);

        toast.error(
          error.response?.data?.message ||
            "Assignment failed"
        );
      }
    };

  // ===============================
  // Update Status
  // ===============================
  const handleStatusChange =
    async (
      complaintId,
      newStatus
    ) => {
      try {
        const res =
          await updateComplaintStatus(
            complaintId,
            newStatus
          );

        toast.success(
          res.data?.message ||
            "Complaint status updated"
        );

        fetchComplaints();
      } catch (error) {
        console.error(error);

        toast.error(
          error.response?.data?.message ||
            "Failed to update status"
        );
      }
    };

  return (
    <div className="dashboard-container">
      <Sidebar />

      <div className="main-content">
        <h2>Manage Complaints</h2>

        {loading ? (
          <p>Loading complaints...</p>
        ) : complaints.length === 0 ? (
          <p>No complaints found.</p>
        ) : (
          <div className="complaints-grid">
            {complaints.map(
              (complaint) => (
                <div
                  className="complaint-card"
                  key={complaint._id}
                >
                                    <h3>{complaint.title}</h3>

                  <p>
                    <strong>Category:</strong>{" "}
                    {complaint.category}
                  </p>

                  <p>
                    <strong>Description:</strong>{" "}
                    {complaint.description}
                  </p>

                  <p>
                    <strong>Building:</strong>{" "}
                    {complaint.building || "N/A"}
                  </p>

                  <p>
                    <strong>Floor:</strong>{" "}
                    {complaint.floor || "N/A"}
                  </p>

                  <p>
                    <strong>Room:</strong>{" "}
                    {complaint.room || "N/A"}
                  </p>

                  <p>
                    <strong>Student:</strong>{" "}
                    {complaint.student?.name || "N/A"}
                  </p>

                  <p>
                    <strong>Email:</strong>{" "}
                    {complaint.student?.email || "N/A"}
                  </p>

                  <p>
                    <strong>Assigned To:</strong>{" "}
                    {complaint.assignedTo?.name || "Not Assigned"}
                  </p>

                  <p>
                    <strong>Current Status:</strong>{" "}
                    {complaint.status}
                  </p>

                  {/* ---------------- Status Update ---------------- */}

                  <div style={{ marginTop: "15px" }}>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "6px",
                        fontWeight: "600",
                      }}
                    >
                      Update Status
                    </label>

                    <select
                      value={complaint.status}
                      onChange={(e) =>
                        handleStatusChange(
                          complaint._id,
                          e.target.value
                        )
                      }
                      style={{
                        width: "100%",
                        padding: "10px",
                        borderRadius: "6px",
                      }}
                    >
                      <option value="Pending">
                        Pending
                      </option>

                      <option value="In Progress">
                        In Progress
                      </option>

                      <option value="Resolved">
                        Resolved
                      </option>

                      <option value="Rejected">
                        Rejected
                      </option>
                    </select>
                  </div>

                  {/* ---------------- Complaint Image ---------------- */}

                  {complaint.image && (
                    <div
                      style={{
                        marginTop: "15px",
                      }}
                    >
                      <img
                        src={complaint.image}
                        alt="Complaint"
                        style={{
                          width: "100%",
                          maxHeight: "220px",
                          objectFit: "cover",
                          borderRadius: "10px",
                        }}
                      />
                    </div>
                  )}

                  {/* ---------------- Assign Maintenance ---------------- */}

                  <div
                    style={{
                      marginTop: "20px",
                    }}
                  >
                    <label
                      style={{
                        display: "block",
                        marginBottom: "8px",
                        fontWeight: "600",
                      }}
                    >
                      Assign Maintenance Staff
                    </label>

                    <select
                      value={
                        selectedMaintenance[
                          complaint._id
                        ] || ""
                      }
                      onChange={(e) =>
                        setSelectedMaintenance({
                          ...selectedMaintenance,
                          [complaint._id]:
                            e.target.value,
                        })
                      }
                      style={{
                        width: "100%",
                        padding: "10px",
                        borderRadius: "6px",
                        marginBottom: "10px",
                      }}
                    >
                      <option value="">
                        Select Maintenance Staff
                      </option>

                      {maintenanceUsers.map(
                        (user) => (
                          <option
                            key={user._id}
                            value={user._id}
                          >
                            {user.name}
                          </option>
                        )
                      )}
                    </select>

                    <button
                      onClick={() =>
                        handleAssign(
                          complaint._id
                        )
                      }
                      style={{
                        width: "100%",
                        padding: "10px",
                        background:
                          "#2563eb",
                        color: "white",
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer",
                      }}
                    >
                      Assign Complaint
                    </button>
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminComplaints;