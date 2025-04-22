import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  doc,
  query,
  where,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import { auth, db } from "./firebase";
import { toast } from "react-toastify";
import Loader from "./Loader";
import { Link, useNavigate } from "react-router-dom";

function Store() {
  const [products, setProducts] = useState([]);
  const [user, setUser] = useState(null);
  const [userTokens, setUserTokens] = useState(0);
  const [totalTokens, setTotalTokens] = useState(0);
  const [loading, setLoading] = useState(true);

   const [cart, setCart] = useState(() => {
     const storedCart = localStorage.getItem("cart");
     return storedCart ? JSON.parse(storedCart) : [];
   });
  const [cartTotal, setCartTotal] = useState(0);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

   const handleAddToCart = (product) => {
     setCart((prev) => {
       const existing = prev.find((item) => item.id === product.id);
       if (existing) {
         return prev.map((item) =>
           item.id === product.id
             ? { ...item, quantity: item.quantity + 1 }
             : item
         );
       } else {
         return [...prev, { ...product, quantity: 1 }];
       }
     });
   };

  useEffect(() => {
    const fetchProducts = async () => {
      const querySnapshot = await getDocs(collection(db, "Products"));
      const items = [];
      querySnapshot.forEach((doc) => items.push({ id: doc.id, ...doc.data() }));
      setProducts(items);
    };

    const fetchUser = () => {
      return new Promise((resolve) => {
        auth.onAuthStateChanged(async (currentUser) => {
          if (currentUser) {
            setUser(currentUser);
            const docRef = doc(db, "Users", currentUser.uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
              setUserTokens(docSnap.data().redeemableTokens || 0);
              await fetchTokenAwards(currentUser.uid);
            }
          }
          resolve();
        });
      });
    };

    const fetchTokenAwards = async (uid) => {
      const q = query(
        collection(db, "TreeSubmissions"),
        where("userId", "==", uid),
        where("status", "==", "approved")
      );

      const querySnapshot = await getDocs(q);

      let total = 0;
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.tokensAwarded) {
          total += Number(data.tokensAwarded || 0);
        }
      });

      setTotalTokens(total);
    };

    const loadData = async () => {
      await Promise.all([fetchProducts(), fetchUser()]);
      setLoading(false);
    };

    loadData();
  }, []);


  useEffect(() => {
    console.log("Cart:", cart);
    console.log("Cart Total:", cartTotal);
  }, [cart, cartTotal]);

  const addToCart = (product) => {
    console.log("Trying to add to cart:", product.name);
    toast.info(`Adding ${product.name} to cart`);

    if (userTokens < cartTotal + product.cost) {
      return toast.warning("Not enough tokens for this item.");
    }

    setCart((prev) => [...prev, product]);
    setCartTotal((prev) => prev + product.cost);
  };
useEffect(() => {
  console.log("User tokens:", userTokens);
}, [userTokens]);


  const handleCheckout = async () => {
    if (!user) return toast.error("You must be logged in");
    if (cart.length === 0) return toast.warning("Cart is empty");

    try {
      const userRef = doc(db, "Users", user.uid);
      await updateDoc(userRef, {
        redeemableTokens: userTokens - cartTotal,
      });

      setUserTokens(userTokens - cartTotal);
      toast.success("Successfully redeemed items!");

      // Clear cart
      setCart([]);
      setCartTotal(0);
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Checkout failed");
    }
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
                disabled={userTokens < cartTotal + product.cost}
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>

        {cart.length > 0 && (
          <div style={styles.cartBox}>
            <h3>Cart Summary</h3>
            <ul>
              {cart.map((item, idx) => (
                <li key={idx}>
                  {item.name} - {item.cost} tokens
                </li>
              ))}
            </ul>
            <p>
              Total: <strong>{cartTotal} tokens</strong>
            </p>
            <button style={styles.checkoutButton} onClick={handleCheckout}>
              Checkout
            </button>
          </div>
        )}

        {/* 👇👇👇 Add this to show the floating button */}
        {cart.length > 0 && <FloatingCartButton cart={cart} />}
      </div>
    );

}

function FloatingCartButton({ cart }) {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <div>
      {/* Floating Cart Button */}
      <div onClick={() => setShowPopup(true)} style={styles.floatingButton}>
        <span style={styles.cartCount}>{cart.length}</span>
        🛒
      </div>

      {/* Popup */}
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
  header: {
    textAlign: "center",
    color: "#276749",
    fontSize: "28px",
  },
  tokenDisplay: {
    textAlign: "right",
    fontSize: "18px",
    marginBottom: "20px",
  },
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
  cartBox: {
    marginTop: "40px",
    padding: "20px",
    backgroundColor: "#fff",
    borderRadius: "10px",
    border: "1px solid #ccc",
  },
  checkoutButton: {
    backgroundColor: "#2f855a",
    color: "#fff",
    padding: "10px 20px",
    marginTop: "10px",
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
