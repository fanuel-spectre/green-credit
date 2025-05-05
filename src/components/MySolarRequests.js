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
  const [installations, setInstallations] = useState([]);
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    const fetchMyInstallations = async () => {
      try {
        // Step 1: Get requests created by the user
        const requestsSnapshot = await getDocs(
          query(
            collection(db, "SolarRequests"),
            where("userId", "==", user.uid)
          )
        );
        const requestIds = requestsSnapshot.docs.map((doc) => doc.id);

        if (requestIds.length === 0) {
          setInstallations([]); // No requests, no installations
          return;
        }

        // Step 2: Get installations related to those requestIds
        const installationsSnapshot = await getDocs(
          query(
            collection(db, "SolarInstallations"),
            where("requestId", "in", requestIds.slice(0, 10)) // Firestore only supports 10 items in "in" queries
          )
        );

        const data = installationsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setInstallations(data);
      } catch (error) {
        console.error("Error fetching installations:", error);
      }
    };

    if (user) {
      fetchMyInstallations();
    }
  }, [user]);

  const handleMarkCompleted = async (id) => {
    try {
      const ref = doc(db, "SolarInstallations", id);
      await updateDoc(ref, { completedByOwner: true });
      setInstallations((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, completedByOwner: true } : item
        )
      );
      alert("Marked as completed!");
    } catch (error) {
      console.error("Error updating installation:", error);
      alert("Failed to mark as completed.");
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>My Solar Installation Requests</h2>
      {installations.length === 0 ? (
        <p>No installations yet.</p>
      ) : (
        <div style={styles.grid}>
          {installations.map((inst) => (
            <div key={inst.id} style={styles.card}>
              {inst.imageUrl && (
                <img src={inst.imageUrl} alt="Proof" style={styles.image} />
              )}
              <p>
                <strong>Status:</strong> {inst.status}
              </p>
              <p>
                <strong>Completed by Owner:</strong>{" "}
                {inst.completedByOwner ? "✅ Yes" : "❌ No"}
              </p>
              {!inst.completedByOwner && (
                <button
                  style={styles.button}
                  onClick={() => handleMarkCompleted(inst.id)}
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
