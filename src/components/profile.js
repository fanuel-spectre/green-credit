import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "./firebase";
import { getAuth } from "firebase/auth";
import userImg from "../assets/user.png";
import { doc, getDoc, query, where, collection, getDocs } from "firebase/firestore";
import Loader from "./Loader";

function Profile() {
  const [userDetails, setUserDetails] = useState(null);
  const [totalTokens, setTotalTokens] = useState(0);
  const [userTokens, setUserTokens] = useState(0);
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const auth = getAuth();
  const cuser = auth.currentUser;

  const fetchUserData = async () => {
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const docRef = doc(db, "Users", user.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const data = docSnap.data();
            setUserDetails(data);

            // ✅ Get totalTokens directly from user document
            setTotalTokens(data.totalTokens || 0);
          }
        } catch (err) {
          console.error("Error fetching user data:", err);
        }
      } else {
        console.log("User is not logged in");
        setUserDetails(null);
      }
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  async function handleLogout() {
    try {
      await auth.signOut();
      navigate("/login");
      console.log("User logged out successfully!");
    } catch (error) {
      console.error("Error logging out:", error.message);
    }
  }

    useEffect(() => {
      if (!cuser) return;
  
      const fetchRewards = async () => {
        try {
          // Fetch TreeSubmissions
          const treesQ = query(
            collection(db, "TreeSubmissions"),
            where("userId", "==", cuser.uid),
            where("status", "==", "approved")
          );
          const treesSnapshot = await getDocs(treesQ);
          const treeRewards = treesSnapshot.docs.map((doc) => ({
            id: doc.id,
            type: "Tree Planting",
            tokens: doc.data().tokensAwarded,
            date: doc.data().createdAt?.toDate(),
          }));
  
          // Fetch CleanupParticipation
          const cleanupQ = query(
            collection(db, "CleanupParticipation"),
            where("userId", "==", cuser.uid),
            where("status", "==", "approved")
          );
          const cleanupSnapshot = await getDocs(cleanupQ);
          const cleanupRewards = cleanupSnapshot.docs.map((doc) => ({
            id: doc.id,
            type: "Community Cleanup",
            tokens: doc.data().rewardTokens,
            date: doc.data().createdAt?.toDate(),
          }));
  
          // Fetch SolarInstallationRewards
          const solarQ = query(
            collection(db, "SolarInstallationRewards"),
            where("userId", "==", cuser.uid)
          );
          const solarSnapshot = await getDocs(solarQ);
          const solarRewards = solarSnapshot.docs.map((doc) => ({
            id: doc.id,
            type: "Solar Installation",
            tokens: doc.data().rewardTokens,
            date: doc.data().createdAt?.toDate(),
          }));
  
          // Combine all rewards
          const allRewards = [...treeRewards, ...cleanupRewards, ...solarRewards];
          allRewards.sort((a, b) => b.date - a.date); // Sort newest first
          setRewards(allRewards);
  
          // Calculate total tokens
          const total = allRewards.reduce(
            (acc, curr) => acc + (curr.tokens || 0),
            0
          );
          setUserTokens(total);
        } catch (error) {
          console.error("Error fetching rewards:", error);
        } finally {
          setLoading(false);
        }
      };
  
      fetchRewards();
    }, [cuser]);

  if (loading) return <Loader />;

  return (
    <div style={styles.container}>
      <div style={{ textAlign: "center" }}>
        <div style={styles.profileCard}>
          <div>
            {userDetails ? (
              <>
                <div style={styles.userInfo}>
                  <img
                    // src={userDetails.photo}
                    src={userImg}
                    alt={`${userDetails.firstName}'s profile`}
                    width="70px"
                    height="70px"
                    style={styles.profileImage}
                  />
                  <div style={styles.textContainer}>
                    <p style={styles.infoText}>
                      <strong>Full Name: </strong>
                      <span style={{ color: "#2F855A", fontWeight: "bold" }}>
                        {userDetails.firstName} {userDetails.lastName}
                      </span>
                    </p>
                    <p style={styles.infoText}>
                      <strong>Email: </strong>
                      <span style={{ color: "#2F855A", fontWeight: "bold" }}>
                        {userDetails.email}
                      </span>
                    </p>
                  </div>
                  <button
                    className="btn btn-primary"
                    onClick={handleLogout}
                    style={styles.logoutButton}
                  >
                    Logout
                  </button>
                </div>

                <hr style={{ margin: "20px 0", border: "1px solid #ccc" }} />

                <div style={styles.userInfo}>
                  <img
                    src={require("../assets/tokenn.png")}
                    alt="Token Icon"
                    width="40px"
                    height="40px"
                    style={styles.profileImage}
                  />
                  <div style={styles.textContainer}>
                    <p style={styles.infoText}>
                      <strong>Total Tokens Earned: </strong>
                      <span style={{ color: "#2F855A", fontWeight: "bold" }}>
                        {userTokens}
                      </span>
                    </p>
                    <p style={styles.infoText}>
                      <strong>Total Redeemed Tokens: </strong>
                      <span style={{ color: "#2F855A", fontWeight: "bold" }}>
                        {userTokens - totalTokens}
                      </span>
                    </p>
                    <p style={styles.infoText}>
                      <strong>Total Available Tokens: </strong>
                      <span style={{ color: "#2F855A", fontWeight: "bold" }}>
                        {totalTokens}
                      </span>
                    </p>
                  </div>
                  <button
                    onClick={() => navigate("/store")}
                    className="btn btn-primary"
                    style={styles.redeemButton}
                  >
                    Redeem Tokens
                  </button>
                </div>
              </>
            ) : (
              <p>Loading...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#e6f4ea",
    display: "flex",
    flexDirection: "column",
    padding: 20,
  },
  profileCard: {
    margin: "20px",
    padding: "20px",
    border: "1px solid #ddd",
    width: "85%",
    justifyContent: "center",
    alignItems: "center",
    maxWidth: "500px", // Ensures a max width to avoid overflow on large screens
    marginLeft: "auto",
    marginRight: "auto",
    background: "#fff",
    borderRadius: "8px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    overflow: "hidden", // Prevents overflow of the card content
  },
  userInfo: {
    display: "flex",
    alignItems: "center",
    justifyContent: "left",
    gap: "20px",
    marginBottom: "10px",
    flexDirection: "row",
    flexWrap: "wrap", // Allows wrapping on smaller screens
  },
  profileImage: {
    borderRadius: "50%",
    padding: 10,
  },
  textContainer: {
    textAlign: "left",
  },
  infoText: {
    margin: "5px 0",
    fontSize: "16px",
  },
  logoutButton: {
    padding: "10px 20px",
    backgroundColor: "#276749",
    border: "none",
    borderRadius: "5px",
    color: "white",
    marginTop: "10px",
  },
  redeemButton: {
    padding: "10px 20px",
    backgroundColor: "#276749",
    border: "none",
    borderRadius: "5px",
    color: "white",
    marginTop: "10px",
  },

  // Responsive Design
  "@media (max-width: 768px)": {
    container: {
      padding: "10px",
    },
    profileCard: {
      width: "90%",
      padding: "15px",
    },
    userInfo: {
      flexDirection: "column",
      textAlign: "center",
      gap: "10px",
    },
    profileImage: {
      width: "70px",
      height: "70px",
    },
    logoutButton: {
      width: "100%",
      padding: "12px 0",
    },
    redeemButton: {
      width: "100%",
      padding: "12px 0",
    },
  },

  "@media (max-width: 480px)": {
    profileCard: {
      width: "95%",
      padding: "10px",
    },
    userInfo: {
      flexDirection: "column",
      alignItems: "center",
      textAlign: "center",
    },
    profileImage: {
      width: "60px",
      height: "60px",
    },
    infoText: {
      fontSize: "14px",
    },
    logoutButton: {
      padding: "10px 0",
    },
    redeemButton: {
      padding: "10px 0",
    },
  },
};

export default Profile;
