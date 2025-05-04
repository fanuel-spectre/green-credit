import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "./Onboarding.css"; // Optional for styling
import { useNavigate } from "react-router-dom";

const Onboarding = () => {
  const navigate = useNavigate();

  const handleFinish = () => {
    localStorage.setItem("hasSeenOnboarding", "true");
    navigate("/dashboard"); // redirect to main app
  };

  return (
    <div className="onboarding-container">
      <Swiper>
        <SwiperSlide>
          <div className="slide">
            <h2>Welcome to Green Credit</h2>
            <p>
              Earn rewards for climate-positive actions like planting trees or
              joining cleanups.
            </p>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="slide">
            <h2>Track Your Progress</h2>
            <p>
              See your token balance, achievements, and your impact on the
              environment.
            </p>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="slide">
            <h2>Redeem and Share</h2>
            <p>
              Spend tokens in the store or help others with solar installations
              and get rewarded.
            </p>
            <button onClick={handleFinish}>Get Started</button>
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  );
};

export default Onboarding;
