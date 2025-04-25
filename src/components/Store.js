// Store.js
import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { auth, db } from "./firebase";
import { toast } from "react-toastify";
import Loader from "./Loader";
import { Link } from "react-router-dom";

function Store() {
  const [products, setProducts] = useState([]);
  const [user, setUser] = useState(null);
  const [userTokens, setUserTokens] = useState(0);
  const [totalTokens, setTotalTokens] = useState(0);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState(() => {
    const stored = localStorage.getItem("cart");
    return stored ? JSON.parse(stored) : [];
  });

  const [cartTotal, setCartTotal] = useState(0);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
    const total = cart.reduce(
      (sum, item) => sum + item.cost * item.quantity,
      0
    );
    setCartTotal(total);
  }, [cart]);

  const fetchProducts = async () => {
    const snapshot = await getDocs(collection(db, "Products"));
    const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setProducts(list);
  };

  const fetchTokenAwards = async (uid) => {
    const q = query(
      collection(db, "TreeSubmissions"),
      where("userId", "==", uid),
      where("status", "==", "approved")
    );
    const snapshot = await getDocs(q);
    let total = 0;
    snapshot.forEach((doc) => {
      const data = doc.data();
      total += Number(data.tokensAwarded || 0);
    });
    setUserTokens(total);
    setTotalTokens(total);
  };

  const fetchUser = () => {
    return new Promise((resolve) => {
      auth.onAuthStateChanged(async (currentUser) => {
        if (currentUser) {
          setUser(currentUser);
          await fetchTokenAwards(currentUser.uid);
        }
        resolve();
      });
    });
  };

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([fetchProducts(), fetchUser()]);
      setLoading(false);
    };
    loadData();
  }, []);

  const handleAddToCart = (product) => {
    const exists = cart.find((item) => item.id === product.id);
    const totalIfAdded = cartTotal + product.cost;

    if (totalIfAdded > userTokens) {
      return toast.warning("Not enough tokens to add this item.");
    }

    if (exists) {
      const updated = cart.map((item) =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      );
      setCart(updated);
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
    toast.info(`${product.name} added to cart.`);
  };

  if (loading) return <Loader />;

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Redeem Your Tokens</h2>
      <p style={styles.tokenDisplay}>
        Your Tokens: <strong>{userTokens}</strong> / Earned:{" "}
        <strong>{totalTokens}</strong>
      </p>

      <div style={styles.grid}>
        {products.map((product) => (
          <div key={product.id} style={styles.card}>
            {product.image && (
              <img
                src={product.image}
                alt={product.name}
                style={styles.image}
              />
            )}
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <p>
              <strong>{product.cost} Tokens</strong>
            </p>
            <button
              style={styles.button}
              onClick={() => handleAddToCart(product)}
              disabled={cartTotal + product.cost > userTokens}
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>

      {cart.length > 0 && <FloatingCartButton cart={cart} />}
    </div>
  );
}

function FloatingCartButton({ cart }) {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <div>
      <div onClick={() => setShowPopup(true)} style={styles.floatingButton}>
        <span style={styles.cartCount}>{cart.length}</span>🛒
      </div>

      {showPopup && (
        <div style={styles.popup}>
          <h4>Cart Summary</h4>
          <p>Total Items: {cart.length}</p>
          <Link to="/cart" state={{ cart }} style={styles.link}>
            Go to Cart
          </Link>
          <button
            onClick={() => setShowPopup(false)}
            style={styles.closeButton}
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: "40px",
    backgroundColor: "#e6f4ea",
    minHeight: "100vh",
  },
  header: { textAlign: "center", color: "#276749", fontSize: "28px" },
  tokenDisplay: { textAlign: "right", fontSize: "18px", marginBottom: "20px" },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
    gap: "20px",
    padding: "0 40px",
  },
  card: {
    backgroundColor: "#fff",
    border: "1px solid #ddd",
    borderRadius: "10px",
    padding: "15px",
    textAlign: "center",
  },
  image: {
    width: "100%",
    height: "150px",
    objectFit: "cover",
    borderRadius: "8px",
    marginBottom: "10px",
  },
  button: {
    marginTop: "10px",
    backgroundColor: "#276749",
    color: "#fff",
    padding: "10px 15px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  floatingButton: {
    position: "fixed",
    bottom: "30px",
    right: "100px",
    backgroundColor: "#276749",
    color: "#fff",
    borderRadius: "50%",
    width: "60px",
    height: "60px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "24px",
    cursor: "pointer",
  },
  cartCount: {
    position: "absolute",
    top: "5px",
    right: "5px",
    backgroundColor: "#fff",
    color: "#276749",
    borderRadius: "50%",
    padding: "3px 8px",
    fontSize: "12px",
  },
  popup: {
    position: "fixed",
    bottom: "100px",
    right: "20px",
    backgroundColor: "#fff",
    padding: "20px",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
    borderRadius: "10px",
    zIndex: "1000",
    width: "200px",
  },
  link: {
    display: "block",
    marginTop: "10px",
    color: "#276749",
    textDecoration: "none",
  },
  closeButton: {
    marginTop: "10px",
    backgroundColor: "#ff4444",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    padding: "5px",
    cursor: "pointer",
  },
};

export default Store;
