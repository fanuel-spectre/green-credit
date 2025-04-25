import React, { useEffect, useState } from "react";
import { db } from "./firebase";
import { useNavigate } from "react-router-dom";
import {
  collection,
  getDocs,
  addDoc,
  query,
  Timestamp,
  where,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";

function GarbageEventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [registrations, setRegistrations] = useState([]);
  const auth = getAuth();
  const user = auth.currentUser;
  const navigate = useNavigate();

useEffect(() => {
  const fetchEventsAndRegistrations = async () => {
    try {
      const eventsSnapshot = await getDocs(collection(db, "GarbageEvents"));
      const eventsData = eventsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setEvents(eventsData);

      if (user) {
        const regQuery = query(
          collection(db, "Registrations"),
          where("userId", "==", user.uid)
        );
        const regSnapshot = await getDocs(regQuery);
        const regData = regSnapshot.docs.map((doc) => doc.data().eventId);
        setRegistrations(regData);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Failed to load data.");
    } finally {
      setLoading(false);
    }
  };

  fetchEventsAndRegistrations();
}, [user]);


  const handleRegister = async (eventId) => {
    if (!user) return alert("Please log in first.");
    try {
      await addDoc(collection(db, "Registrations"), {
        userId: user.uid,
        eventId,
        status: "registered",
        registeredAt: Timestamp.now(),
      });
      setRegistrations((prev) => [...prev, eventId]);
      alert("Successfully registered!");
    } catch (error) {
      console.error("Registration error:", error);
      alert("Failed to register.");
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>🧹 Community Clean-Up Events</h2>

      {loading ? (
        <div style={styles.loaderContainer}>
          <div style={styles.loader}></div>
        </div>
      ) : events.length === 0 ? (
        <p style={styles.empty}>No events available at the moment.</p>
      ) : (
        <div style={styles.grid}>
          {events.map((event) => (
            <div key={event.id} style={styles.card}>
              <h3 style={styles.title}>{event.title}</h3>
              <p style={styles.text}>{event.description}</p>
              <p style={styles.text}>
                📍 <strong>Location:</strong> {event.location}
              </p>
              <p style={styles.text}>
                🕒 <strong>Date:</strong>{" "}
                {event.dateTime.toDate().toLocaleString()}
              </p>
              <p style={styles.text}>
                🎁 <strong>Reward:</strong> {event.tokenReward} tokens
              </p>
              {!registrations.includes(event.id) ? (
                <button
                  style={styles.button}
                  onClick={() => handleRegister(event.id)}
                >
                  Register
                </button>
              ) : (
                <p style={styles.alreadyRegistered}>
                  ✅ You’ve registered for this event
                </p>
              )}
              {registrations.includes(event.id) && (
                <div>
                  <button
                    style={styles.confirmbutton}
                    onClick={() => navigate("/garbageparticipation")}
                  >
                    Confirm Participation
                  </button>
                </div>
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
    backgroundColor: "#f0fdf4",
    minHeight: "100vh",
  },
  heading: {
    textAlign: "center",
    color: "#276749",
    marginBottom: 30,
  },
  loaderContainer: {
    display: "flex",
    justifyContent: "center",
    marginTop: 50,
  },
  loader: {
    border: "6px solid #cce7d0",
    borderTop: "6px solid #276749",
    borderRadius: "50%",
    width: 40,
    height: 40,
    animation: "spin 1s linear infinite",
  },
  "@keyframes spin": {
    from: { transform: "rotate(0deg)" },
    to: { transform: "rotate(360deg)" },
  },
  empty: {
    textAlign: "center",
    color: "#666",
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
  },
  title: {
    marginBottom: 10,
  },
  text: {
    fontSize: 14,
    marginBottom: 8,
  },
  button: {
    marginTop: 10,
    backgroundColor: "#276749",
    color: "white",
    border: "none",
    padding: "10px 15px",
    borderRadius: 5,
    cursor: "pointer",
  },
  confirmbutton: {
    marginTop: 10,
    backgroundColor: "#276749",
    color: "white",
    border: "none",
    padding: "10px 15px",
    borderRadius: 5,
    cursor: "pointer",
    alreadyRegistered: {
      marginTop: 10,
      fontSize: 14,
      color: "#276749",
      fontWeight: "bold",
    },
  },
};

export default GarbageEventsPage;
