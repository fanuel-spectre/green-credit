import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { db } from "./firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

function CartPage({ setCart, userTokens }) {
  const location = useLocation();
  const [deliveryOption, setDeliveryOption] = useState(false);
  const [deliveryCost, setDeliveryCost] = useState(0);
  const [locationInput, setLocationInput] = useState(""); // 👈 new
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 600);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 600);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

const handleCheckout = async () => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    alert("You must be logged in to place an order.");
    return;
  }

  if (deliveryOption && !locationInput.trim()) {
    alert("Please enter a delivery location.");
    return;
  }

  const orderData = {
    userId: user.uid,
    cart,
    deliveryOption,
    deliveryLocation: deliveryOption ? locationInput : null,
    total: calculateTotal(),
    createdAt: serverTimestamp(),
  };

  try {
    await addDoc(collection(db, "orders"), orderData);
    setLocalCart([]);
    localStorage.removeItem("cart");
    setLocationInput("");
    setDeliveryOption(false);
    setDeliveryCost(0);
    navigate("/orderconfirmation"); // 🚀 Redirect after success
  } catch (error) {
    console.error("Error saving order:", error);
    alert("Failed to place order. Try again.");
  }
};

  const fetchCurrentLocation = async () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await response.json();
          const address = data.display_name || `${latitude}, ${longitude}`;
          setLocationInput(address);
        } catch (error) {
          console.error("Error fetching address:", error);
          setLocationInput(`${latitude}, ${longitude}`);
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        alert("Unable to fetch location. Please allow permission.");
      }
    );
  };


  return (
    <div style={styles.cartPage}>
      <h2 style={styles.heading}>🛒 Your Cart</h2>

      {cart.length === 0 ? (
        <p style={styles.empty}>Your cart is empty.</p>
      ) : (
        cart.map((item) => (
          <div
            key={item.id}
            style={{
              ...styles.card,
              flexDirection: isMobile ? "column" : "row",
              textAlign: isMobile ? "center" : "left",
            }}
          >
            <img
              src={item.image}
              alt={item.name}
              style={{
                ...styles.image,
                margin: isMobile ? "0 auto 10px" : "0 20px 0 0",
              }}
            />
            <div style={styles.details}>
              <h3>{item.name}</h3>
              <p>{item.description}</p>
              <p>
                <strong>Cost:</strong> {item.cost} Tokens
              </p>
              <p>
                <strong>Quantity:</strong> {item.quantity}
              </p>
              <div
                style={{
                  ...styles.buttonGroup,
                  justifyContent: isMobile ? "center" : "flex-end",
                  marginLeft: isMobile ? "0" : "260px",
                }}
              >
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

      {deliveryOption && (
        <>
          <input
            style={styles.locationInput}
            type="text"
            placeholder="Enter delivery location..."
            value={locationInput}
            onChange={(e) => setLocationInput(e.target.value)}
          />
          <button style={styles.locationBtn} onClick={fetchCurrentLocation}>
            📍 Use Current Location
          </button>
        </>
      )}

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
  },
  details: {
    flex: 1,
  },
  buttonGroup: {
    marginTop: "10px",
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
  },
  delivery: {
    marginTop: "30px",
    marginBottom: "10px",
  },
  locationInput: {
    width: "100%",
    padding: "10px",
    marginBottom: "15px",
    borderRadius: "6px",
    border: "1px solid #ccc",
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
  locationBtn: {
    padding: "8px 12px",
    marginTop: "8px",
    backgroundColor: "#2196F3",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default CartPage;
