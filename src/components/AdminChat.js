import React, { useState, useEffect, useRef } from "react";
import { db, auth } from "./firebase";
import {collection,query,orderBy,addDoc,serverTimestamp,onSnapshot,where,doc,getDoc,} from "firebase/firestore";

const AdminChat = () => {
  const user = auth.currentUser; // Admin logged in
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const bottomRef = useRef(null);

  // Fetch messages and unique userIds from messages
  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, "Messages"), orderBy("createdAt", "asc"));
    const unsubscribeMessages = onSnapshot(q, async (snapshot) => {
      const msgs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(msgs);

      // Get unique userIds from messages
      const uniqueUserIds = [...new Set(msgs.map((msg) => msg.userId))];

      // Fetch first names from Users collection
      const userPromises = uniqueUserIds.map(async (uid) => {
        const userRef = doc(db, "Users", uid);
        const userSnap = await getDoc(userRef);
        return {
          userId: uid,
          firstName: userSnap.exists() ? userSnap.data().firstName : "Unknown",
        };
      });

      const userList = await Promise.all(userPromises);
      setUsers(userList);
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

useEffect(() => {
  const timeout = setTimeout(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, 100);
  return () => clearTimeout(timeout);
}, [messages]);




  const sendMessage = async () => {
    if (newMessage.trim() === "") return;

    const messageData = {
      userId: selectedUserId,
      sender: "admin",
      message: newMessage.trim(),
      createdAt: serverTimestamp(),
    };

    setMessages((prevMessages) => [
      ...prevMessages,
      { ...messageData, createdAt: new Date() },
    ]);

    await addDoc(collection(db, "Messages"), messageData);
    setNewMessage("");
  };

  return (
    <div style={styles.container}>
      <h3>💬 Chat with Users</h3>

      {/* Render user buttons */}
      <div style={styles.userList}>
        <h4>Users:</h4>
        <div style={styles.buttonContainer}>
          {users.map((u) => (
            <button
              key={u.userId}
              onClick={() => setSelectedUserId(u.userId)}
              style={{
                ...styles.userButton,
                backgroundColor:
                  selectedUserId === u.userId ? "#68d391" : "#edf2f7",
              }}
            >
              {u.firstName}
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
            <strong>{msg.sender === "admin" ? "Admin" : "User"}:</strong> <br />
            {msg.message}
          </div>
        ))}
        <div ref={bottomRef} />
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
    backgroundColor: "#276749",
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
  overflowY: "auto", // ← changed from scroll to auto
  display: "flex",
  flexDirection: "column",
  gap: "10px",
  backgroundColor: "#f7fafc",
  padding: "10px",
  borderRadius: "8px",
  marginBottom: "15px",
  position: "relative", // ← crucial for scrollIntoView to work inside it
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
