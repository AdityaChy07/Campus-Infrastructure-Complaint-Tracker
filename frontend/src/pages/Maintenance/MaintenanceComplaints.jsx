import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import {
  getAssignedComplaints,
  updateMaintenanceStatus,
} from "../../services/maintenanceService";
import { toast } from "react-toastify";

function MaintenanceComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const res = await getAssignedComplaints();
      setComplaints(res.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load complaints");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (
    complaintId,
    status
  ) => {
    try {
      await updateMaintenanceStatus(
        complaintId,
        status
      );

      toast.success("Status Updated");

      fetchComplaints();
    } catch (error) {
      console.error(error);

      toast.error("Update Failed");
    }
  };

  return (
    <DashboardLayout>
      <h1>Assigned Complaints</h1>

      {loading ? (
        <p>Loading...</p>
      ) : complaints.length === 0 ? (
        <p>No complaints assigned.</p>
      ) : (
        <div className="complaints-grid">
          {complaints.map((complaint) => (
            <div
              className="complaint-card"
              key={complaint._id}
            >
              <h2>{complaint.title}</h2>

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
                {complaint.building}
              </p>

              <p>
                <strong>Floor:</strong>{" "}
                {complaint.floor}
              </p>

              <p>
                <strong>Room:</strong>{" "}
                {complaint.room}
              </p>

              <p>
                <strong>Student:</strong>{" "}
                {complaint.student?.name}
              </p>

              <p>
                <strong>Email:</strong>{" "}
                {complaint.student?.email}
              </p>

              <p>
                <strong>Status:</strong>{" "}
                {complaint.status}
              </p>

              {complaint.image && (
                <img
                  src={complaint.image}
                  alt="Complaint"
                  style={{
                    width: "100%",
                    borderRadius: "10px",
                    marginTop: "15px",
                    maxHeight: "220px",
                    objectFit: "cover",
                  }}
                />
              )}

              <div
                style={{
                  marginTop: "20px",
                }}
              >
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
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}

export default MaintenanceComplaints;