import React, { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "./firebase";
import Loader from "./Loader"; 

const Orders = ({ currentUser }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true); 


  const fetchOrders = async () => {
    const auth = getAuth();
    const user = auth.currentUser; 

    if (!user) {
      alert("You need to be logged in to view orders.");
      return;
    }

    try {
      const q = query(
        collection(db, "orders"),
        where("userId", "==", user.uid)
      );
      const querySnapshot = await getDocs(q);
      const ordersList = querySnapshot.docs.map((doc) => doc.data());
      setOrders(ordersList);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false); 
    }
  };

  useEffect(() => {
    fetchOrders(); 
  }, []);

  return (
    <div style={styles.ordersContainer}>
      {loading ? (
        <Loader /> 
      ) : (
        <>
          <h2>Your Orders</h2>
          {orders.length === 0 ? (
            <p>You have no orders yet.</p>
          ) : (
            <ul style={styles.ordersList}>
              {orders.map((order, index) => (
                <li key={index} style={styles.orderCard}>
                  <p>
                    <strong>Order Total:</strong> {order.total} Tokens
                  </p>
                  <p>
                    <strong>Status:</strong> {order.status || "Pending"}
                  </p>
                  <p>
                    <strong>Created at:</strong>{" "}
                    {order.createdAt.toDate().toLocaleString()}
                  </p>
                  {order.deliveryOption && order.deliveryLocation && (
                    <p>
                      <strong>Delivery to:</strong> {order.deliveryLocation}
                    </p>
                  )}

                  <h4>Products:</h4>
                  <div style={styles.productsList}>
                    {order.cart.map((item, itemIndex) => (
                      <div key={itemIndex} style={styles.productCard}>
                        <img
                          src={item.image}
                          alt={item.name}
                          style={styles.productImage}
                        />
                        <div style={styles.productDetails}>
                          <p>
                            <strong>{item.name}</strong>
                          </p>
                          <p>{item.cost} Tokens</p>
                          <p>Quantity: {item.quantity}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
};

const styles = {
  ordersContainer: {
    padding: "20px",
    maxWidth: "800px",
    margin: "0 auto",
  },
  ordersList: {
    listStyleType: "none",
    padding: 0,
  },
  orderCard: {
    backgroundColor: "#fff",
    borderRadius: "10px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    marginBottom: "20px",
    padding: "15px",
  },
  productsList: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  productCard: {
    display: "flex",
    backgroundColor: "#f9f9f9",
    borderRadius: "10px",
    padding: "10px",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
    alignItems: "center",
    flexDirection: "row",
  },
  productImage: {
    width: "80px",
    height: "80px",
    borderRadius: "8px",
    objectFit: "cover",
    marginRight: "15px",
  },
  productDetails: {
    flex: 1,
  },

  // Mobile responsive styles
  "@media (max-width: 600px)": {
    ordersContainer: {
      padding: "10px",
      maxWidth: "100%",
    },
    orderCard: {
      padding: "10px",
    },
    productCard: {
      flexDirection: "column",
      alignItems: "center",
      textAlign: "center",
    },
    productImage: {
      width: "60px",
      height: "60px",
      marginBottom: "10px",
    },
    productDetails: {
      textAlign: "center",
    },
    productsList: {
      flexDirection: "column",
      gap: "10px",
    },
  },
};

export default Orders;
