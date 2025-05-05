import React, { useEffect, useState } from "react";
import { db } from "./firebase";
import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { toast } from "react-toastify";

export default function ManageSolarApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    const fetchApplications = async () => {
      if (!user) return;

      try {
        // Fetch all SolarApplications
        const q = query(collection(db, "SolarApplications"));
        const snapshot = await getDocs(q);
        const appsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Fetch the current user's solar requests
        const userRequestsSnapshot = await getDocs(
          query(
            collection(db, "SolarRequests"),
            where("userId", "==", user.uid)
          )
        );
        const userRequests = userRequestsSnapshot.docs.map((doc) => doc.id);

        // Filter applications to only those for this user's requests
        const filteredApps = appsData.filter((app) =>
          userRequests.includes(app.requestId)
        );

        // Get unique installer IDs
        const installerIds = [
          ...new Set(filteredApps.map((app) => app.userId)),
        ];

        // Fetch installer details by document ID
        const installersMap = {};
        for (const id of installerIds) {
          const installerDoc = await getDoc(doc(db, "Users", id));
          if (installerDoc.exists()) {
            installersMap[id] = installerDoc.data();
          }
        }

        // Add installer name to each application
        const enrichedApps = filteredApps.map((app) => ({
          ...app,
          installerName: installersMap[app.userId]?.firstName || "Unknown",
        }));

        setApplications(enrichedApps);
      } catch (error) {
        console.error("Error fetching applications:", error);
        setMessage("Failed to load applications.");
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [user]);

  const handleAccept = async (application) => {
    try {
      const solarRequestRef = doc(db, "SolarRequests", application.requestId);
      await updateDoc(solarRequestRef, {
        acceptedInstallerId: application.userId,
        status: "in progress",
      });
      toast.success("Admin logged in Successfully", {
                position: "top-center",
              });
    } catch (error) {
      console.error("Error accepting installer:", error);
      setMessage("Failed to accept installer.");
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Manage Solar Installation Applications</h2>

      {loading ? (
        <p style={styles.loading}>Loading applications...</p>
      ) : applications.length === 0 ? (
        <p style={styles.empty}>No applications yet.</p>
      ) : (
        <div style={styles.grid}>
          {applications.map((app) => (
            <div key={app.id} style={styles.card}>
              <p>
                <strong>Installer:</strong> {app.installerName}
              </p>
              <p>
                <strong>Request ID:</strong> {app.requestId}
              </p>

              <button onClick={() => handleAccept(app)} style={styles.button}>
                Accept Installer
              </button>
            </div>
          ))}
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
  heading: {
    textAlign: "center",
    marginBottom: "20px",
    color: "#276749",
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
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "20px",
  },
  card: {
    background: "white",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
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
  },
  message: {
    marginTop: "15px",
    textAlign: "center",
    color: "#2f855a",
  },
};
