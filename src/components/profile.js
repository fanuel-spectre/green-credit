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
        <div
          style={{
            margin: "20px",
            padding: "20px",
            border: "1px solid #ddd",
            width: "500px",
            marginLeft: "auto",
            marginRight: "auto",
            background: "#fff",
          }}
        >
          <div>
            {userDetails ? (
              <>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "left",
                    gap: "20px",
                    marginBottom: "10px",
                  }}
                >
                  <img
                    src={userDetails.photo}
                    alt={`${userDetails.firstName}'s profile`}
                    width={"80px"}
                    height={"80px"}
                    style={{ borderRadius: "50%", padding: 10 }}
                  />
                  <div style={{ textAlign: "left" }}>
                    <p style={styles.infoText}>
                      <strong>First Name: </strong>
                      {userDetails.firstName}
                    </p>
                    <p style={styles.infoText}>
                      <strong>Email: </strong>
                      {userDetails.email}
                    </p>
                    {/* <p>Last Name: {userDetails.lastName}</p> */}
                  </div>
                  <button
                    className="btn btn-primary"
                    onClick={handleLogout}
                    style={{
                      padding: "10px 20px",
                      backgroundColor: "#276749",
                      border: "none",
                      borderRadius: "5px",
                      color: "white",
                      marginTop: "10px",
                    }}
                  >
                    Logout
                  </button>
                </div>
                <hr style={{ margin: "20px 0", border: "1px solid #ccc" }} />
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "left",
                    gap: "20px",
                    marginBottom: "10px",
                  }}
                >
                  <img
                    src={require("../tokenn.png")}
                    alt={`${userDetails.firstName}'s profile`}
                    width={"40px"}
                    height={"40px"}
                    style={{ borderRadius: "50%", padding: 10 }}
                  />
                  <div style={{ textAlign: "left" }}>
                    <p style={styles.infoText}>
                      <strong>Token Amount: </strong>
                      {userDetails.firstName}
                    </p>
                    <p style={styles.infoText}>
                      <strong>Reedem: </strong>
                      {userDetails.email}
                    </p>
                    {/* <p>Last Name: {userDetails.lastName}</p> */}
                  </div>
                  <button
                    className="btn btn-primary"
                    //onClick={handleLogout}
                    style={{
                      padding: "10px 20px",
                      backgroundColor: "#276749",
                      border: "none",
                      borderRadius: "5px",
                      color: "white",
                      marginTop: "10px",
                    }}
                  >
                    Reedem Amount
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
    padding: 20,
  },
  infoText: {
    margin: "5px 0",
    fontSize: "16px",
  },
};
export default Profile;
