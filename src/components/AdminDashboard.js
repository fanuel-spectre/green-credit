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
             email: userDoc.data().email,
           });
           usersSet.add(userId); // Add userId to the set to avoid duplicates
         }
       }
     }

     setUsers(usersWithEmails);
   } catch (error) {
     console.error("Error fetching users:", error);
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
  }, []);

  useEffect(() => {
    if (selectedUser) {
      setLoading(true);
      fetchUserSubmissions(selectedUser); // Fetch submissions for the selected user
    }
  }, [selectedUser]);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6 text-green-700">
        Admin Dashboard
      </h1>

      {/* Display the list of users in a table */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold">Select a User</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b text-left">User ID</th>
                <th className="py-2 px-4 border-b text-left">Email</th>
                <th className="py-2 px-4 border-b text-left">Name</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.userId}>
                  <td className="py-2 px-4 border-b">{user.userId}</td>
                  <td className="py-2 px-4 border-b">{user.email}</td>
                  <td className="py-2 px-4 border-b">
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
        </div>
      </div>

      {/* Display user submissions (images) */}
      {selectedUser && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">
            Submissions for {selectedUser}
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
};

export default AdminDashboard;
