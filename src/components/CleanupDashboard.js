import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";

export default function CleanupDashboard() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const snapshot = await getDocs(collection(db, "CleanupParticipation"));
        const all = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        const pending = all.filter((s) => s.status === "pending");
        setSubmissions(pending);
      } catch (error) {
        console.error("Error fetching cleanup submissions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, []);

  const handleApprove = async (submissionId, userId, tokens) => {
    try {
      await updateDoc(doc(db, "CleanupParticipation", submissionId), {
        status: "approved",
        rewardTokens: tokens,
        approvedAt: Timestamp.now(),
      });
      alert("Submission approved and tokens awarded!");
      setSubmissions((prev) => prev.filter((s) => s.id !== submissionId));
    } catch (err) {
      console.error("Approval error:", err);
      alert("Failed to approve submission.");
    }
  };

  const handleReject = async (submissionId) => {
    try {
      await updateDoc(doc(db, "CleanupParticipation", submissionId), {
        status: "rejected",
      });
      alert("Submission rejected.");
      setSubmissions((prev) => prev.filter((s) => s.id !== submissionId));
    } catch (err) {
      console.error("Rejection error:", err);
      alert("Failed to reject submission.");
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>🧹 Cleanup Submissions Dashboard</h2>

      {loading ? (
        <p>Loading submissions...</p>
      ) : submissions.length === 0 ? (
        <p>No pending submissions.</p>
      ) : (
        submissions.map((submission) => (
          <div key={submission.id} style={styles.card}>
            <img src={submission.imageUrl} alt="Proof" style={styles.image} />
            <p>
              <strong>User ID:</strong> {submission.userId}
            </p>

            <div style={styles.controls}>
              <input
                type="number"
                placeholder="Tokens"
                min="1"
                id={`tokens-${submission.id}`}
                style={styles.tokenInput}
              />
              <button
                onClick={() =>
                  handleApprove(
                    submission.id,
                    submission.userId,
                    parseInt(
                      document.getElementById(`tokens-${submission.id}`).value
                    )
                  )
                }
                style={styles.approveBtn}
              >
                Approve
              </button>
              <button
                onClick={() => handleReject(submission.id)}
                style={styles.rejectBtn}
              >
                Reject
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: 20,
    backgroundColor: "#f0fdf4",
    minHeight: "100vh",
  },
  heading: {
    textAlign: "center",
    color: "#276749",
    marginBottom: 30,
  },
  card: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
  },
  image: {
    width: "100%",
    maxHeight: 300,
    objectFit: "contain",
    borderRadius: 8,
    marginBottom: 10,
  },
  controls: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginTop: 10,
  },
  tokenInput: {
    width: 80,
    padding: 8,
    borderRadius: 5,
    border: "1px solid #ccc",
  },
  approveBtn: {
    backgroundColor: "#276749",
    color: "#fff",
    padding: "8px 12px",
    border: "none",
    borderRadius: 5,
    cursor: "pointer",
  },
  rejectBtn: {
    backgroundColor: "#e53e3e",
    color: "#fff",
    padding: "8px 12px",
    border: "none",
    borderRadius: 5,
    cursor: "pointer",
  },
};
