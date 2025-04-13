import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import { db } from "./firebase";

function AdminReview() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubmissions = async () => {
      const querySnapshot = await getDocs(
        collection(db, "ActivitySubmissions")
      );
      const items = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.status === "pending") {
          items.push({ id: doc.id, ...data });
        }
      });
      setSubmissions(items);
      setLoading(false);
    };
    fetchSubmissions();
  }, []);

  const handleApproval = async (submission, status) => {
    const submissionRef = doc(db, "ActivitySubmissions", submission.id);
    await updateDoc(submissionRef, { status });

    if (status === "approved") {
      const userRef = doc(db, "Users", submission.userId);
      const userSnap = await getDoc(userRef);
      const currentTokens = userSnap.exists()
        ? userSnap.data().redeemableTokens || 0
        : 0;
      await updateDoc(userRef, {
        redeemableTokens: currentTokens + (submission.rewardTokens || 50),
      });
    }

    setSubmissions((prev) => prev.filter((s) => s.id !== submission.id));
  };

  if (loading) return <p>Loading submissions...</p>;

  return (
    <div style={{ padding: 30 }}>
      <h2>🧾 Pending Submissions</h2>
      {submissions.length === 0 ? (
        <p>No pending submissions.</p>
      ) : (
        submissions.map((submission) => (
          <div
            key={submission.id}
            style={{
              marginBottom: 30,
              border: "1px solid #ccc",
              padding: 20,
              borderRadius: 10,
            }}
          >
            <p>
              <strong>Activity:</strong> {submission.activityType}
            </p>
            <div style={{ display: "flex", gap: 20 }}>
              <div>
                <p>Before:</p>
                <img src={submission.beforeImageURL} alt="Before" width="200" />
              </div>
              <div>
                <p>After:</p>
                <img src={submission.afterImageURL} alt="After" width="200" />
              </div>
            </div>
            <div style={{ marginTop: 10 }}>
              <button
                onClick={() => handleApproval(submission, "approved")}
                style={{
                  marginRight: 10,
                  background: "#38a169",
                  color: "white",
                  padding: "8px 16px",
                  border: "none",
                  borderRadius: 5,
                }}
              >
                Approve
              </button>
              <button
                onClick={() => handleApproval(submission, "rejected")}
                style={{
                  background: "#e53e3e",
                  color: "white",
                  padding: "8px 16px",
                  border: "none",
                  borderRadius: 5,
                }}
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

export default AdminReview;
