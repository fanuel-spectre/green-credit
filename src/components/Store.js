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

function Store() {
  const [products, setProducts] = useState([]);
  const [user, setUser] = useState(null);
  const [userTokens, setUserTokens] = useState(0);
  const [totalTokens, setTotalTokens] = useState(0);
  const [loading, setLoading] = useState(true); 

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
          resolve(); // Resolve whether user is logged in or not
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
          console.log("Found doc:", data);
    
          if (data.tokensAwarded) {
            total += Number(data.tokensAwarded || 0);
          }
        });
    
        setTotalTokens(total);
      };

    const loadData = async () => {
      await Promise.all([fetchProducts(), fetchUser()]);
      setLoading(false); // Only hide loader when both are done
    };

   loadData();
  }, []);

  const handleRedeem = async (product) => {
    if (!user) return toast.error("You must be logged in");

    if (userTokens < product.cost) {
      return toast.warning("Not enough tokens");
    }

    try {
      const userRef = doc(db, "Users", user.uid);
      await updateDoc(userRef, {
        redeemableTokens: userTokens - product.cost,
      });
      setUserTokens(userTokens - product.cost);
      toast.success(`Redeemed ${product.name}!`);
    } catch (error) {
      console.error("Redemption error:", error);
      toast.error("Redemption failed");
    }
  };
   if (loading) return <Loader />;
  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Redeem Your Tokens</h2>
      <p style={styles.tokenDisplay}>
        Your Tokens: <strong>{totalTokens}</strong>
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
              onClick={() => handleRedeem(product)}
              disabled={userTokens < product.cost}
            >
              Redeem
            </button>
          </div>
        ))}
      </div>
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
};

export default Store;
