import React from "react";
import { FaBars,  FaHome,  FaLeaf,  FaTrophy,  FaStore,  FaUserCircle, FaSignInAlt} from "react-icons/fa";

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
      <div style={styles.mapContainer}>
        <iframe
          title="Green Credit Location"
          src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d7881.537420731765!2d38.777001000000006!3d8.993418000000005!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2set!4v1744291162372!5m2!1sen!2set"
          width="100%"
          height="250"
          style={{ border: 0, borderRadius: "10px" }}
          allowFullScreen=""
          loading="lazy"
        ></iframe>
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
  mapContainer: {
    maxWidth: "1000px",
    margin: "20px auto",
  },
  bottomBar: {
    textAlign: "center",
    borderTop: "1px solid rgba(255,255,255,0.2)",
    paddingTop: "10px",
    fontSize: "14px",
    marginTop: "20px",
  },
};
