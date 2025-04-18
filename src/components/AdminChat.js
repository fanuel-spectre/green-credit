import React, { useState, useEffect } from "react";
import { db, auth } from "./firebase";
import {
  collection,
  query,
  orderBy,
  addDoc,
  serverTimestamp,
  onSnapshot,
  where,
} from "firebase/firestore";

const AdminChat = () => {
  const user = auth.currentUser; // Admin logged in
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);

  // Fetch all users that have sent messages in the chat
  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, "Messages"), orderBy("createdAt", "asc"));
    const unsubscribeMessages = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(msgs);

      // Get the list of unique users who have sent messages
      const uniqueUsers = [...new Set(msgs.map((msg) => msg.userId))];
      setUsers(uniqueUsers);
    });

    return () => unsubscribeMessages();
  }, [user]);

  // Fetch messages for the selected user
  useEffect(() => {
    if (!selectedUserId) return;

    const q = query(
      collection(db, "Messages"),
      where("userId", "==", selectedUserId),
      orderBy("createdAt", "asc")
    );
    const unsubscribeMessages = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(msgs);
    });

    return () => unsubscribeMessages();
  }, [selectedUserId]);

  // Send a message to Firestore
  const sendMessage = async () => {
    if (newMessage.trim() === "") return;

    const messageData = {
      userId: selectedUserId, // Reply to the selected user
      sender: "admin",
      message: newMessage.trim(),
      createdAt: serverTimestamp(),
    };

    // Optimistically update the UI (immediately show the message)
    setMessages((prevMessages) => [
      ...prevMessages,
      { ...messageData, createdAt: new Date() }, // Add message with temporary timestamp
    ]);

    // Send the message to Firestore
    await addDoc(collection(db, "Messages"), messageData);

    setNewMessage(""); // Clear the input after sending
  };

  return (
    <div style={styles.container}>
      <h3>💬 Chat with Users</h3>

      {/* Render user buttons */}
      <div style={styles.userList}>
        <h4>Users:</h4>
        <div style={styles.buttonContainer}>
          {users.map((userId) => (
            <button
              key={userId}
              onClick={() => setSelectedUserId(userId)}
              style={{
                ...styles.userButton,
                backgroundColor:
                  selectedUserId === userId ? "#68d391" : "#edf2f7",
              }}
            >
              {userId}
            </button>
          ))}
        </div>
      </div>

      {/* Chat box */}
      <div id="chat-box" style={styles.chatBox}>
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              ...styles.message,
              alignSelf: msg.sender === "admin" ? "flex-end" : "flex-start",
              backgroundColor: msg.sender === "admin" ? "#dcfce7" : "#e2e8f0",
            }}
          >
            <strong>{msg.sender === "admin" ? "Admin" : "You"}:</strong> <br />
            {msg.message}
          </div>
        ))}
      </div>

      {/* Message input */}
      {selectedUserId && (
        <div style={styles.inputBox}>
          <input
            type="text"
            placeholder="Type your reply..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            style={styles.input}
          />
          <button onClick={sendMessage} style={styles.sendButton}>
            Send
          </button>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: "20px",
    maxWidth: "800px",
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
  },
  userList: {
    marginBottom: "20px",
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    backgroundColor: "#f0f0f0",
  },
  buttonContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  userButton: {
    padding: "10px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    textAlign: "left",
    width: "100%",
  },
  chatBox: {
    minHeight: "300px",
    maxHeight: "400px",
    overflowY: "scroll",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    backgroundColor: "#f7fafc",
    padding: "10px",
    borderRadius: "8px",
    marginBottom: "15px",
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

export default AdminChat;
