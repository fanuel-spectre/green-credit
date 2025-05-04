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
import { uploadToCloudinary } from "../utils/cloudinaryUpload";

function PlantTrees() {
  const [beforeImage, setBeforeImage] = useState(null);
  const [afterImage, setAfterImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [location, setLocation] = useState("");
  const [locationInput, setLocationInput] = useState("");
  const [fetchingLocation, setFetchingLocation] = useState(false);
  const [submissions, setSubmissions] = useState([]);
  const [loadingSubmissions, setLoadingSubmissions] = useState(true);
  const [dragActiveBefore, setDragActiveBefore] = useState(false);
  const [dragActiveAfter, setDragActiveAfter] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 600);

  const user = auth.currentUser;

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 600);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

   useEffect(() => {
     if (user) {
       fetchSubmissions(); // Fetch submissions on component mount
     }
   }, [user]);

  const fetchCurrentLocation = async () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await response.json();
          const address = data.display_name || `${latitude}, ${longitude}`;
          setLocationInput(address);
        } catch (error) {
          console.error("Error fetching address:", error);
          setLocationInput(`${latitude}, ${longitude}`);
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        alert("Unable to fetch location. Please allow permission.");
      }
    );
  };

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

    if (!locationInput.trim()) {
      return toast.error("Please enter a location.");
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

      await addDoc(collection(db, "TreeSubmissions"), {
        userId: user.uid,
        beforeUrl,
        afterUrl,
        location: locationInput,
        status: "pending",
        createdAt: serverTimestamp(),
      });

      toast.success("Submission uploaded! Pending approval.");
      setBeforeImage(null);
      setAfterImage(null);
      setLocationInput("");
      fetchSubmissions();
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error("Upload failed. Try again.");
    }

    setLoading(false);
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "TreeSubmissions", id));
      toast.success("Submission deleted.");
      fetchSubmissions();
    } catch (error) {
      console.error("Error deleting submission:", error);
      toast.error("Failed to delete submission.");
    }
  };

  const handleDrop = (e, setImage, setDragActive) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      setImage(file);
    }
  };

  const handleDrag = (e, setDragActive) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const responsiveStyles = {
    container: {
      padding: "20px",
      backgroundColor: "#e6f4ea",
      minHeight: "100vh",
      textAlign: "center",
    },
    header: {
      fontSize: "24px",
      color: "#276749",
      marginBottom: "20px",
    },
    dropzone: {
      marginBottom: "20px",
      marginTop: "10px",
      padding: "20px",
      border: "2px dashed #ccc",
      borderRadius: "8px",
      cursor: "pointer",
      backgroundColor: "#fff",
      width: isMobile ? "100%" : "400px",
      margin: "auto",
    },
    preview: {
      width: isMobile ? "100%" : "200px",
      height: "auto",
      borderRadius: "8px",
      marginTop: "10px",
      border: "1px solid #ddd",
      padding: "5px",
    },
    input: {
      padding: "10px",
      width: isMobile ? "90%" : "300px",
      borderRadius: "6px",
      border: "1px solid #ccc",
      fontSize: "14px",
      marginBottom: "10px",
    },
    button: {
      backgroundColor: "#276749",
      color: "#fff",
      padding: "12px 20px",
      border: "none",
      borderRadius: "6px",
      fontSize: "16px",
      cursor: "pointer",
      marginTop: "10px",
    },
    gpsButton: {
      marginTop: "9px",
      margin: "5px",
      padding: "9px 8px",
      borderRadius: "6px",
      border: "none",
      backgroundColor: "#2F855A",
      color: "white",
      cursor: "pointer",
      fontSize: "14px",
    },
    submissionsContainer: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      marginTop: "30px",
    },
    submissionCard: {
      backgroundColor: "#fff",
      padding: "20px",
      borderRadius: "10px",
      width: isMobile ? "90%" : "320px",
      boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
      marginBottom: "20px",
    },
    imagesContainer: {
      display: "flex",
      flexDirection: isMobile ? "column" : "row",
      gap: "10px",
      justifyContent: "center",
      marginTop: "10px",
    },
    imagePreview: {
      width: isMobile ? "100%" : "100px",
      height: "100px",
      objectFit: "cover",
      borderRadius: "8px",
    },
    deleteButton: {
      backgroundColor: "#e53e3e",
      color: "white",
      padding: "8px 16px",
      border: "none",
      borderRadius: "6px",
      marginTop: "10px",
      cursor: "pointer",
    },
  };

  return (
    <div style={responsiveStyles.container}>
      <h2 style={responsiveStyles.header}>🌳 Plant Trees Activity</h2>

      {/* Dropzones */}
      <div
        style={responsiveStyles.dropzone}
        onDragEnter={(e) => handleDrag(e, setDragActiveBefore)}
        onDragOver={(e) => handleDrag(e, setDragActiveBefore)}
        onDragLeave={(e) => handleDrag(e, setDragActiveBefore)}
        onDrop={(e) => handleDrop(e, setBeforeImage, setDragActiveBefore)}
        onClick={() => document.getElementById("beforeInput").click()}
      >
        <p>Drag & drop BEFORE image or click to upload</p>
        <input
          id="beforeInput"
          type="file"
          accept="image/*"
          onChange={(e) => setBeforeImage(e.target.files[0])}
          style={{ display: "none" }}
        />
        {beforeImage && (
          <img
            src={URL.createObjectURL(beforeImage)}
            alt="Before"
            style={responsiveStyles.preview}
          />
        )}
      </div>

      <div
        style={responsiveStyles.dropzone}
        onDragEnter={(e) => handleDrag(e, setDragActiveAfter)}
        onDragOver={(e) => handleDrag(e, setDragActiveAfter)}
        onDragLeave={(e) => handleDrag(e, setDragActiveAfter)}
        onDrop={(e) => handleDrop(e, setAfterImage, setDragActiveAfter)}
        onClick={() => document.getElementById("afterInput").click()}
      >
        <p>Drag & drop AFTER image or click to upload</p>
        <input
          id="afterInput"
          type="file"
          accept="image/*"
          onChange={(e) => setAfterImage(e.target.files[0])}
          style={{ display: "none" }}
        />
        {afterImage && (
          <img
            src={URL.createObjectURL(afterImage)}
            alt="After"
            style={responsiveStyles.preview}
          />
        )}
      </div>

      {/* Location input */}
      <input
        type="text"
        placeholder="Enter or detect your location"
        value={locationInput}
        onChange={(e) => setLocationInput(e.target.value)}
        style={responsiveStyles.input}
      />
      <button
        style={responsiveStyles.gpsButton}
        onClick={fetchCurrentLocation}
        disabled={fetchingLocation}
      >
        {fetchingLocation ? "Fetching..." : "Use My Location"}
      </button>

      <br />
      <button
        style={responsiveStyles.button}
        onClick={handleUpload}
        disabled={loading}
      >
        {loading ? "Uploading..." : "Submit for Approval"}
      </button>

      {/* Submissions */}
      <div style={responsiveStyles.submissionsContainer}>
        <h3>Your Submissions</h3>
        {loadingSubmissions ? (
          <Loader />
        ) : submissions.length === 0 ? (
          <p>No submissions yet.</p>
        ) : (
          submissions.map((submission) => (
            <div key={submission.id} style={responsiveStyles.submissionCard}>
              <p>Status: {submission.status}</p>
              <p>Location: {submission.location || "N/A"}</p>
              <div style={responsiveStyles.imagesContainer}>
                <img
                  src={submission.beforeUrl}
                  alt="Before"
                  style={responsiveStyles.imagePreview}
                />
                <img
                  src={submission.afterUrl}
                  alt="After"
                  style={responsiveStyles.imagePreview}
                />
              </div>
              {(submission.status === "pending" ||
                submission.status === "rejected") && (
                <button
                  style={responsiveStyles.deleteButton}
                  onClick={() => handleDelete(submission.id)}
                >
                  Delete
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default PlantTrees;
