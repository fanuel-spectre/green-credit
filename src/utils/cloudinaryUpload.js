import axios from "axios";

export const uploadToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "green_credit_upload");

  try {
    const res = await axios.post(
      "https://api.cloudinary.com/v1_1/ds6xoprrg/image/upload",
      formData
    );
    return res.data.secure_url;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw error;
  }
};
