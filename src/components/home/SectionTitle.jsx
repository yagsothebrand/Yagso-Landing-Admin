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
        <h2 className="text-3xl md:text-4xl font-bold text-bg-gradient-to-r from-[#debfad] to-[#c9956f]  mb-2">
          {title}
        </h2>
        <div className="h-1 w-16 bg-gradient-to-r from-[#debfad] to-[#c9956f] rounded-full"></div>
      </div>
      {see && (
        <button className="text-[#debfad] hover:text-[#c9956f] font-semibold transition-colors">
          See All →
        </button>
      )}
    </motion.div>
  );
};

export default SectionTitle;
