import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";

function Profile() {
  const [userDetails, setUserDetails] = useState(null);
  const navigate = useNavigate();

  const fetchUserData = async () => {
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const docRef = doc(db, "Users", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setUserDetails(docSnap.data());
            console.log(docSnap.data());
          }
        } catch (err) {
          console.error("Error fetching user data:", err);
        }
      } else {
        console.log("User is not logged in");
        setUserDetails(null);
      }
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

  return (
    <div style={styles.container}>
      <div style={{ textAlign: "center" }}>
        <div style={styles.profileCard}>
          <div>
            {userDetails ? (
              <>
                <div style={styles.userInfo}>
                  <img
                    src={userDetails.photo}
                    alt={`${userDetails.firstName}'s profile`}
                    width="80px"
                    height="80px"
                    style={styles.profileImage}
                  />
                  <div style={styles.textContainer}>
                    <p style={styles.infoText}>
                      <strong>First Name: </strong>
                      {userDetails.firstName}
                    </p>
                    <p style={styles.infoText}>
                      <strong>Email: </strong>
                      {userDetails.email}
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
                    src={require("../tokenn.png")}
                    alt={`${userDetails.firstName}'s profile`}
                    width="40px"
                    height="40px"
                    style={styles.profileImage}
                  />
                  <div style={styles.textContainer}>
                    <p style={styles.infoText}>
                      <strong>Token Amount: </strong>
                      {userDetails.firstName}
                    </p>
                    <p style={styles.infoText}>
                      <strong>Redeem: </strong>
                      {userDetails.email}
                    </p>
                  </div>
                  <button
                    className="btn btn-primary"
                    style={styles.redeemButton}
                  >
                    Redeem Amount
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
