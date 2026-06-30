import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import DashboardLayout from "../../layouts/DashboardLayout";
import ImageUploader from "../../components/ImageUploader";

import { createComplaint } from "../../services/complaintService";

function SubmitComplaint() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    building: "",
    floor: "",
    room: "",
    description: "",
  });

  const [imageFile, setImageFile] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.title ||
      !formData.category ||
      !formData.building ||
      !formData.floor ||
      !formData.room ||
      !formData.description
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);

      const complaintData = {
        ...formData,
        image: imageFile || "",
      };

      await createComplaint(complaintData);

      toast.success("Complaint Submitted Successfully");

      setFormData({
        title: "",
        category: "",
        building: "",
        floor: "",
        room: "",
        description: "",
      });

      setImageFile("");

      navigate("/complaints");
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
          "Failed to submit complaint"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="submit-page">
        <div className="submit-header">
          <h1>Submit Complaint</h1>
          <p>
            Report infrastructure issues with full details so the team can resolve them faster.
          </p>
        </div>

        <form className="submit-form-card" onSubmit={handleSubmit}>
          <div className="submit-grid">
            <div className="submit-form-group full-width">
              <label>Complaint Title</label>
              <input
                type="text"
                name="title"
                placeholder="Enter complaint title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="submit-form-group">
              <label>Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="">Select Category</option>
                <option value="Electrical">Electrical</option>
                <option value="Plumbing">Plumbing</option>
                <option value="Furniture">Furniture</option>
                <option value="Internet">Internet</option>
                <option value="Cleaning">Cleaning</option>
                <option value="Security">Security</option>
                <option value="Others">Others</option>
              </select>
            </div>

            <div className="submit-form-group">
              <label>Building</label>
              <input
                type="text"
                name="building"
                placeholder="Enter building name"
                value={formData.building}
                onChange={handleChange}
                required
              />
            </div>

            <div className="submit-form-group">
              <label>Floor</label>
              <input
                type="text"
                name="floor"
                placeholder="Enter floor"
                value={formData.floor}
                onChange={handleChange}
                required
              />
            </div>

            <div className="submit-form-group">
              <label>Room</label>
              <input
                type="text"
                name="room"
                placeholder="Enter room number"
                value={formData.room}
                onChange={handleChange}
                required
              />
            </div>

            <div className="submit-form-group full-width">
              <label>Description</label>
              <textarea
                rows="6"
                name="description"
                placeholder="Describe the issue clearly..."
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>

            <div className="submit-form-group full-width">
              <ImageUploader
                imageFile={imageFile}
                setImageFile={setImageFile}
              />
            </div>
          </div>

          <button
            type="submit"
            className="submit-complaint-btn"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit Complaint"}
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
}

export default SubmitComplaint;