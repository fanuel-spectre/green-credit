import React, { useEffect, useState } from "react";
import { db } from "./firebase";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";

export default function MySolarRequests() {
  const [requests, setRequests] = useState([]);
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    const fetchMyRequests = async () => {
      try {
        const q = query(
          collection(db, "SolarInstallations"),
          where("ownerId", "==", user.uid)
        );
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setRequests(data);
      } catch (error) {
        console.error("Error fetching requests:", error);
      }
    };

    if (user) {
      fetchMyRequests();
    }
  }, [user]);

  const handleMarkCompleted = async (requestId) => {
    try {
      const requestRef = doc(db, "SolarInstallations", requestId);
      await updateDoc(requestRef, { completedByOwner: true });
      alert("Marked as completed!");
      setRequests((prev) =>
        prev.map((item) =>
          item.id === requestId ? { ...item, completedByOwner: true } : item
        )
      );
    } catch (error) {
      console.error("Error marking completed:", error);
      alert("Failed to mark completed.");
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>My Solar Installation Requests</h2>
      {requests.length === 0 ? (
        <p>No solar requests yet.</p>
      ) : (
        <div style={styles.grid}>
          {requests.map((request) => (
            <div key={request.id} style={styles.card}>
              <img
                src={request.imageUrl}
                alt="Solar Proof"
                style={styles.image}
              />
              <p>
                <strong>Status:</strong> {request.status}
              </p>
              <p>
                <strong>Completed by Owner:</strong>{" "}
                {request.completedByOwner ? "✅ Yes" : "❌ No"}
              </p>
              {!request.completedByOwner && (
                <button
                  style={styles.button}
                  onClick={() => handleMarkCompleted(request.id)}
                >
                  Mark as Completed
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: 20,
    backgroundColor: "#f0fff4",
    minHeight: "100vh",
  },
  heading: {
    textAlign: "center",
    color: "#276749",
    marginBottom: 30,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: 20,
  },
  card: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
    textAlign: "center",
  },
  image: {
    width: "100%",
    maxHeight: "200px",
    objectFit: "cover",
    marginBottom: 10,
    borderRadius: 8,
  },
  button: {
    backgroundColor: "#276749",
    color: "white",
    padding: "8px 12px",
    border: "none",
    borderRadius: 5,
    cursor: "pointer",
  },
};
