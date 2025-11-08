import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

const FadeUpText = ({ text, className }) => {
  return (
    <motion.span
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      viewport={{ once: true, amount: 0.3 }}
      className={className}
    >
      {text}
    </motion.span>
  );
};

export default FadeUpText;
