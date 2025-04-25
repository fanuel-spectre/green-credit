import React, { useEffect, useState } from "react";
import { db } from "./firebase";
import {
  collection,
  getDocs,
  addDoc,
  query,
  where,
  Timestamp,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";

export default function CommunityCleanupEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [registeredEventId, setRegisteredEventId] = useState(null);

  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const eventsSnapshot = await getDocs(collection(db, "cleanupEvents"));
        const eventsData = eventsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setEvents(eventsData);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleRegister = async (eventId) => {
    if (!user) {
      alert("You must be logged in to register.");
      return;
    }

    setRegistering(true);
    try {
      await addDoc(collection(db, "eventParticipants"), {
        eventId,
        userId: user.uid,
        email: user.email,
        registeredAt: Timestamp.now(),
        status: "registered",
      });
      setRegisteredEventId(eventId);
      alert("Successfully registered!");
    } catch (error) {
      console.error("Error registering for event:", error);
      alert("Error occurred while registering.");
    } finally {
      setRegistering(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>📍 Community Clean-Up Events</h2>

      {loading ? (
        <div style={styles.loader}>Loading events...</div>
      ) : events.length === 0 ? (
        <p style={styles.noEvents}>No upcoming events.</p>
      ) : (
        events.map((event) => (
          <div key={event.id} style={styles.card}>
            <h3>{event.title}</h3>
            <p>
              <strong>Location:</strong> {event.location}
            </p>
            <p>
              <strong>Date:</strong> {event.date} | <strong>Time:</strong>{" "}
              {event.time}
            </p>
            <p>
              <strong>Reward:</strong> {event.rewardTokens} Tokens
            </p>
            <button
              style={styles.button}
              onClick={() => handleRegister(event.id)}
              disabled={registering || registeredEventId === event.id}
            >
              {registeredEventId === event.id ? "Registered" : "Register"}
            </button>
          </div>
        ))
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: "20px",
    maxWidth: "800px",
    margin: "0 auto",
  },
  heading: {
    textAlign: "center",
    marginBottom: "20px",
    color: "#2F855A",
  },
  loader: {
    textAlign: "center",
    fontSize: "18px",
    color: "#888",
  },
  noEvents: {
    textAlign: "center",
    color: "#555",
  },
  card: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    marginBottom: "20px",
    textAlign: "left",
  },
  button: {
    backgroundColor: "#2F855A",
    color: "#fff",
    padding: "10px 20px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    marginTop: "10px",
  },
};
