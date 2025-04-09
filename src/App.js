import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  Navigate,
} from "react-router-dom";
import "./App.css";
import Login from "./components/Login";
import Profile from "./components/profile";
import Home from "./components/Home";
import Leaderboard from "./components/Leaderboard";
import Store from "./components/Store";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import Register from "./components/Register";
import { auth } from "./components/firebase";
function App() {
  const [user, setUser] = useState();
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      setUser(user);
    });
  });
  return (
    <Router>
      <div className="App">
        <div style={{ padding: 20 }}>
          <NavBar />
          <Routes>
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/login" element={<Login />} />
            <Route path="/home" element={<Home />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/store" element={<Store />} />
            <Route
              path="/"
              element={user ? <Navigate to="/home" /> : <Login />}
            />
          </Routes>
          <ToastContainer />
        </div>
      </div>
    </Router>
  );
}

function NavBar() {
  return (
    <nav
      style={{
        backgroundColor: "#276749",
        padding: "10px 20px",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "sticky", // ✅ This makes it stick
        flexWrap: "wrap",
        top: 0, // ✅ Sticks to the top of the viewport
        zIndex: 1000,
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Link
        to="/"
        style={{
          display: "flex",
          alignItems: "center",
          textDecoration: "none",
          color: "white",
        }}
      >
        <img
          src={require("./leaf.png")}
          alt="Logo"
          style={{ height: "40px", marginRight: "10px" }}
        />
        <span style={{ fontSize: "20px", fontWeight: "bold" }}>
          Green Credit
        </span>
      </Link>
      <ul
        style={{
          listStyle: "none",
          margin: 0,
          padding: 0,
          display: "flex",
          flexWrap: "wrap", // allow wrapping
          gap: "20px",
          justifyContent: "center",
        }}
      >
        <li>
          <Link to="/" style={navLinkStyle}>
            Home
          </Link>
        </li>
        <li>
          <Link to="/leaderboard" style={navLinkStyle}>
            Leaderboard
          </Link>
        </li>
        <li>
          <Link to="/store" style={navLinkStyle}>
            Store
          </Link>
        </li>
        <li>
          <Link to="/profile" style={navLinkStyle}>
            Profile
          </Link>
        </li>
      </ul>
    </nav>
  );
}

const navLinkStyle = {
  color: "white",
  textDecoration: "none",
  fontSize: "18px",
};

export default App;
