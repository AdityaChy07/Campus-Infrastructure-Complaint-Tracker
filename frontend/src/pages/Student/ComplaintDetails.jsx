import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import {
  getComplaintById,
  deleteComplaint,
} from "../../services/complaintService";
import { toast } from "react-toastify";

function ComplaintDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComplaint();
  }, [id]);

  const fetchComplaint = async () => {
    try {
      setLoading(true);
      const res = await getComplaintById(id);
      setComplaint(res.data);
    } catch (error) {
      console.error("Error fetching complaint:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to load complaint details"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this complaint?"
    );

    if (!confirmDelete) return;

    try {
      await deleteComplaint(id);
      toast.success("Complaint deleted successfully");
      navigate("/complaints");
    } catch (error) {
      console.error("Delete complaint error:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to delete complaint"
      );
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar />

      <div className="main-content">
        <div className="details-page">
          <div className="details-header">
            <h1>Complaint Details</h1>

            <div className="details-actions">
              <Link
                to={`/complaints/edit/${id}`}
                className="details-btn edit-btn"
              >
                Edit Complaint
              </Link>

              <button
                className="details-btn delete-btn"
                onClick={handleDelete}
              >
                Delete Complaint
              </button>
            </div>
          </div>

          {loading ? (
            <p>Loading complaint details...</p>
          ) : !complaint ? (
            <p>Complaint not found.</p>
          ) : (
            <div className="details-card">
              <div className="details-grid">
                <div className="details-item">
                  <span className="details-label">Title</span>
                  <span className="details-value">
                    {complaint.title || "N/A"}
                  </span>
                </div>

                <div className="details-item">
                  <span className="details-label">Category</span>
                  <span className="details-value">
                    {complaint.category || "N/A"}
                  </span>
                </div>

                <div className="details-item">
                  <span className="details-label">Status</span>
                  <span className="details-value">
                    {complaint.status || "N/A"}
                  </span>
                </div>

                <div className="details-item">
                  <span className="details-label">Building</span>
                  <span className="details-value">
                    {complaint.building || "N/A"}
                  </span>
                </div>

                <div className="details-item">
                  <span className="details-label">Floor</span>
                  <span className="details-value">
                    {complaint.floor || "N/A"}
                  </span>
                </div>

                <div className="details-item">
                  <span className="details-label">Room</span>
                  <span className="details-value">
                    {complaint.room || "N/A"}
                  </span>
                </div>

                <div className="details-item full-width">
                  <span className="details-label">Description</span>
                  <span className="details-value">
                    {complaint.description || "N/A"}
                  </span>
                </div>

                <div className="details-item">
                  <span className="details-label">Created On</span>
                  <span className="details-value">
                    {complaint.createdAt
                      ? new Date(complaint.createdAt).toLocaleString()
                      : "N/A"}
                  </span>
                </div>

                <div className="details-item">
                  <span className="details-label">Updated On</span>
                  <span className="details-value">
                    {complaint.updatedAt
                      ? new Date(complaint.updatedAt).toLocaleString()
                      : "N/A"}
                  </span>
                </div>
              </div>

              {complaint.image && (
                <div className="details-image-section">
                  <h3>Complaint Image</h3>
                  <img
                    src={complaint.image}
                    alt="Complaint"
                    className="details-image"
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ComplaintDetails;