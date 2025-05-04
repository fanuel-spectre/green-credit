import React, { useState } from "react";
import "./Onboarding.css"; // We'll define basic styles here

const slides = [
  {
    title: "Welcome to Green Credit",
    description:
      "Earn tokens for planting trees, cleaning up, and supporting your community.",
    image: "/images/onboard1.png",
  },
  {
    title: "Complete Green Activities",
    description:
      "Upload photos for proof, get admin approval, and earn tokens.",
    image: "/images/onboard2.png",
  },
  {
    title: "Redeem & Give Back",
    description:
      "Spend tokens in the store or reward others for helping with solar installs.",
    image: "/images/onboard3.png",
  },
];

const Onboarding = ({ onFinish }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      localStorage.setItem("hasSeenOnboarding", "true");
      onFinish();
    }
  };

  return (
    <div className="onboarding-container">
      <img
        src={slides[currentSlide].image}
        alt="Slide"
        className="onboarding-image"
      />
      <h2>{slides[currentSlide].title}</h2>
      <p>{slides[currentSlide].description}</p>
      <button className="onboarding-button" onClick={nextSlide}>
        {currentSlide === slides.length - 1 ? "Get Started" : "Next"}
      </button>
    </div>
  );
};

export default Onboarding;
