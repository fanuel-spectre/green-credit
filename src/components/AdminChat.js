import React, { useEffect, useState } from "react";
import {
  collection,
  query,
  orderBy,
  where,
  onSnapshot,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";

function AdminChatDashboard() {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [reply, setReply] = useState("");

  // Fetch unique userIds who have sent messages
  useEffect(() => {
    const q = query(collection(db, "Messages"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const userSet = new Set();
      snapshot.docs.forEach((doc) => {
        const data = doc.data();
        if (data.userId) userSet.add(data.userId);
      });
      setUsers([...userSet]);
    });

    return () => unsubscribe();
  }, []);

  // Fetch messages for selected user
  useEffect(() => {
    if (!selectedUserId) return;

    const q = query(
      collection(db, "Messages"),
      where("userId", "==", selectedUserId),
      orderBy("createdAt", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => doc.data());
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, [selectedUserId]);

  const sendReply = async () => {
    if (reply.trim() === "" || !selectedUserId) return;

    await addDoc(collection(db, "Messages"), {
      userId: selectedUserId,
      sender: "admin",
      message: reply.trim(),
      createdAt: serverTimestamp(),
    });

    setReply("");
  };

  return (
    <div style={styles.container}>
      <h2>📬 Admin Chat Dashboard</h2>
      <div style={styles.dashboard}>
        <div style={styles.sidebar}>
          <h4>Users</h4>
          {users.map((uid) => (
            <button
              key={uid}
              onClick={() => setSelectedUserId(uid)}
              style={{
                ...styles.userButton,
                backgroundColor: selectedUserId === uid ? "#68d391" : "#edf2f7",
              }}
            >
              {uid}
            </button>
          ))}
        </div>

        <div style={styles.chatArea}>
          <div style={styles.chatBox}>
            {messages.map((msg, index) => (
              <div
                key={index}
                style={{
                  ...styles.message,
                  alignSelf: msg.sender === "admin" ? "flex-end" : "flex-start",
                  backgroundColor:
                    msg.sender === "admin" ? "#c6f6d5" : "#e2e8f0",
                }}
              >
                <strong>{msg.sender === "admin" ? "Admin" : "User"}:</strong>{" "}
                {msg.message}
              </div>
            ))}
          </div>

          {selectedUserId && (
            <div style={styles.inputBox}>
              <input
                type="text"
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                placeholder="Type your reply..."
                style={styles.input}
              />
              <button onClick={sendReply} style={styles.sendButton}>
                Reply
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: "20px",
    backgroundColor: "#f0fff4",
    minHeight: "100vh",
  },
  dashboard: {
    display: "flex",
    gap: "20px",
  },
  sidebar: {
    width: "200px",
    backgroundColor: "#f7fafc",
    padding: "10px",
    borderRadius: "8px",
    height: "500px",
    overflowY: "auto",
  },
  userButton: {
    display: "block",
    width: "100%",
    padding: "10px",
    marginBottom: "5px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    textAlign: "left",
  },
  chatArea: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
  },
  chatBox: {
    flex: 1,
    backgroundColor: "#ffffff",
    padding: "10px",
    borderRadius: "8px",
    overflowY: "auto",
    height: "400px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    border: "1px solid #ccc",
  },
  message: {
    padding: "10px",
    borderRadius: "8px",
    maxWidth: "70%",
    wordWrap: "break-word",
  },
  inputBox: {
    display: "flex",
    gap: "10px",
    marginTop: "10px",
  },
  input: {
    flex: 1,
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
  },
  sendButton: {
    padding: "10px 15px",
    backgroundColor: "#276749",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
};

export default AdminChatDashboard;
