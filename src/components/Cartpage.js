import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

function CartPage({ setCart, userTokens }) {
  const location = useLocation();
  const [deliveryOption, setDeliveryOption] = useState(false);
  const [deliveryCost, setDeliveryCost] = useState(0);

  // Load cart from localStorage or use location.state
  const [cart, setLocalCart] = useState(() => {
    const stored = localStorage.getItem("cart");
    if (stored) return JSON.parse(stored);
    const initialCart =
      location.state?.cart?.map((item) => ({ ...item, quantity: 1 })) || [];
    localStorage.setItem("cart", JSON.stringify(initialCart));
    return initialCart;
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const handleQuantityChange = (id, action) => {
    setLocalCart((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity:
                action === "increase"
                  ? item.quantity + 1
                  : Math.max(item.quantity - 1, 1),
            }
          : item
      )
    );
  };

  const handleRemoveItem = (id) => {
    setLocalCart((prev) => prev.filter((item) => item.id !== id));
  };

  const handleDeliveryChange = () => {
    setDeliveryOption(!deliveryOption);
    setDeliveryCost(!deliveryOption ? 10 : 0);
  };

  const calculateTotal = () => {
    let total = cart.reduce((sum, item) => sum + item.cost * item.quantity, 0);
    return total + (deliveryOption ? deliveryCost : 0);
  };

  const handleCheckout = () => {
    alert("Proceeding to checkout!");
    setLocalCart([]);
    localStorage.removeItem("cart");
  };

  return (
    <div style={styles.cartPage}>
      <h2 style={styles.heading}>🛒 Your Shopping Cart</h2>

      {cart.length === 0 ? (
        <p style={styles.empty}>Your cart is empty.</p>
      ) : (
        cart.map((item) => (
          <div key={item.id} style={styles.card}>
            <img src={item.image} alt={item.name} style={styles.image} />
            <div style={styles.details}>
              <h3>{item.name}</h3>
              <p>{item.description}</p>
              <p>
                <strong>Cost:</strong> {item.cost} Tokens
              </p>
              <p>
                <strong>Quantity:</strong> {item.quantity}
              </p>
              <div style={styles.buttonGroup}>
                <button
                  onClick={() => handleQuantityChange(item.id, "increase")}
                >
                  +
                </button>
                <button
                  onClick={() => handleQuantityChange(item.id, "decrease")}
                >
                  -
                </button>
                <button onClick={() => handleRemoveItem(item.id)}>
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))
      )}

      <div style={styles.delivery}>
        <label>
          <input
            type="checkbox"
            checked={deliveryOption}
            onChange={handleDeliveryChange}
          />
          <span style={{ marginLeft: 8 }}>
            Request Delivery (+{deliveryCost} tokens)
          </span>
        </label>
      </div>

      <h3 style={styles.total}>Total: {calculateTotal()} Tokens</h3>

      <button
        style={styles.checkoutBtn}
        disabled={userTokens < calculateTotal()}
        onClick={handleCheckout}
      >
        Checkout
      </button>
    </div>
  );
}

const styles = {
  cartPage: {
    padding: "20px",
    maxWidth: "800px",
    margin: "0 auto",
  },
  heading: {
    textAlign: "center",
    marginBottom: "20px",
  },
  empty: {
    textAlign: "center",
    color: "#888",
  },
  card: {
    display: "flex",
    backgroundColor: "#fff",
    borderRadius: "10px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    padding: "15px",
    marginBottom: "20px",
    alignItems: "center",
  },
  image: {
    width: "100px",
    height: "100px",
    borderRadius: "8px",
    objectFit: "cover",
    marginRight: "20px",
  },
  details: {
    flex: 1,
  },
  buttonGroup: {
    marginTop: "10px",
    display: "flex",
    gap: "10px",
    marginLeft: "260px",
  },
  delivery: {
    marginTop: "30px",
    marginBottom: "10px",
  },
  total: {
    fontSize: "20px",
    fontWeight: "bold",
  },
  checkoutBtn: {
    padding: "10px 20px",
    fontSize: "16px",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    marginTop: "10px",
  },
};

export default CartPage;
