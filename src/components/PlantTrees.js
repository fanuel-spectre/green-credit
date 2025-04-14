import React, { useState } from "react";
import { auth, db } from "./firebase"; // Ensure you're importing 'db' from firebase for Firestore
import { addDoc, collection, serverTimestamp } from "firebase/firestore"; // Import the necessary Firebase Firestore functions
import { toast } from "react-toastify";
import { uploadToCloudinary } from "../utils/cloudinaryUpload"; // Import the helper function

function PlantTrees() {
  const [beforeImage, setBeforeImage] = useState(null);
  const [afterImage, setAfterImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!beforeImage || !afterImage) {
      return toast.error("Please upload both before and after images");
    }

    setLoading(true);
    const user = auth.currentUser;

    try {
      // Ensure the cloudName and uploadPreset are passed correctly
      const beforeUrl = await uploadToCloudinary(
        beforeImage,
        "green_credit_upload",
        "ds6xoprrg"
      );
      const afterUrl = await uploadToCloudinary(
        afterImage,
        "green_credit_upload",
        "ds6xoprrg"
      );

      // Save metadata to Firestore
      await addDoc(collection(db, "TreeSubmissions"), {
        userId: user.uid,
        beforeUrl,
        afterUrl,
        status: "pending", // Status set to "pending" until admin approval
        createdAt: serverTimestamp(),
      });

      toast.success("Submission uploaded! Pending approval.");
      setBeforeImage(null);
      setAfterImage(null);
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error("Upload failed. Try again.");
    }

    setLoading(false);
  };


  return (
    <div style={styles.container}>
      <h2 style={styles.header}>🌳 Plant Trees Activity</h2>

      <div style={styles.uploadBox}>
        <label style={styles.label}>Upload BEFORE Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setBeforeImage(e.target.files[0])}
        />
        {beforeImage && (
          <img
            src={URL.createObjectURL(beforeImage)}
            alt="Before"
            style={styles.preview}
          />
        )}
      </div>

      <div style={styles.uploadBox}>
        <label style={styles.label}>Upload AFTER Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setAfterImage(e.target.files[0])}
        />
        {afterImage && (
          <img
            src={URL.createObjectURL(afterImage)}
            alt="After"
            style={styles.preview}
          />
        )}
      </div>

      <button style={styles.button} onClick={handleUpload} disabled={loading}>
        {loading ? "Uploading..." : "Submit for Approval"}
      </button>
    </div>
  );
}

const styles = {
  container: {
    padding: "30px",
    backgroundColor: "#e6f4ea",
    minHeight: "100vh",
    textAlign: "center",
  },
  header: {
    fontSize: "24px",
    color: "#276749",
    marginBottom: "20px",
  },
  uploadBox: {
    marginBottom: "20px",
  },
  label: {
    display: "block",
    marginBottom: "10px",
    fontWeight: "bold",
  },
  preview: {
    width: "200px",
    height: "auto",
    borderRadius: "8px",
    marginTop: "10px",
  },
  button: {
    backgroundColor: "#276749",
    color: "#fff",
    padding: "12px 20px",
    border: "none",
    borderRadius: "6px",
    fontSize: "16px",
    cursor: "pointer",
  },
};

export default PlantTrees;
