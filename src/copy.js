import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Link,
  Routes,
} from "react-router-dom";
import "./App.css";
import Login from "./components/Login";
import Register from "./components/Register";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [treesPlanted, setTreesPlanted] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [showSatellite, setShowSatellite] = useState(false);
  const [showReward, setShowReward] = useState(false);
  const [tokenBalance, setTokenBalance] = useState(0);
  const [rewardHistory, setRewardHistory] = useState([]);

  const handleTreeSubmission = () => {
    if (treesPlanted) {
      setConfirmation(
        `✅ You reported planting ${treesPlanted} trees. Verification in progress...`
      );
      setTreesPlanted("");
      setShowSatellite(true);
    } else {
      setConfirmation("⚠️ Please enter the number of trees planted.");
    }
  };

  const handleRewardClaim = () => {
    const reward = {
      item: "Solar Cookstove",
      tokens: 10,
      date: new Date().toLocaleDateString(),
    };
    setTokenBalance(tokenBalance + reward.tokens);
    setRewardHistory([reward, ...rewardHistory]);
    setShowReward(true);
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
      <div style={{ padding: 20 }}>
        <NavBar />
        {!isLoggedIn ? (
          <Login onLogin={() => setIsLoggedIn(true)} />
        ) : (
          <div style={styles.container}>
            <div style={styles.card}>
              <h2 style={styles.title}>🌱 GreenToken USSD Demo</h2>
              <p style={styles.subtitle}>Simulate SMS/USSD tree reporting</p>

              <input
                type="number"
                placeholder="Enter number of trees planted"
                value={treesPlanted}
                onChange={(e) => setTreesPlanted(e.target.value)}
                style={styles.input}
              />

              <button onClick={handleTreeSubmission} style={styles.button}>
                Submit Report
              </button>

              {confirmation && <p style={styles.message}>{confirmation}</p>}

              {showSatellite && (
                <div style={{ marginTop: 20 }}>
                  <h3 style={{ fontSize: 16, color: "#276749" }}>
                    📡 Satellite Verification
                  </h3>
                  <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Amazon_deforestation.jpg/320px-Amazon_deforestation.jpg"
                      alt="Before"
                      width={150}
                      style={{ borderRadius: 8 }}
                    />
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Satellite_image_of_Amazon_forest.jpg/320px-Satellite_image_of_Amazon_forest.jpg"
                      alt="After"
                      width={150}
                      style={{ borderRadius: 8 }}
                    />
                  </div>
                  <p style={{ fontSize: 14, color: "#444", marginTop: 8 }}>
                    🌳 Tree growth detected: Verification score 92%
                  </p>
                  <button
                    onClick={handleRewardClaim}
                    style={{
                      ...styles.button,
                      backgroundColor: "#3182ce",
                      marginTop: 10,
                    }}
                  >
                    Claim Reward
                  </button>
                </div>
              )}

              {showReward && (
                <div
                  style={{
                    marginTop: 20,
                    backgroundColor: "#f0fff4",
                    padding: 15,
                    borderRadius: 10,
                  }}
                >
                  <h3 style={{ fontSize: 16, color: "#2f855a" }}>
                    🎉 Reward Claimed!
                  </h3>
                  <p style={{ fontSize: 14, color: "#333" }}>
                    You received a solar-powered cookstove and 10 GreenTokens 🌍
                  </p>
                  <p style={{ fontSize: 14, color: "#666" }}>
                    🌍 GPS Map Verified - Village ID #234A
                  </p>
                </div>
              )}

              <div
                style={{
                  marginTop: 30,
                  paddingTop: 20,
                  borderTop: "1px solid #ccc",
                }}
              >
                <h3 style={{ fontSize: 16, color: "#276749" }}>
                  💰 Token Balance & Reward History
                </h3>
                <p style={{ fontSize: 14, color: "#444" }}>
                  Current Token Balance:{" "}
                  <strong>{tokenBalance} GreenTokens</strong>
                </p>
                {rewardHistory.length > 0 ? (
                  <ul
                    style={{ marginTop: 10, textAlign: "left", fontSize: 14 }}
                  >
                    {rewardHistory.map((reward, index) => (
                      <li key={index}>
                        ✅ {reward.date}: Claimed <strong>{reward.item}</strong>{" "}
                        (+{reward.tokens} tokens)
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p style={{ fontSize: 13, color: "#888" }}>
                    No rewards claimed yet.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </Router>
  );
}

function NavBar() {
  return (
    <nav
      style={{
        backgroundColor: "#276749",
        padding: "10px 20px",
        color: "white",
      }}
    >
      <ul
        style={{
          display: "flex",
          justifyContent: "space-around",
          listStyle: "none",
          padding: 0,
        }}
      >
        <li>
          <Link to="/home" style={navLinkStyle}>
            Home
          </Link>
        </li>
        <li>
          <Link to="/leaderboard" style={navLinkStyle}>
            Leaderboard
          </Link>
        </li>
        <li>
          <Link to="/profile" style={navLinkStyle}>
            Profile
          </Link>
        </li>
      </ul>
    </nav>
  );
}

const navLinkStyle = {
  color: "white",
  textDecoration: "none",
  fontSize: "18px",
};

const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#e6f4ea",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  card: {
    width: 420,
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 16,
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    textAlign: "center",
  },
  title: {
    color: "#276749",
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: "14px",
    color: "#666",
    marginBottom: 16,
  },
  input: {
    width: "95%",
    padding: 9,
    fontSize: "16px",
    marginBottom: 12,
    border: "1px solid #ccc",
    borderRadius: 8,
  },
  button: {
    width: "100%",
    padding: 10,
    fontSize: "16px",
    backgroundColor: "#38a169",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
  },
  message: {
    marginTop: 12,
    fontSize: "14px",
    color: "#333",
  },
};

export default App;
