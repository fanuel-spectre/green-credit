import React, { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from "./firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import axios from "axios";

export default function ConfirmParticipation() {
  const auth = getAuth();
  const [user, setUser] = useState(null);
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, [auth]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "green_credit_upload");
    formData.append("cloud_name", "ds6xoprrg");

    const res = await axios.post(
      "https://api.cloudinary.com/v1_1/ds6xoprrg/image/upload",
      formData
    );
    return res.data.secure_url;
  };

  const handleSubmit = async () => {
    if (!user) {
      setMessage("You must be logged in.");
      return;
    }

    if (!image) {
      setMessage("Please upload a proof image.");
      return;
    }

    try {
      setUploading(true);
      setMessage("Uploading image...");
      const imageUrl = await uploadToCloudinary(image);

      await addDoc(collection(db, "CleanupParticipation"), {
        userId: user.uid,
        imageUrl,
        status: "pending",
        createdAt: serverTimestamp(),
      });

      setMessage("✅ Submission successful! Awaiting admin approval.");
      setImage(null);
      setPreview(null);
    } catch (err) {
      console.error(err);
      setMessage("❌ Error submitting. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Confirm Your Participation</h2>

      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        style={styles.fileInput}
      />
      {preview && <img src={preview} alt="Preview" style={styles.preview} />}

      <button onClick={handleSubmit} style={styles.button} disabled={uploading}>
        {uploading ? "Uploading..." : "Submit Proof"}
      </button>

      {message && <p style={styles.message}>{message}</p>}
    </div>
  );
}

const styles = {
  container: {
    padding: "20px",
    maxWidth: "500px",
    margin: "0 auto",
    background: "#f0fff4",
    borderRadius: "10px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
  },
  heading: {
    textAlign: "center",
    marginBottom: "20px",
    color: "#276749",
  },
  fileInput: {
    width: "100%",
    marginBottom: "15px",
  },
  preview: {
    width: "100%",
    maxHeight: "300px",
    objectFit: "contain",
    borderRadius: "8px",
    marginBottom: "15px",
  },
  button: {
    width: "100%",
    padding: "10px",
    backgroundColor: "#276749",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  message: {
    marginTop: "15px",
    textAlign: "center",
    color: "#2f855a",
  },
};
