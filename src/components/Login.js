import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { auth } from "./firebase";
import { toast } from "react-toastify";
import SignInwithGoogle from "./signInWithGoogle";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log("User logged in Successfully");
      window.location.href = "/activities";
      toast.success("User logged in Successfully", {
        position: "top-center",
      });
    } catch (error) {
      console.log(error.message);

      toast.error(error.message, {
        position: "bottom-center",
      });
    }
  };
  // const handleLogin = () => {
  //   if (email && password) {
  //     alert('Logged in successfully');
  //     onLogin();
  //   } else {
  //     alert('Please fill in both fields');
  //   }
  // };

  return (
    <form onSubmit={handleSubmit}>
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
            <h2>🌱 Login</h2>
            <input
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                margin: "10px 0",
                padding: "10px",
                width: "100%",
                boxSizing: "border-box",
                borderRadius: "4px",
                border: "1px solid #ddd",
              }}
            />
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                margin: "10px 0",
                padding: "10px",
                width: "100%",
                boxSizing: "border-box",
                borderRadius: "4px",
                border: "1px solid #ddd",
              }}
            />
            <button
              type="submit"
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
              Login
            </button>
            <p>
              New User{" "}
              <Link to="/register" style={{ color: "#276749" }}>
                Register Here
              </Link>
            </p>
            <SignInwithGoogle />
          </div>
        </div>
      </div>
    </form>
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

export default Login;
