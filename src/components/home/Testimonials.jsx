import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import FadeUpText from "../common/FadeUpText";

const Testimonials = () => {
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.4 });

  const testimonies = [
    {
      id: 1,
      text: "“Yagso captured the essence of elegance. My earrings elevate every day!”",
      name: "Elena",
      place: "los angeles",
    },
    {
      id: 2,
      text: "“Wearing Yagso makes me feel radiant. The gold shimmers beautifully!”",
      name: "Rina",
      place: "london",
    },
    {
      id: 3,
      text: "“Exceptional quality and design. I receive compliments every time.”",
      name: "Charlotte",
      place: "paris",
    },
  ];

  return (
    <div
      ref={sectionRef}
      className="px-[2rem] md:px-[4rem]  lg:px-[6rem] pt-[6rem] pb-[80px] min-h-[100vh] lg:max-w-[1200px] mx-auto flex flex-col justify-center items-center"
    >
      {/* Simpler fade-up headings */}
      <h2 className="text-center font-medium text-[26px] lg:text-[32px] text-[#133827] mb-2">
        <FadeUpText className={"testiHeading"} text="Loved by Many." />
      </h2>

      <h2 className="text-center font-medium text-[26px] lg:text-[32px] text-[#7E4913]/90">
        <FadeUpText
          className={"testiHeading"}
          text="Real voices, lasting impressions."
        />
      </h2>

      {/* Testimonials */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-[20px] pt-12">
        {testimonies.map((test, index) => (
          <motion.div
            key={test.id}
            className="bg-[#debfad]/45 rounded-[20px] px-[12px] md:px-[20px] pt-[12px] pb-[8px] flex flex-col gap-[12px] md:gap-[20px] shadow-sm hover:shadow-md transition-all"
            initial={{ opacity: 0, y: 60, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              delay: index * 0.15,
              duration: 0.6,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
            viewport={{ once: true, amount: 0.4 }}
          >
            <p className="text-[#7E4913]/75 text-[14px] pb-2 font-medium text-left leading-relaxed">
              {test.text}
            </p>
            <div>
              <p className="text-[#7E4913] capitalize text-[14px] font-medium text-left">
                {test.name}
              </p>
              <p className="text-[#133827]/50 capitalize font-medium text-[13px]">
                {test.place}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Testimonials;
