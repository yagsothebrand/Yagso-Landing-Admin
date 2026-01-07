import React from "react";
import LogoTicker from "../common/LogoTicker";

const YagsoTicker = () => {
  const logos = [
    "/Yagso-logo.png",
    "/Yagso-logo.png",
    "/Yagso-logo.png",
    "/Yagso-logo.png",
    "/Yagso-logo.png",
  ];

  return (
    <section className="bg-[#ffffff]">
      <LogoTicker logos={logos} speed={200} />
    </section>
  );
};

export default YagsoTicker;
