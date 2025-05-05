import React, { useEffect, useState } from "react";
import { db } from "./firebase";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function BrowseSolarJobs() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const auth = getAuth();
  const user = auth.currentUser;
  const navigate = useNavigate();
  const [myApplications, setMyApplications] = useState([]);
  const [myAcceptedRequests, setMyAcceptedRequests] = useState([]);

  
useEffect(() => {
  const fetchUserApplications = async () => {
    if (!user) return;
    const appsSnapshot = await getDocs(
      query(
        collection(db, "SolarApplications"),
        where("userId", "==", user.uid)
      )
    );
    const apps = appsSnapshot.docs.map((doc) => doc.data().requestId);
    setMyApplications(apps);

    // Fetch SolarRequests where current user is acceptedInstaller
    const acceptedSnapshot = await getDocs(
      query(
        collection(db, "SolarRequests"),
        where("acceptedInstallerId", "==", user.uid)
      )
    );
    const acceptedIds = acceptedSnapshot.docs.map((doc) => doc.id);
    setMyAcceptedRequests(acceptedIds);
  };

  fetchUserApplications();
}, [user]);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const q = query(
          collection(db, "SolarRequests"),
          
        );
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setRequests(data);
      } catch (error) {
        console.error("Error fetching solar requests:", error);
        setMessage("Failed to load requests.");
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const handleApply = async (requestId) => {
    if (!user) {
      setMessage("You must be logged in to apply.");
      return;
    }
    try {
      await addDoc(collection(db, "SolarApplications"), {
        userId: user.uid,
        requestId,
        status: "applied",
        appliedAt: serverTimestamp(),
      });
      toast.success("Successfully applied! Waiting for confirmation.", {
        position: "top-center",
      });
    } catch (error) {
      console.error("Application error:", error);
      setMessage("Failed to apply. Try again.");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.buttonContainer}>
        <button
          onClick={() => navigate("/solarrequests")}
          style={styles.button2}
        >
          + Add a Request
        </button>
        <button
          onClick={() => navigate("/solarinstallers")}
          style={styles.button2}
        >
          Applied Installers
        </button>
        <button
          onClick={() => navigate("/mysolarrequests")}
          style={styles.button2}
        >
          Ongoing Requests
        </button>
      </div>
      <h2 style={styles.heading}>Available Solar Installations</h2>

      {loading ? (
        <p style={styles.loading}>Loading jobs...</p>
      ) : requests.length === 0 ? (
        <p style={styles.empty}>
          No installation jobs available at the moment.
        </p>
      ) : (
        <div style={styles.grid}>
          {requests.map((req) => {
            const hasApplied = myApplications.includes(req.id);
            const isAccepted = myAcceptedRequests.includes(req.id);

            return (
              <div key={req.id} style={styles.card}>
                <h3>Request ID: {req.id}</h3>
                <p>
                  <strong>Description:</strong> {req.description}
                </p>
                <p>
                  <strong>Location:</strong> {req.location}
                </p>
                <p>
                  <strong>Token Award:</strong> {req.tokenAmount}
                </p>

                {isAccepted ? (
                  <button
                    onClick={() =>
                      navigate(`/solarsubmissions`, {
                        state: { requestId: req.id },
                      })
                    }
                    style={styles.button}
                  >
                    Submit Proof
                  </button>
                ) : hasApplied ? (
                  <button
                    style={{
                      ...styles.button,
                      backgroundColor: "#ccc",
                      cursor: "not-allowed",
                    }}
                    disabled
                  >
                    You applied to this task
                  </button>
                ) : (
                  <button
                    onClick={() => handleApply(req.id)}
                    style={styles.button}
                  >
                    Apply to Install
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
      {message && <p style={styles.message}>{message}</p>}
    </div>
  );
}

const styles = {
  container: {
    padding: "20px",
    backgroundColor: "#f0fff4",
    minHeight: "100vh",
  },
  buttonContainer: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
    justifyContent: "center",
    marginBottom: "20px",
  },
  heading: {
    textAlign: "center",
    marginBottom: "20px",
    color: "#276749",
    fontSize: "clamp(1.5rem, 5vw, 2rem)",
  },
  loading: {
    textAlign: "center",
    marginTop: "50px",
  },
  empty: {
    textAlign: "center",
    marginTop: "50px",
    color: "#666",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "20px",
  },
  card: {
    background: "white",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  title: {
    marginBottom: "10px",
  },
  button: {
    marginTop: "10px",
    width: "100%",
    backgroundColor: "#276749",
    color: "white",
    padding: "10px",
    borderRadius: "5px",
    border: "none",
    cursor: "pointer",
    fontSize: "1rem",
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
  message: {
    marginTop: "15px",
    textAlign: "center",
    color: "#2f855a",
  },
};
