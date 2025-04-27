import React, { useEffect, useState } from "react";
import { db } from "./firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function RewardsHistory() {
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalTokens, setTotalTokens] = useState(0);
  const navigate = useNavigate();

  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) return;

    const fetchRewards = async () => {
      try {
        // Fetch TreeSubmissions
        const treesQ = query(
          collection(db, "TreeSubmissions"),
          where("userId", "==", user.uid),
          where("status", "==", "approved")
        );
        const treesSnapshot = await getDocs(treesQ);
        const treeRewards = treesSnapshot.docs.map((doc) => ({
          id: doc.id,
          type: "Tree Planting",
          tokens: doc.data().tokensAwarded,
          date: doc.data().createdAt?.toDate(),
        }));

        // Fetch CleanupParticipation
        const cleanupQ = query(
          collection(db, "CleanupParticipation"),
          where("userId", "==", user.uid),
          where("status", "==", "approved")
        );
        const cleanupSnapshot = await getDocs(cleanupQ);
        const cleanupRewards = cleanupSnapshot.docs.map((doc) => ({
          id: doc.id,
          type: "Community Cleanup",
          tokens: doc.data().rewardTokens,
          date: doc.data().createdAt?.toDate(),
        }));

        // Fetch SolarInstallationRewards
        const solarQ = query(
          collection(db, "SolarInstallationRewards"),
          where("userId", "==", user.uid)
        );
        const solarSnapshot = await getDocs(solarQ);
        const solarRewards = solarSnapshot.docs.map((doc) => ({
          id: doc.id,
          type: "Solar Installation",
          tokens: doc.data().rewardTokens,
          date: doc.data().createdAt?.toDate(),
        }));

        // Combine all rewards
        const allRewards = [...treeRewards, ...cleanupRewards, ...solarRewards];
        allRewards.sort((a, b) => b.date - a.date); // Sort newest first
        setRewards(allRewards);

        // Calculate total tokens
        const total = allRewards.reduce(
          (acc, curr) => acc + (curr.tokens || 0),
          0
        );
        setTotalTokens(total);
      } catch (error) {
        console.error("Error fetching rewards:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRewards();
  }, [user]);

  return (
    <div style={styles.container}>
      <div style={styles.buttonContainer}>
        <button
          onClick={() => navigate("/rewardhistory")}
          style={styles.button2}
        >
          Awarded Token History
        </button>
        <button onClick={() => navigate("/orders")} style={styles.button2}>
          Redeemed Token History
        </button>
      </div>
      <h2 style={styles.heading}>My Rewards History</h2>

      <div style={styles.totalBox}>
        <h3 style={styles.totalText}>Total Tokens Earned: {totalTokens}</h3>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : rewards.length === 0 ? (
        <p>No rewards yet. Start participating!</p>
      ) : (
        <div style={styles.list}>
          {rewards.map((reward, index) => (
            <div key={index} style={styles.card}>
              <p>
                <strong>Activity:</strong> {reward.type}
              </p>
              <p>
                <strong>Tokens Earned:</strong> {reward.tokens}
              </p>
              <p>
                <strong>Date:</strong> {reward.date?.toLocaleString()}
              </p>
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
    backgroundColor: "#f0fdf4",
  },
  heading: {
    textAlign: "center",
    color: "#276749",
    marginBottom: 10,
  },
  totalBox: {
    backgroundColor: "#c6f6d5",
    padding: "10px 20px",
    borderRadius: 8,
    textAlign: "center",
    marginBottom: 20,
  },
  totalText: {
    margin: 0,
    fontSize: "20px",
    color: "#22543d",
    fontWeight: "bold",
  },
  list: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: 20,
  },
  card: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  },
  buttonContainer: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
    justifyContent: "center",
    marginBottom: "20px",
  },
  button2: {
    flex: "1 1 200px",
    backgroundColor: "#276749",
    color: "white",
    padding: "10px",
    borderRadius: "5px",
    border: "none",
    cursor: "pointer",
    fontSize: "1rem",
  },
};
