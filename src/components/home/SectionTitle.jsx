import React from "react";
import { motion } from "framer-motion";

const SectionTitle = ({ title, see = false }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="flex items-center justify-between mb-8"
    >
      <div>
        <h2 className="text-3xl md:text-4xl font-bold text-[#0e4132] text-bg-gradient-to-r from-[#0e4132] to-[#0e4132]  mb-2">
          {title}
        </h2>
        <div className="h-1 w-16 bg-gradient-to-r from-[#0e4132] to-[#0e4132] rounded-full"></div>
      </div>
      {see && (
        <button className="text-[#0e4132] hover:text-[#0e4132] font-semibold transition-colors">
          See All →
        </button>
      )}
    </motion.div>
  );
};

export default SectionTitle;
