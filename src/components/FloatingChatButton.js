import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ImBubbles2 } from "react-icons/im";
import { auth } from "./firebase";

const FloatingChatButton = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsAuthenticated(!!user); // true if logged in, false if not
    });

    return () => unsubscribe();
  }, []);

  const handleClick = () => {
    if (isAuthenticated) {
      navigate("/userchat");
    } else {
      navigate("/login"); // Change this to your actual login route if different
    }
  };

  return (
    <button onClick={handleClick} style={styles.button}>
      <ImBubbles2 style={styles.icon} />
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
    fontSize: "24px",
  },
};

export default FloatingChatButton;
