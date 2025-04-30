import React, { useEffect, useState } from "react";
import "./ComingSoon.css";

function ComingSoon() {
  const calculateTimeLeft = () => {
    const launchDate = new Date("2025-06-01");
    const now = new Date();
    const difference = launchDate - now;

    let timeLeft = {};
    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  const [email, setEmail] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearTimeout(timer);
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Subscribed with: ${email}`);
    setEmail("");
  };

  return (
    <div className="coming-soon-container">
      <h1 className="title">Something Awesome is Coming Soon!</h1>
      <p className="subtitle">
        We're working hard to bring you a great experience. Stay tuned!
      </p>

      <div className="countdown">
        {Object.keys(timeLeft).length === 0 ? (
          <h2>We're Live! 🎉</h2>
        ) : (
          <>
            <div className="countdown-box">
              <span>{timeLeft.days}</span>
              <small>Days</small>
            </div>
            <div className="countdown-box">
              <span>{timeLeft.hours}</span>
              <small>Hours</small>
            </div>
            <div className="countdown-box">
              <span>{timeLeft.minutes}</span>
              <small>Minutes</small>
            </div>
            <div className="countdown-box">
              <span>{timeLeft.seconds}</span>
              <small>Seconds</small>
            </div>
          </>
        )}
      </div>

      <form className="subscription-form" onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Enter your email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit">Notify Me</button>
      </form>

    </div>
  );
}

export default ComingSoon;
