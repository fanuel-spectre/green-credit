import React from "react";
import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div style={styles.container}>
      {/* Hero Section */}
      <section style={styles.heroSection}>
        <div style={styles.overlay}></div>
        <h1 style={styles.heroTitle}>Empower the Future with Green Energy</h1>
        <p style={styles.heroSubtitle}>
          Join the revolution in sustainable living by earning Green Tokens
          through green activities like tree planting and solar installations.
        </p>
        <Link to="/get-started" style={styles.ctaButton}>
          Get Started
        </Link>
      </section>

      {/* How It Works Section */}
      <section style={styles.howItWorks}>
        <h2 style={styles.sectionTitle}>How It Works</h2>
        <div style={styles.grid}>
          <div style={styles.gridItem}>
            <img src="tree-icon.png" alt="Plant Trees" style={styles.icon} />
            <h3>Plant Trees</h3>
            <p>Earn Green Tokens by planting trees and helping the planet.</p>
          </div>
          <div style={styles.gridItem}>
            <img
              src="recycle-icon.png"
              alt="Recycle Waste"
              style={styles.icon}
            />
            <h3>Recycle Waste</h3>
            <p>
              Participate in local recycling efforts to reduce waste and earn
              tokens.
            </p>
          </div>
          <div style={styles.gridItem}>
            <img src="solar-icon.png" alt="Install Solar" style={styles.icon} />
            <h3>Install Solar</h3>
            <p>
              Install solar panels and reduce your carbon footprint while
              earning tokens.
            </p>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section style={styles.benefits}>
        <h2 style={styles.sectionTitle}>Why Choose Green Energy?</h2>
        <div style={styles.benefitItem}>
          <h3>Sustainable Living</h3>
          <p>Contribute to a cleaner and more sustainable world.</p>
        </div>
        <div style={styles.benefitItem}>
          <h3>Earn Green Tokens</h3>
          <p>
            Earn tokens as you contribute to green activities and redeem them
            for rewards.
          </p>
        </div>
        <div style={styles.benefitItem}>
          <h3>Community Impact</h3>
          <p>
            Be a part of a global community working towards a greener future.
          </p>
        </div>
      </section>

      {/* Green Tokens Section */}
      <section style={styles.tokens}>
        <h2 style={styles.sectionTitle}>What Are Green Tokens?</h2>
        <p style={styles.tokensDescription}>
          Green Tokens are digital rewards that you can earn by participating in
          eco-friendly activities such as tree planting, recycling, and more.
          Redeem them for eco-friendly products, donations, or even discounts on
          green services.
        </p>
        <Link to="/store" style={styles.ctaButton}>
          Shop with Green Tokens
        </Link>
      </section>

      {/* Call to Action Section */}
      <section style={styles.ctaSection}>
        <h2 style={styles.ctaTitle}>Join the Green Revolution Today!</h2>
        <p style={styles.ctaSubtitle}>
          Start earning Green Tokens and contribute to a sustainable future.
        </p>
        <Link to="/get-started" style={styles.ctaButton}>
          Get Started
        </Link>
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
