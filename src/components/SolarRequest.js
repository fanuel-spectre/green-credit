import React, { useState } from "react";
import { getAuth } from "firebase/auth";
import { db } from "./firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function CreateSolarRequest() {
  const auth = getAuth();
  const user = auth.currentUser;
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!description || !location) {
      setMessage("Please fill all fields.");
      return;
    }

    try {
      setSubmitting(true);
      await addDoc(collection(db, "SolarRequests"), {
        userId: user.uid,
        description,
        location,
        status: "open",
        createdAt: serverTimestamp(),
      });
      setMessage("Request posted successfully!");
      setDescription("");
      setLocation("");
    } catch (error) {
      console.error("Error posting request:", error);
      setMessage("Failed to post. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.buttonContainer}>
        <button
          onClick={() => navigate("/solarinstallers")}
          style={styles.button2}
        >
          My Requests
        </button>
      </div>
      <div style={styles.container}>
        <h2 style={styles.heading}>Post a Solar Installation Request</h2>

        <textarea
          placeholder="Describe the installation needed..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={styles.textarea}
        />
        <input
          type="text"
          placeholder="Location (City, Area)"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          style={styles.input}
        />

        <button
          onClick={handleSubmit}
          style={styles.button}
          disabled={submitting}
        >
          {submitting ? "Posting..." : "Post Request"}
        </button>

        {message && <p style={styles.message}>{message}</p>}
      </div>
    </div>
  );
}

const styles = {
  pageContainer: {
    padding: "20px",
    backgroundColor: "#f0fff4",
    minHeight: "100vh",
    boxSizing: "border-box",
    width: "100%", // Make sure the outer container never exceeds screen width
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "20px",
    width: "100%",
  },
  container: {
    padding: "20px",
    maxWidth: "500px",
    width: "100%",
    margin: "0 auto",
    background: "white",
    borderRadius: "10px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    boxSizing: "border-box", // Important to prevent overflow due to padding
  },
  heading: {
    textAlign: "center",
    marginBottom: "20px",
    color: "#276749",
    fontSize: "clamp(1.5rem, 5vw, 2rem)",
  },
  textarea: {
    width: "100%",
    minHeight: "120px",
    padding: "10px",
    marginBottom: "15px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    fontSize: "1rem",
    boxSizing: "border-box",
  },
  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "15px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    fontSize: "1rem",
    boxSizing: "border-box",
  },
  button: {
    width: "100%",
    padding: "12px",
    backgroundColor: "#276749",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "1rem",
    boxSizing: "border-box",
  },
  message: {
    marginTop: "15px",
    textAlign: "center",
    color: "#2f855a",
  },
  button2: {
    width: "100%", // Full width on small devices
    maxWidth: "200px", // But limit it on larger devices
    backgroundColor: "#276749",
    color: "white",
    padding: "10px",
    borderRadius: "5px",
    border: "none",
    cursor: "pointer",
    fontSize: "1rem",
    boxSizing: "border-box",
  },
};
