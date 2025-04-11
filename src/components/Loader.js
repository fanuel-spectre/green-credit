import React from "react";

export default function Loader() {
  return (
    <div style={styles.loaderContainer}>
      <div style={styles.spinner}></div>
    </div>
  );
}

const styles = {
  loaderContainer: {
    height: "80vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  spinner: {
    width: "60px",
    height: "60px",
    border: "6px solid #e0e0e0",
    borderTop: "6px solid #276749",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
};
