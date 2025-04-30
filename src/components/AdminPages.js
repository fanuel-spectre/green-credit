import React from "react";
import { Link } from "react-router-dom";
import { auth } from "./firebase"; // Make sure this path is correct
import ecoImage from "../assets/plant.png";
import recycleImg from "../assets/recycle.png";
import bulbImg from "../assets/green_bulb.png";
import waterImg from "../assets/water.png"
import chatImg from "../assets/chat.png"
import { BsJustify } from "react-icons/bs";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const user = auth.currentUser;
  const navigate = useNavigate();

  const getStartedPath = user ? "/activities" : "/login"; // Adjust to your flow

  return (
    <div style={styles.container}>
      <section style={styles.howItWorks}>
        <h2 style={styles.sectionTitle}>Approvals</h2>
        <div style={styles.grid}>
          <div onClick={() => navigate("/admindashboard")} style={styles.gridItem}>
            <img src={ecoImage} alt="Plant Trees" style={styles.icon} />
            <h3>Planted Trees</h3>
            <p>Approve Planted Tree Submissions</p>
          </div>
          <div onClick={() => navigate("/cleanupdashboard")} style={styles.gridItem}>
            <img src={recycleImg} alt="Recycle Waste" style={styles.icon} />
            <h3>Community Cleanups</h3>
            <p>Approve Users whom participated on The Community Cleanup</p>
          </div>
          <div onClick={() => navigate("/solarapproval")} style={styles.gridItem}>
            <img src={bulbImg} alt="Install Solar" style={styles.icon} />
            <h3>Solar Installations</h3>
            <p>Approve Customers who Installed Solars for users.</p>
          </div>
          <div onClick={() => navigate("/adminchat")} style={styles.gridItem}>
            <img src={chatImg} alt="Install Solar" style={styles.icon} />
            <h3>Respond to Users</h3>
            <p>Assist Users with answering questions.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

const styles = {
  container: {
    fontFamily: "Arial, sans-serif",
    color: "#333",
    margin: 0,
    padding: 0,
    backgroundColor: "#f4f7f6",
  },
  heroSection: {
    position: "relative",
    textAlign: "center",
    padding: "80px 20px",
    backgroundImage:
      "url('https://t3.ftcdn.net/jpg/04/36/11/46/240_F_436114654_YZRH2Luax9YouhnCiZ9IlmAcxGx9t2pI.jpg')", // Set the background image URL here
    backgroundSize: "cover", // Ensure it covers the entire section
    backgroundPosition: "center", // Center the background image
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(39, 103, 73, 0.7)", // Green color with opacity
    zIndex: 1,
  },
  heroTitle: {
    fontSize: "48px",
    fontWeight: "bold",
    marginBottom: "20px",
    zIndex: 2, // Ensure text is above the overlay
    position: "relative",
  },
  heroSubtitle: {
    fontSize: "18px",
    marginBottom: "40px",
    zIndex: 2, // Ensure text is above the overlay
    position: "relative",
  },
  ctaButton: {
    backgroundColor: "#f0a500",
    color: "white",
    padding: "15px 30px",
    border: "none",
    borderRadius: "5px",
    fontSize: "18px",
    textDecoration: "none",
    zIndex: 2, // Ensure button is above the overlay
    position: "relative",
  },
  howItWorks: {
    padding: "40px 20px",
    backgroundColor: "#fff",
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: "36px",
    fontWeight: "bold",
    marginBottom: "30px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "30px",
  },
  gridItem: {
    backgroundColor: "#f9f9f9",
    padding: "20px",
    borderRadius: "8px",
    textAlign: "center",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  },
  icon: {
    fontSize: "50px",
    marginBottom: "15px",
    height: "100px",
  },
  benefits: {
    backgroundColor: "#e6f4ea",
    padding: "40px 20px",
    textAlign: "center",
  },
  benefitItem: {
    marginBottom: "20px",
  },
  tokens: {
    padding: "40px 20px",
    backgroundColor: "#fff",
    textAlign: "center",
  },
  tokensDescription: {
    fontSize: "18px",
    marginBottom: "30px",
  },
  ctaSection: {
    backgroundColor: "#276749",
    color: "white",
    padding: "80px 20px",
    textAlign: "center",
  },
  ctaTitle: {
    fontSize: "40px",
    fontWeight: "bold",
    marginBottom: "20px",
  },
  ctaSubtitle: {
    fontSize: "18px",
    marginBottom: "40px",
  },
};
