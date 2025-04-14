import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  getDoc,
  updateDoc,
  doc,
  query,
  where,
} from "firebase/firestore";
import { db } from "./firebase";
import { toast } from "react-toastify";
import Loader from "./Loader";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]); // List of users
  const [selectedUser, setSelectedUser] = useState(null); // Selected user for viewing submissions
  const [userSubmissions, setUserSubmissions] = useState([]); // Submissions of the selected user
  const [loading, setLoading] = useState(true);
  

  // Fetch all users who have made submissions
 const fetchUsers = async () => {
   try {
     const querySnapshot = await getDocs(collection(db, "TreeSubmissions"));
     const usersSet = new Set(); // To ensure we have unique users

     // Fetch emails from the Users collection based on userId
     const usersWithEmails = [];
     for (let docSnap of querySnapshot.docs) {
       const userId = docSnap.data().userId; // Assuming userId is stored for each submission
       if (!usersSet.has(userId)) {
         // Get user details from the Users collection
         const userDoc = await getDoc(doc(db, "Users", userId));
         if (userDoc.exists()) {
           usersWithEmails.push({
             userId: userId,
             firstName: userDoc.data().firstName,
             lastName: userDoc.data().lastName,
             email: userDoc.data().email,
           });
           usersSet.add(userId); // Add userId to the set to avoid duplicates
         }
       }
     }

     setUsers(usersWithEmails);
     setLoading(false);
   } catch (error) {
     console.error("Error fetching users:", error);
   } finally {
     setLoading(false);
   }
 };

  // Fetch submissions for a selected user
  const fetchUserSubmissions = async (userId) => {
    try {
      const q = query(
        collection(db, "TreeSubmissions"),
        where("userId", "==", userId)
      );
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUserSubmissions(data);
     setLoading(false);
    } catch (error) {
      console.error("Error fetching submissions:", error);
    } finally {
      setLoading(false);
    }
  };

  // Update the submission status (approve/reject)
  const handleStatusUpdate = async (id, status) => {
    try {
      await updateDoc(doc(db, "TreeSubmissions", id), { status });
      toast.success(`Submission ${status}`);
      fetchUserSubmissions(selectedUser); // Refresh the list of submissions for the selected user
    } catch (error) {
      console.error("Status update failed:", error);
      toast.error("Update failed");
    }
  };

  useEffect(() => {
    fetchUsers(); // Fetch the list of users once the component is mounted
  }, 
  []);
  

  useEffect(() => {
    if (selectedUser) {
      setLoading(true);
      fetchUserSubmissions(selectedUser); // Fetch submissions for the selected user
    }
  }, [selectedUser]);



  return (
    <div style={styles.container}>
      {/* <h2 style={styles.title}>🌱 Admin Dashboard</h2> */}
      {/* Display the list of users in a table */}
      <div className="mb-6">
        <h3 style={styles.title}>Select a User</h3>
        {loading ? (
          <div className="flex justify-center items-center my-8">
            <Loader />
          </div>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>User ID</th>
                {/* <th style={styles.th}>Email</th> */}
                <th style={styles.th}>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.userId}>
                  <td style={styles.td}>
                    {user.firstName} {user.lastName}
                  </td>
                  {/* <td style={styles.td}>{user.email}</td> */}
                  <td style={styles.td}>
                    <button
                      onClick={() => setSelectedUser(user.userId)}
                      className="text-blue-600 hover:underline"
                    >
                      View Submissions
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Display user submissions (images) */}
      {selectedUser && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">
            Submissions for{" "}
            {users.find((user) => user.userId === selectedUser)?.firstName ||
              "Unknown User"}
          </h2>
          {loading ? (
            <p>Loading submissions...</p>
          ) : (
            <div className="grid grid-cols-2 gap-6">
              {userSubmissions.map((item) => (
                <div
                  key={item.id}
                  className="border p-4 rounded-lg shadow-md bg-white"
                >
                  <div style={styles.grid}>
                    <div style={styles.gridItem}>
                      {/* Before Image */}
                      <h3>Before</h3>
                      <div className="card w-32 h-32 bg-gray-100 p-2 rounded-lg">
                        <img
                          src={item.beforeUrl}
                          alt="Before"
                          style={{
                            width: "40%", // Set width for image
                            height: "50%", // Set height for image
                            objectFit: "cover", // Ensure the image maintains aspect ratio
                            borderRadius: "4px",
                          }}
                        />
                      </div>
                    </div>
                    {/* After Image */}
                    <div style={styles.grid}>
                      <div style={styles.gridItem}>
                        <h3>After</h3>
                        <div className="card w-32 h-32 bg-gray-100 p-2 rounded-lg">
                          <img
                            src={item.afterUrl}
                            alt="After"
                            style={{
                              width: "40%", // Set width for image
                              height: "50%", // Set height for image
                              objectFit: "cover", // Ensure the image maintains aspect ratio
                              borderRadius: "4px",
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="mb-2">
                    <strong>Status:</strong>{" "}
                    <span
                      className={`font-semibold ${
                        item.status === "approved"
                          ? "text-green-600"
                          : item.status === "rejected"
                          ? "text-red-600"
                          : "text-yellow-600"
                      }`}
                    >
                      {item.status}
                    </span>
                  </p>
                  {item.status === "pending" && (
                    <div className="flex gap-4">
                      <button
                        onClick={() => handleStatusUpdate(item.id, "approved")}
                        style={styles.ctaButton}
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(item.id, "rejected")}
                        style={styles.ctaButton2}
                        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
const styles = {
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "30px",
  },
  gridItem: {
    backgroundColor: "#f9f9f9",
    padding: "20px",
    margin: "20px",
    borderRadius: "8px",
    textAlign: "center",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  },
  ctaButton: {
    backgroundColor: "#2FC56D",
    color: "white",
    padding: "15px 30px",
    border: "none",
    borderRadius: "5px",
    fontSize: "18px",
    textDecoration: "none",
    zIndex: 2, // Ensure button is above the overlay
    position: "relative",
  },
  ctaButton2: {
    backgroundColor: "#EC3440",
    color: "white",
    margin: "10px",
    padding: "15px 30px",
    border: "none",
    borderRadius: "5px",
    fontSize: "18px",
    textDecoration: "none",
    zIndex: 2, // Ensure button is above the overlay
    position: "relative",
  },

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

export default AdminDashboard;
