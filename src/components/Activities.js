import React from "react";
import { Link } from "react-router-dom";

const activities = [
  {
    title: "Plant Trees",
    icon: "🌳",
    description: "Earn tokens by planting and tracking trees.",
    link: "/planttrees",
  },
  {
    title: "Clean Garbage",
    icon: "🧹",
    description: "Report and clean up local waste areas.",
    link: "/garbageevents",
  },
  {
    title: "Install Solar",
    icon: "🔋",
    description: "Install solar panels and reduce grid use.",
    link: "/solarapplications",
  },
  {
    title: "Conserve Water",
    icon: "💧",
    description: "Participate in local water-saving drives.",
    link: "/comingsoon",
  },
  {
    title: "Recycle Waste",
    icon: "♻️",
    description: "Collect and recycle eligible household waste.",
    link: "/comingsoon",
  },
];

export default function Home() {
  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Choose an Activity</h2>
      <div style={styles.grid}>
        {activities.map((activity) => (
          <Link to={activity.link} key={activity.title} style={styles.card}>
            <div style={styles.icon}>{activity.icon}</div>
            <h3>{activity.title}</h3>
            <p style={styles.description}>{activity.description}</p>
            <button style={styles.button}>Start Activity</button>
          </Link>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: 20,
    backgroundColor: "#e6f4ea",
    minHeight: "100vh",
  },
  heading: {
    textAlign: "center",
    color: "#276749",
    marginBottom: "30px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "20px",
  },
  card: {
    background: "white",
    borderRadius: "10px",
    padding: "20px",
    textAlign: "center",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
    textDecoration: "none", // Ensure the card is clickable but no underline on text
  },
  icon: {
    fontSize: "40px",
    marginBottom: "10px",
  },
  description: {
    fontSize: "14px",
    color: "#444",
    marginBottom: "10px",
  },
  button: {
    backgroundColor: "#276749",
    color: "white",
    padding: "10px 15px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};
