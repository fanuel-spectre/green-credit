import React, { useEffect, useState } from "react";
import { db } from "./firebase";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function BrowseSolarJobs() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const auth = getAuth();
  const user = auth.currentUser;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const q = query(
          collection(db, "SolarRequests"),
          where("status", "==", "open")
        );
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setRequests(data);
      } catch (error) {
        console.error("Error fetching solar requests:", error);
        setMessage("Failed to load requests.");
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const handleApply = async (requestId) => {
    if (!user) {
      setMessage("You must be logged in to apply.");
      return;
    }
    try {
      await addDoc(collection(db, "SolarApplications"), {
        userId: user.uid,
        requestId,
        status: "applied",
        appliedAt: serverTimestamp(),
      });
      setMessage("Successfully applied! Waiting for confirmation.");
    } catch (error) {
      console.error("Application error:", error);
      setMessage("Failed to apply. Try again.");
    }
  };

  return (
    <div style={styles.container}>
      <button onClick={() => navigate("/solarrequests")} style={styles.button2}>
        + Add a Request
      </button>
      <button onClick={() => navigate("/mysolarrequests")} style={styles.button2}>
        My Requests
      </button>
      <h2 style={styles.heading}>Available Solar Installations</h2>

      {loading ? (
        <p style={styles.loading}>Loading jobs...</p>
      ) : requests.length === 0 ? (
        <p style={styles.empty}>
          No installation jobs available at the moment.
        </p>
      ) : (
        <div style={styles.grid}>
          {requests.map((req) => (
            <div key={req.id} style={styles.card}>
              <h3 style={styles.title}>Request #{req.id.slice(0, 5)}</h3>
              <p>
                <strong>Description:</strong> {req.description}
              </p>
              <p>
                <strong>Location:</strong> {req.location}
              </p>

              <button onClick={() => handleApply(req.id)} style={styles.button}>
                Apply to Install
              </button>
            </div>
          ))}
        </div>
      )}
      {message && <p style={styles.message}>{message}</p>}
    </div>
  );
}

const styles = {
  container: {
    padding: "20px",
    backgroundColor: "#f0fff4",
    minHeight: "100vh",
  },
  heading: {
    textAlign: "center",
    marginBottom: "20px",
    color: "#276749",
  },
  loading: {
    textAlign: "center",
    marginTop: "50px",
  },
  empty: {
    textAlign: "center",
    marginTop: "50px",
    color: "#666",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "20px",
  },
  card: {
    background: "white",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
  },
  title: {
    marginBottom: "10px",
  },
  button: {
    marginTop: "10px",
    width: "100%",
    backgroundColor: "#276749",
    color: "white",
    padding: "10px",
    borderRadius: "5px",
    border: "none",
    cursor: "pointer",
  },
  button2: {
    marginTop: "10px",
    margin: "10px",
    width: "20%",
    backgroundColor: "#276749",
    color: "white",
    padding: "10px",
    borderRadius: "5px",
    border: "none",
    cursor: "pointer",
  },
  message: {
    marginTop: "15px",
    textAlign: "center",
    color: "#2f855a",
  },
};
