import React, { useState, useEffect } from "react";
import { db, auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  query,
  where,
  orderBy,
  addDoc,
  serverTimestamp,
  onSnapshot,
} from "firebase/firestore";

function UserChat() {
  const [user, setUser] = useState(null); // Track logged-in user
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });
    return () => unsubscribe();
  }, []);

  // Fetch messages when user is available
  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "Messages"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, [user]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !user) return;

    const messageData = {
      userId: user.uid,
      sender: "user",
      message: newMessage.trim(),
      createdAt: serverTimestamp(),
    };

    // Optimistic UI update
    setMessages((prevMessages) => [
      ...prevMessages,
      { ...messageData, createdAt: new Date() },
    ]);

    await addDoc(collection(db, "Messages"), messageData);
    setNewMessage("");
  };

  // Scroll to bottom when new messages are added
  useEffect(() => {
    const chatBox = document.getElementById("chat-box");
    if (chatBox) {
      chatBox.scrollTop = chatBox.scrollHeight;
    }
  }, [messages]);

  return (
    <div style={styles.container}>
      <h3>💬 Chat with Support</h3>
      <div id="chat-box" style={styles.chatBox}>
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              ...styles.message,
              alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
              backgroundColor: msg.sender === "user" ? "#dcfce7" : "#e2e8f0",
            }}
          >
            <strong>{msg.sender === "user" ? "You" : "Admin"}:</strong> <br />
            {msg.message}
          </div>
        ))}
      </div>

      <div style={styles.inputBox}>
        <input
          type="text"
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          style={styles.input}
        />
        <button onClick={sendMessage} style={styles.sendButton}>
          Send
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: "20px",
    maxWidth: "500px",
    margin: "0 auto",
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

export default UserChat;
