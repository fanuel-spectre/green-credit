import React, { useEffect, useState } from "react";
import { db } from "./firebase";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";

export default function CleanupDashboard() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const snapshot = await getDocs(collection(db, "CleanupParticipation"));
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setSubmissions(data);
    } catch (error) {
      console.error("Error fetching submissions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (submissionId) => {
    try {
      const submissionRef = doc(db, "CleanupParticipation", submissionId);
      await updateDoc(submissionRef, {
        status: "approved",
      });
      fetchSubmissions();
    } catch (error) {
      console.error("Error approving submission:", error);
    }
  };

  const handleReject = async (submissionId) => {
    try {
      const submissionRef = doc(db, "CleanupParticipation", submissionId);
      await updateDoc(submissionRef, {
        status: "rejected",
      });
      fetchSubmissions();
    } catch (error) {
      console.error("Error rejecting submission:", error);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Clean-Up Activity Approvals</h2>

      {loading ? (
        <p style={styles.loading}>Loading submissions...</p>
      ) : submissions.length === 0 ? (
        <p style={styles.noData}>No submissions found.</p>
      ) : (
        submissions.map((submission) => (
          <div key={submission.id} style={styles.card}>
            <img src={submission.imageUrl} alt="Proof" style={styles.image} />
            <p>
              <strong>User ID:</strong> {submission.userId}
            </p>
            <p>
              <strong>Status:</strong> {submission.status}
            </p>

            {submission.status === "pending" && (
              <div style={styles.actions}>
                <button
                  style={styles.approveButton}
                  onClick={() => handleApprove(submission.id)}
                >
                  Approve
                </button>
                <button
                  style={styles.rejectButton}
                  onClick={() => handleReject(submission.id)}
                >
                  Reject
                </button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: "20px",
    backgroundColor: "#e6f4ea",
    minHeight: "100vh",
  },
  heading: {
    textAlign: "center",
    color: "#276749",
    marginBottom: "20px",
  },
  loading: {
    textAlign: "center",
    color: "#4a5568",
  },
  noData: {
    textAlign: "center",
    color: "#4a5568",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: "10px",
    padding: "15px",
    marginBottom: "20px",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
  },
  image: {
    width: "100%",
    height: "auto",
    borderRadius: "8px",
    marginBottom: "10px",
  },
  actions: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "10px",
  },
  approveButton: {
    backgroundColor: "#38a169",
    color: "#fff",
    padding: "8px 16px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  rejectButton: {
    backgroundColor: "#e53e3e",
    color: "#fff",
    padding: "8px 16px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};
