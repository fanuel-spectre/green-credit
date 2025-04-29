import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";
import Loader from "./Loader";

function Leaderboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const getBadgeByTokens = (tokens) => {
  if (tokens >= 5000) return { emoji: "💎", label: "Premium", color: "#4B0082" };
  if (tokens >= 3000) return { emoji: "🥇", label: "Gold", color: "#FFD700" };
  if (tokens >= 1500) return { emoji: "🥈", label: "Silver", color: "#C0C0C0" };
  if (tokens >= 500)  return { emoji: "🥉", label: "Bronze", color: "#CD7F32" };
  return { emoji: "🌱", label: "Starter", color: "#228B22" };
};


useEffect(() => {
  const fetchUsersWithTokens = async () => {
    try {
      const [userSnapshot, treeSnapshot, cleanupSnapshot, solarSnapshot] =
        await Promise.all([
          getDocs(collection(db, "Users")),
          getDocs(collection(db, "TreeSubmissions")),
          getDocs(collection(db, "CleanupParticipation")),
          getDocs(collection(db, "SolarInstallationRewards")),
        ]);

      const tokenMap = {};

      // 1. TreeSubmissions
      treeSnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.status === "approved" && data.tokensAwarded && data.userId) {
          tokenMap[data.userId] =
            (tokenMap[data.userId] || 0) + Number(data.tokensAwarded);
        }
      });

      // 2. CleanupParticipation
      cleanupSnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.status === "approved" && data.rewardTokens && data.userId) {
          tokenMap[data.userId] =
            (tokenMap[data.userId] || 0) + Number(data.rewardTokens);
        }
      });

      // 3. SolarInstallationRewards (assuming all are approved by default)
      solarSnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.rewardTokens && data.userId) {
          tokenMap[data.userId] =
            (tokenMap[data.userId] || 0) + Number(data.rewardTokens);
        }
      });

      // Build user list with total tokens from all activities
      const userList = [];
      userSnapshot.forEach((doc) => {
        const data = doc.data();
        const totalTokens = tokenMap[doc.id] || 0;
        userList.push({
          id: doc.id,
          firstName: data.firstName,
          lastName: data.lastName,
          tokens: totalTokens,
        });
      });

      // Sort users by total tokens (descending)
      const sorted = userList.sort((a, b) => b.tokens - a.tokens);
      setUsers(sorted);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching leaderboard data:", error);
      setLoading(false);
    }
  };

  fetchUsersWithTokens();
}, []);


  if (loading) return <Loader />;
  return (
    <div style={styles.container}>
      <h2 style={styles.title}>🌱 Community Leaderboard</h2>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Rank</th>
            <th style={styles.th}>Name</th>
            <th style={styles.th}>Tokens</th>
            <th style={styles.th}>Badge</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => {
            const badge = getBadgeByTokens(user.tokens || 0);
            return (
              <tr key={user.id}>
                <td style={styles.td}>{index + 1}</td>
                <td style={styles.td}>
                  {user.firstName} {user.lastName}
                </td>
                <td style={styles.td}>{user.tokens || 0}</td>
                <td
                  style={{
                    ...styles.td,
                    color: badge.color,
                    fontWeight: "bold",
                  }}
                >
                  {badge.emoji} {badge.label}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}


const styles = {
  container: {
    padding: "30px",
    backgroundColor: "#e6f4ea",
    minHeight: "100vh",
    textAlign: "center",
  },
  title: {
    fontSize: "24px",
    marginBottom: "20px",
    color: "#276749",
  },
  table: {
    width: "100%",
    maxWidth: "600px",
    margin: "0 auto",
    borderCollapse: "collapse",
    backgroundColor: "#fff",
  },
  th: {
    border: "1px solid #ccc",
    padding: "10px",
    backgroundColor: "#276749",
    color: "white",
  },
  td: {
    border: "1px solid #ddd",
    padding: "10px",
    textAlign: "center",
  },
};

export default Leaderboard;