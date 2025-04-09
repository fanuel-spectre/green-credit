import React, { useState } from "react";
import "../App.css";

function App() {
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
                src="https://s.w-x.co//util/image/w/106000555-3.jpg?crop=16:9&width=980&format=pjpg&auto=webp&quality=60"
                alt="Before"
                width={150}
                style={{ borderRadius: 8 }}
              />
              <img
                src="https://communities.springernature.com/cdn-cgi/image/metadata=copyright,format=auto,quality=95,fit=scale-down/https://images.zapnito.com/uploads/e87f9814f26fa572e27368bf595df2ec/Screenshotfrom2017-02-1722-59-32.png"
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
          style={{ marginTop: 30, paddingTop: 20, borderTop: "1px solid #ccc" }}
        >
          <h3 style={{ fontSize: 16, color: "#276749" }}>
            💰 Token Balance & Reward History
          </h3>
          <p style={{ fontSize: 14, color: "#444" }}>
            Current Token Balance: <strong>{tokenBalance} GreenTokens</strong>
          </p>
          {rewardHistory.length > 0 ? (
            <ul style={{ marginTop: 10, textAlign: "left", fontSize: 14 }}>
              {rewardHistory.map((reward, index) => (
                <li key={index}>
                  ✅ {reward.date}: Claimed <strong>{reward.item}</strong> (+
                  {reward.tokens} tokens)
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
  );
}

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
