// components/FloatingChatButton.js
import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FaHome
} from "react-icons/fa";

const FloatingChatButton = () => {
  const navigate = useNavigate();

  return (
    <button onClick={() => navigate("/userchat")} style={styles.button}>
      {/* <MessageCircle size={24} color="white" /> */}
      <FaHome style={styles.userIcon} />
    </button>
  );
};

const styles = {
  button: {
    position: "fixed",
    bottom: "30px",
    right: "30px",
    backgroundColor: "#276749",
    border: "none",
    borderRadius: "50%",
    width: "60px",
    height: "60px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
    cursor: "pointer",
    zIndex: 1000,
  },
  icon: {
    color: "white",
    fontSize: "18px",
  },
};

export default FloatingChatButton;
