import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";

function Leaderboard() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "Users"));
        const userList = [];
        querySnapshot.forEach((doc) => {
          userList.push({ id: doc.id, ...doc.data() });
        });

        // Sort users by redeemableTokens descending
        const sorted = userList.sort(
          (a, b) => (b.redeemableTokens || 0) - (a.redeemableTokens || 0)
        );
        setUsers(sorted);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

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
              <td style={styles.td}>{user.redeemableTokens || 0}</td>
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