import React, { useState, useEffect, useRef } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  Navigate,
  useLocation
} from "react-router-dom";
import "./App.css";
import {
  FaBars,
  FaHome,
  FaLeaf,
  FaTrophy,
  FaStore,
  FaUserCircle,
} from "react-icons/fa";
import Login from "./components/Login";
import Profile from "./components/profile";
import LandingPage from "./components/LandingPage";
import Home from "./components/Home";
import Leaderboard from "./components/Leaderboard";
import Activities from "./components/Activities";
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
        {/* <div style={{ padding: 20 }}> */}
        <NavBar />
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/store" element={<Store />} />
          <Route path="/activities" element={<Activities />} />
          <Route path="/landingpage" element={<LandingPage />} />
          <Route
            path="/"
            element={user ? <Navigate to="/home" /> : <Login />}
          />
        </Routes>
        <ToastContainer />
      </div>
    </Router>
  );
}
function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const menuRef = useRef(null);
  const hamburgerRef = useRef(null);
  const location = useLocation();

  // Close menu when route changes
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        hamburgerRef.current &&
        !hamburgerRef.current.contains(e.target) // <-- ignore hamburger
      ) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLinkClick = () => {
    setMenuOpen(false);
  };

  return (
    <div style={{ position: "sticky", top: 0, zIndex: 1000 }}>
      <nav style={styles.nav}>
        <Link to="/landingpage" style={styles.logo}>
          <img src={require("../src/assets/leaf.png")} alt="Logo" style={styles.logoImg} />
          <span style={styles.logoText}>Green Credit</span>
        </Link>

        {isMobile ? (
          <div
            ref={hamburgerRef}
            onClick={() => setMenuOpen((prev) => !prev)}
            style={styles.hamburger}
          >
            <FaBars size={24} />
          </div>
        ) : (
          <ul style={styles.navLinks}>
            <li>
              <Link to="/" style={navLinkStyle}>
                Home
              </Link>
            </li>
            <li>
              <Link to="/activities" style={navLinkStyle}>
                Activities
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
        )}
      </nav>

      {isMobile && (
        <div
          ref={menuRef}
          style={{
            ...styles.dropdown,
            maxHeight: menuOpen ? "300px" : "0px",
            padding: menuOpen ? "10px 20px" : "0 20px",
          }}
        >
          <ul style={styles.menuList}>
            <li style={styles.menuItem}>
              <FaHome style={styles.icon} />
              <Link
                to="/"
                style={navLinkStyle}
                onClick={() => setMenuOpen(false)}
              >
                Home
              </Link>
            </li>
            <li style={styles.menuItem}>
              <FaLeaf style={styles.icon} />
              <Link
                to="/activities"
                style={navLinkStyle}
                onClick={() => setMenuOpen(false)}
              >
                Activities
              </Link>
            </li>
            <li style={styles.menuItem}>
              <FaTrophy style={styles.icon} />
              <Link
                to="/leaderboard"
                style={navLinkStyle}
                onClick={() => setMenuOpen(false)}
              >
                Leaderboard
              </Link>
            </li>
            <li style={styles.menuItem}>
              <FaStore style={styles.icon} />
              <Link
                to="/store"
                style={navLinkStyle}
                onClick={() => setMenuOpen(false)}
              >
                Store
              </Link>
            </li>
            <li style={styles.menuItem}>
              <FaUserCircle style={styles.icon} />
              <Link
                to="/profile"
                style={navLinkStyle}
                onClick={() => setMenuOpen(false)}
              >
                Profile
              </Link>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}

const styles = {
  nav: {
    backgroundColor: "#276749",
    padding: "10px 20px",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  },
  logo: {
    display: "flex",
    alignItems: "center",
    textDecoration: "none",
    color: "white",
  },
  logoImg: {
    height: "40px",
    marginRight: "10px",
  },
  logoText: {
    fontSize: "20px",
    fontWeight: "bold",
  },
  navLinks: {
    display: "flex",
    listStyle: "none",
    gap: "20px",
    margin: 0,
    padding: 0,
  },
  hamburger: {
    cursor: "pointer",
    color: "white",
  },
  dropdown: {
    backgroundColor: "#276749",
    overflow: "hidden",
    width: "100%",
    transition: "all 0.3s ease",
  },
  dropdownList: {
    listStyle: "none",
    padding: 0,
    margin: 0,
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  dropdownMenu: {
    position: "absolute",
    top: "100%",
    left: 0,
    width: "100%",
    backgroundColor: "#276749",
    padding: "10px 0",
    zIndex: 999,
  },
  menuList: {
    listStyle: "none",
    padding: 0,
    margin: 0,
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start", // 👈 left align
  },
  menuItem: {
    width: "100%",
    padding: "10px 20px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  icon: {
    color: "white",
    fontSize: "18px",
  },
};

const navLinkStyle = {
  color: "white",
  textDecoration: "none",
  fontSize: "18px",
};


export default App;
