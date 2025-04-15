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
  const [ratings, setRatings] = useState({});
  const [editingAwardId, setEditingAwardId] = useState(null);

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

  // Update local rating state
  const handleRatingChange = (submissionId, value) => {
    setRatings((prev) => ({
      ...prev,
      [submissionId]: parseInt(value),
    }));
  };

  // Award tokens based on rating
  const awardTokens = async (submissionId) => {
    const rating = ratings[submissionId];
    if (!rating) {
      toast.error("Please select a rating first");
      return;
    }

    const tokens = rating * 10; // 1 star = 10 tokens, 5 stars = 50 tokens

    try {
      await updateDoc(doc(db, "TreeSubmissions", submissionId), {
        rating,
        tokensAwarded: tokens,
      });
      toast.success(`Awarded ${tokens} tokens for ${rating}-star rating`);
      fetchUserSubmissions(selectedUser); // Refresh after update
    } catch (error) {
      console.error("Error awarding tokens:", error);
      toast.error("Failed to award tokens");
    }
  };

  const updateAward = async (submissionId) => {
    const newRating = ratings[submissionId];
    if (!newRating) {
      toast.error("Please select a rating.");
      return;
    }

    const tokens = parseInt(newRating) * 10;

    try {
      await updateDoc(doc(db, "TreeSubmissions", submissionId), {
        rating: parseInt(newRating),
        tokensAwarded: tokens,
      });

      toast.success("Award updated successfully!");
      fetchUserSubmissions(selectedUser); // Refresh list
      setEditingAwardId(null);
    } catch (error) {
      console.error("Error updating award:", error);
      toast.error("Failed to update award.");
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
                            width: "40%",
                            height: "50%",
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
                              width: "40%",
                              height: "50%",
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
                  {item.tokensAwarded && (
                    <>
                      {editingAwardId === item.id ? (
                        <>
                          <div className="mb-2">
                            <label
                              htmlFor={`edit-rating-${item.id}`}
                              className="block mb-1"
                            >
                              Edit Rating:
                            </label>
                            <select
                              id={`edit-rating-${item.id}`}
                              value={ratings[item.id] || item.rating}
                              onChange={(e) =>
                                handleRatingChange(item.id, e.target.value)
                              }
                              className="border px-2 py-1 rounded"
                              style={{ padding: "5px" }}
                            >
                              <option value="">Select</option>
                              {[1, 2, 3, 4, 5].map((star) => (
                                <option key={star} value={star}>
                                  {star} Star{star > 1 ? "s" : ""}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div style={{ padding: "5px" }}>
                            <button
                              style={styles.btnApproved}
                              onClick={() => updateAward(item.id)}
                              className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 mr-2"
                            >
                              Update Award
                            </button>
                            <button
                              style={styles.btnRejected}
                              onClick={() => setEditingAwardId(null)}
                              className="text-gray-600 underline text-sm"
                            >
                              Cancel
                            </button>
                          </div>
                        </>
                      ) : (
                        <div
                          className="mb-2 text-green-700 font-semibold"
                          style={{ padding: "5px" }}
                        >
                          🎉 Awarded: {item.tokensAwarded} tokens ({item.rating}
                          ⭐)
                          <button
                            style={styles.btnApproved}
                            onClick={() => {
                              setEditingAwardId(item.id);
                              setRatings((prev) => ({
                                ...prev,
                                [item.id]: item.rating,
                              }));
                            }}
                            className="ml-3 text-sm text-blue-600 underline"
                          >
                            Edit Award
                          </button>
                        </div>
                      )}
                    </>
                  )}

                  {/* Rating & Award Section (only if not already awarded) */}
                  {item.status === "approved" && !item.tokensAwarded && (
                    <>
                      <div className="mb-2">
                        <label
                          htmlFor={`rating-${item.id}`}
                          className="block mb-1"
                        >
                          Rating:
                        </label>
                        <select
                          id={`rating-${item.id}`}
                          value={ratings[item.id] || ""}
                          onChange={(e) =>
                            handleRatingChange(item.id, e.target.value)
                          }
                          className="border px-2 py-1 rounded"
                        >
                          <option value="">Select</option>
                          {[1, 2, 3, 4, 5].map((star) => (
                            <option key={star} value={star}>
                              {star} Star{star > 1 ? "s" : ""}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Award Tokens Button */}
                      <button
                        onClick={() => awardTokens(item.id)}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                      >
                        Award Tokens
                      </button>
                    </>
                  )}

                  <div className="flex gap-2 mt-2">
                    {["approved", "rejected", "pending"].map((statusOption) => {
                      let style =
                        item.status === statusOption
                          ? styles.btnCurrent
                          : statusOption === "approved"
                          ? styles.btnApproved
                          : statusOption === "rejected"
                          ? styles.btnRejected
                          : styles.btnPending;

                      return (
                        <button
                          key={statusOption}
                          onClick={() =>
                            handleStatusUpdate(item.id, statusOption)
                          }
                          style={style}
                        >
                          {statusOption.charAt(0).toUpperCase() +
                            statusOption.slice(1)}
                        </button>
                      );
                    })}
                  </div>
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
    zIndex: 2,
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
    zIndex: 2,
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
  btnApproved: {
    backgroundColor: "#2FC56D",
    color: "white",
    padding: "8px 16px",
    borderRadius: "5px",
    fontWeight: "bold",
    margin: "0 4px",
    cursor: "pointer",
  },
  btnRejected: {
    backgroundColor: "#EC3440",
    color: "white",
    padding: "8px 16px",
    borderRadius: "5px",
    fontWeight: "bold",
    margin: "0 4px",
    cursor: "pointer",
  },
  btnPending: {
    backgroundColor: "#D69E2E",
    color: "white",
    padding: "8px 16px",
    borderRadius: "5px",
    fontWeight: "bold",
    margin: "0 4px",
    cursor: "pointer",
  },
  btnCurrent: {
    backgroundColor: "#2B6CB0",
    color: "white",
    padding: "8px 16px",
    borderRadius: "5px",
    fontWeight: "bold",
    margin: "0 4px",
    cursor: "default",
  },
};

export default AdminDashboard;
