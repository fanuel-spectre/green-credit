import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";
import Loader from "./Loader";

function Leaderboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchUsersWithTokens = async () => {
    try {
      const userSnapshot = await getDocs(collection(db, "Users"));
      const submissionSnapshot = await getDocs(
        collection(db, "TreeSubmissions")
      );


      // Create a token map by userId
      const tokenMap = {};

      submissionSnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.status === "approved" && data.tokensAwarded && data.userId) {
          console.log(
            "Submission userId:",
            data.userId,
            "Tokens:",
            data.tokensAwarded
          );
          tokenMap[data.userId] =
            (tokenMap[data.userId] || 0) + data.tokensAwarded;
        }
      });

      // Build user list with tokens
      const userList = [];
      userSnapshot.forEach((doc) => {
        console.log("User doc.id:", doc.id);
        const data = doc.data();
        const totalTokens = tokenMap[doc.id] || 0;
        userList.push({
          id: doc.id,
          firstName: data.firstName,
          lastName: data.lastName,
          tokens: totalTokens,
        });
      });

      // Sort by tokens descending
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
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={user.id}>
              <td style={styles.td}>{index + 1}</td>
              <td style={styles.td}>
                {user.firstName} {user.lastName}
              </td>
              <td style={styles.td}>{user.tokens || 0}</td>
            </tr>
          ))}
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