import { createUserWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { auth, db } from "./firebase";
import { setDoc, doc } from "firebase/firestore";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      const user = auth.currentUser;
      console.log(user);
      if (user) {
        await setDoc(doc(db, "Users", user.uid), {
          email: user.email,
          firstName: fname,
          lastName: lname,
          photo: "",
        });
      }
      console.log("User Registered Successfully!!");
      toast.success("User Registered Successfully!!", {
        position: "top-center",
      });
    } catch (error) {
      console.log(error.message);
      toast.error(error.message, {
        position: "bottom-center",
      });
    }
  };

  return (
    <div style={styles.container}>
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            margin: "20px",
            padding: "20px",
            border: "1px solid #ddd",
            width: "300px",
            marginLeft: "auto",
            marginRight: "auto",
            background: "#fff",
          }}
        >
          <form onSubmit={handleRegister}>
            <h2>🌱 Sign Up</h2>

            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="First name"
                onChange={(e) => setFname(e.target.value)}
                required
                style={{
                  margin: "10px 0",
                  padding: "10px",
                  width: "100%",
                  boxSizing: "border-box",
                  borderRadius: "4px",
                  border: "1px solid #ddd",
                }}
              />
            </div>

            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Last name"
                onChange={(e) => setLname(e.target.value)}
                style={{
                  margin: "10px 0",
                  padding: "10px",
                  width: "100%",
                  boxSizing: "border-box",
                  borderRadius: "4px",
                  border: "1px solid #ddd",
                }}
              />
            </div>

            <div className="mb-3">
              <input
                type="email"
                className="form-control"
                placeholder="Enter Email"
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  margin: "10px 0",
                  padding: "10px",
                  width: "100%",
                  boxSizing: "border-box",
                  borderRadius: "4px",
                  border: "1px solid #ddd",
                }}
              />
            </div>

            <div className="mb-3">
              <input
                type="password"
                className="form-control"
                placeholder="Enter password"
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  margin: "10px 0",
                  padding: "10px",
                  width: "100%",
                  boxSizing: "border-box",
                  borderRadius: "4px",
                  border: "1px solid #ddd",
                }}
              />
            </div>

            <div className="d-grid">
              <button
                type="submit"
                className="btn btn-primary"
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#276749",
                  color: "white",
                  width: "100%",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  marginTop: "10px",
                }}
              >
                Sign Up
              </button>
            </div>
            <p>
              Already Registered{" "}
              <Link to="/login" style={{ color: "#276749" }}>
                Login
              </Link>
            </p>
          </form>
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
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
};
export default Register;
