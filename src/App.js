import React, { useState, useEffect, useRef } from "react";
import { BrowserRouter as Router,  Route,  Routes,  Link,  Navigate,  useLocation } from "react-router-dom";
import "./App.css";
import {
  FaBars,
  FaHome,
  FaLeaf,
  FaTrophy,
  FaStore,
  FaUserCircle,
  FaSignInAlt,
  FaShopify,
} from "react-icons/fa";
import Login from "./components/Login";
import Profile from "./components/profile";
import LandingPage from "./components/LandingPage";
import Home from "./components/Home";
import PlantTrees from "./components/PlantTrees";
import Leaderboard from "./components/Leaderboard";
import Activities from "./components/Activities";
import AdminLogin from "./components/AdminLogin";
import UserChat from "./components/UserChat";
import AdminChat from "./components/AdminChat";
import Store from "./components/Store";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import Register from "./components/Register";
import CartPage from "./components/Cartpage";
import { auth } from "./components/firebase";
import Footer from "./components/Footer";
import OrderConfirmation from "./components/OrderConfirmation";
import ScrollToTop from "./components/ScrollToTop";
import AdminDashboard from "./components/AdminDashboard"; 
import Orders from "./components/Orders"; 
import Loader from "./components/Loader";
import FloatingChatButton from "./components/FloatingChatButton";
function App() {
  const [user, setUser] = useState();
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      setUser(user);
    });
  }, []);
  return (
    <Router>
      <ScrollToTop />
      <div className="App">
        {/* <div style={{ padding: 20 }}> */}
        <NavBar user={user} />
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/store" element={<Store />} />
          <Route path="/activities" element={<Activities />} />
          <Route path="/landingpage" element={<LandingPage />} />
          <Route path="/planttrees" element={<PlantTrees />} />
          <Route path="/adminlogin" element={<AdminLogin />} />
          <Route path="/admindashboard" element={<AdminDashboard />} />
          <Route path="/adminchat" element={<AdminChat />} />
          <Route path="/userchat" element={<UserChat />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/orderconfirmation" element={<OrderConfirmation />} />
          <Route path="/orders" element={<Orders />} />
          <Route
            path="/"
            element={user ? <Navigate to="/landingpage" /> : <Login />}
          />
        </Routes>
        <ToastContainer />
        <FloatingChatButton />
        <Footer />
      </div>
    </Router>
  );
}
function NavBar({user}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const menuRef = useRef(null);
  const hamburgerRef = useRef(null);
  const location = useLocation();

  const handleMenuClick = (e, path) => {
    setMenuOpen(false);
    redirectToLogin(e, path);
  };

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

   const redirectToLogin = (e, path) => {
     if (!user && path !== "/login") {
       e.preventDefault();
       return <Navigate to="/login" />;
     }
   };

  return (
    <div style={{ position: "sticky", top: 0, zIndex: 1000 }}>
      <nav style={styles.nav}>
        <Link to="/landingpage" style={styles.logo}>
          <img
            src={require("../src/assets/leaf.png")}
            alt="Logo"
            style={styles.logoImg}
          />
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
              <Link
                to="/activities"
                style={navLinkStyle}
                onClick={(e) => redirectToLogin(e, "/activities")}
              >
                Activities
              </Link>
            </li>
            <li>
              <Link
                to="/leaderboard"
                style={navLinkStyle}
                onClick={(e) => redirectToLogin(e, "/leaderboard")}
              >
                Leaderboard
              </Link>
            </li>
            <li>
              <Link
                to="/store"
                style={navLinkStyle}
                onClick={(e) => redirectToLogin(e, "/store")}
              >
                Store
              </Link>
            </li>
            <li>
              <Link
                to="/orders"
                style={navLinkStyle}
                onClick={(e) => redirectToLogin(e, "/orders")}
              >
                Redeemed
              </Link>
            </li>
            <li>
              <Link
                to="/profile"
                style={navLinkStyle}
                onClick={(e) => redirectToLogin(e, "/profile")}
              >
                Profile
              </Link>
            </li>
            <li>
              <Link
                to="/login"
                style={navLinkStyle}
                onClick={(e) => redirectToLogin(e, "/login")}
              >
                <FaUserCircle style={styles.userIcon} />
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
                onClick={(e) => handleMenuClick(e, "/")}
              >
                Home
              </Link>
            </li>
            <li style={styles.menuItem}>
              <FaLeaf style={styles.icon} />
              <Link
                to="/activities"
                style={navLinkStyle}
                onClick={(e) => handleMenuClick(e, "/activities")}
              >
                Activities
              </Link>
            </li>
            <li style={styles.menuItem}>
              <FaTrophy style={styles.icon} />
              <Link
                to="/leaderboard"
                style={navLinkStyle}
                onClick={(e) => handleMenuClick(e, "/leaderboard")}
              >
                Leaderboard
              </Link>
            </li>
            <li style={styles.menuItem}>
              <FaStore style={styles.icon} />
              <Link
                to="/store"
                style={navLinkStyle}
                onClick={(e) => handleMenuClick(e, "/store")}
              >
                Store
              </Link>
            </li>
            <li style={styles.menuItem}>
              <FaShopify style={styles.icon} />
              <Link
                to="/orders"
                style={navLinkStyle}
                onClick={(e) => handleMenuClick(e, "/orders")}
              >
                Redeemed
              </Link>
            </li>
            <li style={styles.menuItem}>
              <FaUserCircle style={styles.icon} />
              <Link
                to="/profile"
                style={navLinkStyle}
                onClick={(e) => handleMenuClick(e, "/profile")}
              >
                Profile
              </Link>
            </li>
            <li style={styles.menuItem}>
              <FaSignInAlt style={styles.icon} />
              <Link
                to="/login"
                style={navLinkStyle}
                onClick={(e) => handleMenuClick(e, "/login")}
              >
                Sign In
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
    boxShadow: "0 4px 4px rgba(0, 0, 0, 0.1)",
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
  userIcon: {
    color: "white",
    fontSize: "28px",
  },
};

const navLinkStyle = {
  color: "white",
  textDecoration: "none",
  fontSize: "18px",
};


export default App;
