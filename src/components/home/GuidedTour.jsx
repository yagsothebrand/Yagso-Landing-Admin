import React, { useEffect, useState } from "react";

const GuidedTour = ({ refs }) => {
  const steps = [
    { id: "carousel", label: "About Us / Carousel" },
    { id: "bestSeller", label: "Where to Shop / Best Seller" },
    // { id: "getInspired", label: "Get Inspired" },
    // { id: "newCollections", label: "New Collections" },
    // { id: "contactBtn", label: "Contact Us" },
  ];

  const [currentStep, setCurrentStep] = useState(0);
  const [isTourActive, setIsTourActive] = useState(true);

  useEffect(() => {
    let timer;

    if (isTourActive && currentStep < steps.length) {
      const step = steps[currentStep];

      if (!step) return; // safeguard

      // Scroll to element if it exists
      const ref =
        step.id === "contactBtn"
          ? refs.contactBtn
          : refs[step.id];

      if (ref && ref.current) {
        ref.current.scrollIntoView({ behavior: "smooth", block: "center" });
        ref.current.classList.add("highlight-tour");

        // Remove highlight after 2.5s
        setTimeout(() => {
          ref.current?.classList.remove("highlight-tour");
        }, 2500);
      }

      timer = setTimeout(() => {
        setCurrentStep((prev) => prev + 1);
      }, 3000);
    }

    return () => clearTimeout(timer);
  }, [currentStep, isTourActive, refs]);

  // Stop tour when finished
  useEffect(() => {
    if (currentStep >= steps.length) {
      setIsTourActive(false);
    }
  }, [currentStep]);

  return null; // no UI, just scrolling + highlighting
};

export default GuidedTour;
