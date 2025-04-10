import React from "react";

export default function Footer() {
  return (
    <footer style={styles.footer}>
      <hr style={{ margin: "20px 0", border: "1px solid #ccc" }} />
      <div style={styles.content}>
        <div style={styles.section}>
          <h3 style={styles.title}>Green Credit</h3>
          <p>Empowering communities through green action.</p>
        </div>
        <div style={styles.section}>
          <h4 style={styles.subtitle}>Contact Us</h4>
          <p>Email: support@greencredit.org</p>
          <p>Phone: +123 456 7890</p>
        </div>
        <div style={styles.section}>
          <h4 style={styles.subtitle}>Address</h4>
          <p>Green Credit HQ</p>
          <p>123 Eco Street, Solarville</p>
          <p>Clean Earth, Planet 0001 🌍</p>
        </div>
      </div>

      <div style={styles.bottomBar}>
        <p>
          &copy; {new Date().getFullYear()} Green Credit. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

const styles = {
  footer: {
    backgroundColor: "#276749",
    color: "#fff",
    padding: "40px 20px 10px",
  },
  content: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-between",
    maxWidth: "1000px",
    margin: "0 auto",
  },
  section: {
    flex: "1 1 250px",
    marginBottom: "20px",
  },
  title: {
    fontSize: "24px",
    marginBottom: "10px",
  },
  subtitle: {
    fontSize: "18px",
    marginBottom: "10px",
  },
  bottomBar: {
    textAlign: "center",
    borderTop: "1px solid rgba(255,255,255,0.2)",
    paddingTop: "10px",
    fontSize: "14px",
    marginTop: "20px",
  },
};
