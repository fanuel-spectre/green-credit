import React from "react";
import { Link } from "react-router-dom";

function OrderConfirmation() {
  return (
    <div style={styles.container}>
      <h2>✅ Order Confirmed!</h2>
      <p>
        Thank you for your purchase. Your order has been successfully placed.
      </p>
      <Link to="/orders" style={styles.button}>
        View Order History
      </Link>
      <Link to="/store" style={styles.button}>
        Back to Store
      </Link>
    </div>
  );
}

const styles = {
  container: {
    padding: "40px",
    textAlign: "center",
  },
  button: {
    display: "inline-block",
    margin: "15px",
    padding: "10px 20px",
    backgroundColor: "#4CAF50",
    color: "white",
    textDecoration: "none",
    borderRadius: "5px",
  },
};

export default OrderConfirmation;
