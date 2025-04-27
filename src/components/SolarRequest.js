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
    <div>
      <button
        onClick={() => navigate("/solarinstallers")}
        style={styles.button2}
      >
        My Requests
      </button>
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
  textarea: {
    width: "100%",
    minHeight: "100px",
    padding: "10px",
    marginBottom: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  button: {
    width: "100%",
    padding: "10px",
    backgroundColor: "#276749",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  message: {
    marginTop: "10px",
    textAlign: "center",
    color: "#2f855a",
  },
  button2: {
    marginTop: "10px",
    margin: "10px",
    width: "10%",
    backgroundColor: "#276749",
    color: "white",
    padding: "10px",
    borderRadius: "5px",
    border: "none",
    cursor: "pointer",
  },
};
