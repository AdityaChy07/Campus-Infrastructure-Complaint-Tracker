import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import {
  getComplaintById,
  updateComplaint,
} from "../../services/complaintService";
import { toast } from "react-toastify";

function EditComplaint() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    building: "",
    floor: "",
    room: "",
  });

  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchComplaint();
  }, [id]);

  const fetchComplaint = async () => {
    try {
      setLoading(true);

      const res = await getComplaintById(id);
      const complaint = res.data;

      setFormData({
        title: complaint.title || "",
        category: complaint.category || "",
        description: complaint.description || "",
        building: complaint.building || "",
        floor: complaint.floor || "",
        room: complaint.room || "",
      });

      setImagePreview(complaint.image || "");
    } catch (error) {
      console.error("Error fetching complaint:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to load complaint"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.title ||
      !formData.category ||
      !formData.description
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      setUpdating(true);

      await updateComplaint(id, formData);

      toast.success("Complaint updated successfully");
      navigate(`/complaints/${id}`);
    } catch (error) {
      console.error("Update complaint error:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to update complaint"
      );
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar />

      <div className="main-content">
        <div className="edit-page">
          <h1>Edit Complaint</h1>

          {loading ? (
            <p>Loading complaint data...</p>
          ) : (
            <div className="edit-card">
              <form
                className="edit-form"
                onSubmit={handleSubmit}
              >
                <div className="edit-form-group">
                  <label>Complaint Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Enter complaint title"
                  />
                </div>

                <div className="edit-form-group">
                  <label>Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                  >
                    <option value="">Select Category</option>
                    <option value="Electricity">Electricity</option>
                    <option value="Water">Water</option>
                    <option value="Internet">Internet</option>
                    <option value="Furniture">Furniture</option>
                    <option value="Cleanliness">Cleanliness</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="edit-form-group">
                  <label>Description</label>
                  <textarea
                    name="description"
                    rows="5"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Enter complaint description"
                  />
                </div>

                <div className="edit-form-row">
                  <div className="edit-form-group">
                    <label>Building</label>
                    <input
                      type="text"
                      name="building"
                      value={formData.building}
                      onChange={handleChange}
                      placeholder="Enter building"
                    />
                  </div>

                  <div className="edit-form-group">
                    <label>Floor</label>
                    <input
                      type="text"
                      name="floor"
                      value={formData.floor}
                      onChange={handleChange}
                      placeholder="Enter floor"
                    />
                  </div>

                  <div className="edit-form-group">
                    <label>Room</label>
                    <input
                      type="text"
                      name="room"
                      value={formData.room}
                      onChange={handleChange}
                      placeholder="Enter room"
                    />
                  </div>
                </div>

                {imagePreview && (
                  <div className="edit-image-preview">
                    <h3>Current Complaint Image</h3>
                    <img
                      src={imagePreview}
                      alt="Complaint Preview"
                    />
                  </div>
                )}

                <div className="edit-actions">
                  <button
                    type="submit"
                    className="edit-save-btn"
                    disabled={updating}
                  >
                    {updating
                      ? "Updating..."
                      : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default EditComplaint;