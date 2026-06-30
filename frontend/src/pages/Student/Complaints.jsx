import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import DashboardLayout from "../../layouts/DashboardLayout";

import {
  getComplaints,
  deleteComplaint,
} from "../../services/complaintService";

function Complaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      setLoading(true);

      const res = await getComplaints();

      setComplaints(res.data || []);
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
          "Failed to fetch complaints"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this complaint?"
    );

    if (!confirmDelete) return;

    try {
      await deleteComplaint(id);

      toast.success(
        "Complaint deleted successfully"
      );

      setComplaints((prev) =>
        prev.filter(
          (complaint) =>
            complaint._id !== id
        )
      );
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to delete complaint"
      );
    }
  };

  return (
    <DashboardLayout>

      <div className="complaints-page">

        <div className="complaints-page-header">
          <h1>My Complaints</h1>
        </div>

        {loading ? (
          <p>Loading complaints...</p>
        ) : complaints.length === 0 ? (
          <p>No complaints found.</p>
        ) : (

          <div className="complaints-grid">

            {complaints.map((complaint) => (
              <div
                key={complaint._id}
                className="complaint-card"
              >

                <h3>{complaint.title}</h3>

                <p>
                  <strong>Category:</strong>{" "}
                  {complaint.category}
                </p>

                <p>
                  <strong>Status:</strong>{" "}
                  {complaint.status}
                </p>

                <p>
                  <strong>Building:</strong>{" "}
                  {complaint.building || "N/A"}
                </p>

                <p>
                  <strong>Created:</strong>{" "}
                  {complaint.createdAt
                    ? new Date(
                        complaint.createdAt
                      ).toLocaleDateString()
                    : "N/A"}
                </p>

                <div className="complaint-actions">

                  <Link
                    to={`/complaints/${complaint._id}`}
                    className="complaint-action-btn view-btn"
                  >
                    View
                  </Link>
                                    {complaint.status === "Pending" && (
                    <>
                      <Link
                        to={`/complaints/edit/${complaint._id}`}
                        className="complaint-action-btn edit-btn"
                      >
                        Edit
                      </Link>

                      <button
                        className="complaint-action-btn delete-btn"
                        onClick={() =>
                          handleDelete(complaint._id)
                        }
                      >
                        Delete
                      </button>
                    </>
                  )}

                  {complaint.status === "In Progress" && (
                    <p
                      style={{
                        color: "#f59e0b",
                        fontSize: "13px",
                        marginTop: "10px",
                        fontStyle: "italic",
                      }}
                    >
                      This complaint is currently being processed.
                    </p>
                  )}

                  {complaint.status === "Resolved" && (
                    <p
                      style={{
                        color: "green",
                        fontSize: "13px",
                        marginTop: "10px",
                        fontStyle: "italic",
                      }}
                    >
                      This complaint has been resolved.
                    </p>
                  )}

                  {complaint.status === "Rejected" && (
                    <p
                      style={{
                        color: "red",
                        fontSize: "13px",
                        marginTop: "10px",
                        fontStyle: "italic",
                      }}
                    >
                      This complaint has been rejected.
                    </p>
                  )}

                </div>

              </div>
            ))}

          </div>

        )}

      </div>

    </DashboardLayout>
  );
}

export default Complaints;