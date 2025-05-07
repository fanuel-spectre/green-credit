import React, { useEffect, useState } from "react";
import { db } from "./firebase";
import {
  collection,
  getDocs,
  query,
  where,
  addDoc,
  getDoc,
  updateDoc,
  doc,
} from "firebase/firestore";

export default function AdminSolarApprovals() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const q = query(
          collection(db, "SolarInstallations"),
          where("status", "==", "pending")
        );
        const snapshot = await getDocs(q);
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

    fetchSubmissions();
  }, []);

  const handleApprove = async (submissionId, userId, rewardTokens) => {
    try {
      if (!userId) {
        alert("Submission is missing user ID.");
        return;
      }

      // 1. Mark submission as approved
      const submissionRef = doc(db, "SolarInstallations", submissionId);
      await updateDoc(submissionRef, { status: "approved" });

      // 2. Award tokens
      const userSubmissionsRef = collection(db, "SolarInstallationRewards");
      await addDoc(userSubmissionsRef, {
        userId,
        rewardTokens,
        type: "solar_installation",
        createdAt: new Date(),
      });

      const userRef = doc(db, "Users", userId);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const currentTokens = userSnap.data().totalTokens || 0;

        await updateDoc(userRef, {
          totalTokens: currentTokens + rewardTokens,
        });
      }

      alert("Submission approved and tokens awarded!");
      setSubmissions((prev) => prev.filter((sub) => sub.id !== submissionId));
    } catch (error) {
      console.error("Error approving submission:", error);
      alert("Failed to approve.");
    }
  };


  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Admin Solar Installations Approval</h2>
      {loading ? (
        <p>Loading submissions...</p>
      ) : submissions.length === 0 ? (
        <p>No pending submissions.</p>
      ) : (
        <div style={styles.grid}>
          {submissions.map((submission) => (
            <div key={submission.id} style={styles.card}>
              <img
                src={submission.imageUrl}
                alt="Installation Proof"
                style={styles.image}
              />
              <p>
                <strong>User ID:</strong> {submission.installerId}
              </p>
              <p>
                <strong>Status:</strong> {submission.status}
              </p>
              <p>
                <strong>Completed by Owner:</strong>{" "}
                {submission.completedByOwner ? "✅" : "❌"}
              </p>

              {/* Only show approve if owner completed */}
              {submission.completedByOwner ? (
                <button
                  style={styles.button}
                  onClick={
                    () =>
                      handleApprove(
                        submission.id,
                        submission.installerId,
                        submission.tokenReward || 50
                      ) // default 50 tokens
                  }
                >
                  Approve and Award Tokens
                </button>
              ) : (
                <p style={{ color: "red" }}>Waiting for owner confirmation.</p>
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
    minHeight: "100vh",
    backgroundColor: "#f7fafc",
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
