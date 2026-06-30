import { useState } from "react";

function ImageUploader({ imageFile, setImageFile }) {
  const [preview, setPreview] = useState(imageFile || "");

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // File validation
    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file");
      return;
    }

    // Convert image to Base64
    const reader = new FileReader();

    reader.onloadend = () => {
      setImageFile(reader.result); // base64 string
      setPreview(reader.result);
    };

    reader.readAsDataURL(file);
  };

  return (
    <div className="image-uploader">
      <label className="upload-label">
        Upload Complaint Image (Optional)
      </label>

      <input
        type="file"
        accept="image/*"
        onChange={handleImage}
      />

      {preview && (
        <div className="upload-preview">
          <img
            src={preview}
            alt="Complaint Preview"
          />
        </div>
      )}
    </div>
  );
}

export default ImageUploader;