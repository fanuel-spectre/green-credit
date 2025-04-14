import React, { useState, useEffect } from "react";
import { auth, db } from "./firebase";
import Loader from "../components/Loader";
import {
  addDoc,
  collection,
  serverTimestamp,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { toast } from "react-toastify";
import { uploadToCloudinary } from "../utils/cloudinaryUpload"; // Helper function

function PlantTrees() {
  const [beforeImage, setBeforeImage] = useState(null);
  const [afterImage, setAfterImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submissions, setSubmissions] = useState([]); // Track submissions
  const [loadingSubmissions, setLoadingSubmissions] = useState(true);

  const user = auth.currentUser;

  // Fetch user submissions to track their status
  const fetchSubmissions = async () => {
    setLoadingSubmissions(true);
    try {
      const q = query(
        collection(db, "TreeSubmissions"),
        where("userId", "==", user.uid)
      );
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setSubmissions(data);
    } catch (error) {
      console.error("Error fetching submissions:", error);
      toast.error("Failed to load your submissions.");
    } finally {
      setLoadingSubmissions(false);
    }
  };

  // Handle file upload
  const handleUpload = async () => {
    if (!beforeImage || !afterImage) {
      return toast.error("Please upload both before and after images");
    }

    if (
      !beforeImage.type.startsWith("image") ||
      !afterImage.type.startsWith("image")
    ) {
      setError("Both files must be images.");
      return;
    }

    if (
      beforeImage.size > 5 * 1024 * 1024 ||
      afterImage.size > 5 * 1024 * 1024
    ) {
      setError("Each image must be less than 5MB.");
      return;
    }

    setError("");
    setLoading(true);

    try {
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
        status: "pending",
        createdAt: serverTimestamp(),
      });

      toast.success("Submission uploaded! Pending approval.");
      setBeforeImage(null);
      setAfterImage(null);
      fetchSubmissions(); // Refresh submissions after upload
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error("Upload failed. Try again.");
    }

    setLoading(false);
  };

  // Handle delete submission
  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "TreeSubmissions", id));
      toast.success("Submission deleted.");
      fetchSubmissions(); // Refresh submissions after delete
    } catch (error) {
      console.error("Error deleting submission:", error);
      toast.error("Failed to delete submission.");
    }
  };

  useEffect(() => {
    if (user) {
      fetchSubmissions(); // Fetch submissions on component mount
    }
  }, [user]);

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

      {error && <p style={styles.error}>{error}</p>}

      <button style={styles.button} onClick={handleUpload} disabled={loading}>
        {loading ? "Uploading..." : "Submit for Approval"}
      </button>

      <h3 style={styles.submissionsHeader}>Your Submissions</h3>

      {loadingSubmissions ? (
        <Loader />
      ) : (
        <div style={styles.submissionsContainer}>
          {submissions.length > 0 ? (
            submissions.map((submission) => (
              <div key={submission.id} style={styles.submissionCard}>
                <h4>Status: {submission.status}</h4>
                <div style={styles.imagesContainer}>
                  <img
                    src={submission.beforeUrl}
                    alt="Before"
                    style={styles.imagePreview}
                  />
                  <img
                    src={submission.afterUrl}
                    alt="After"
                    style={styles.imagePreview}
                  />
                </div>
                {submission.status === "rejected" && (
                  <button
                    style={styles.deleteButton}
                    onClick={() => handleDelete(submission.id)}
                  >
                    Delete Submission
                  </button>
                )}
                {submission.status === "pending" && (
                  <button
                    style={styles.deleteButton}
                    onClick={() => handleDelete(submission.id)}
                  >
                    Delete Submission
                  </button>
                )}
              </div>
            ))
          ) : (
            <p>No submissions found.</p>
          )}
        </div>
      )}
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
    border: "1px solid #ddd",
    padding: "5px",
  },
  button: {
    backgroundColor: "#276749",
    color: "#fff",
    padding: "12px 20px",
    border: "none",
    borderRadius: "6px",
    fontSize: "16px",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
  error: {
    color: "red",
    fontSize: "14px",
    marginTop: "10px",
  },
  submissionsHeader: {
    marginTop: "40px",
    fontSize: "20px",
    color: "#276749",
    marginBottom: "20px",
  },
  submissionsContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    alignItems: "center",
  },
  submissionCard: {
    backgroundColor: "#f9f9f9",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
    width: "300px",
    textAlign: "center",
  },
  imagesContainer: {
    display: "flex",
    gap: "10px",
    justifyContent: "center",
    marginTop: "10px",
  },
  imagePreview: {
    width: "100px",
    height: "100px",
    objectFit: "cover",
    borderRadius: "8px",
  },
  deleteButton: {
    backgroundColor: "#e74c3c",
    color: "#fff",
    padding: "10px 15px",
    border: "none",
    borderRadius: "6px",
    marginTop: "15px",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
};

export default PlantTrees;
