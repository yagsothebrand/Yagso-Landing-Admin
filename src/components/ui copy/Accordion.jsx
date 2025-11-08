import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const Accordion = ({ title, content, isOpen, onClick }) => (
  <div className="border-b border-[#debfad]">
    <button
      onClick={onClick}
      className="flex justify-between items-center w-full py-3 text-left font-medium text-[#debfad]"
    >
      {title}
      <motion.div animate={{ rotate: isOpen ? 180 : 0 }}>
        <ChevronDown size={18} />
      </motion.div>
    </button>
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="pb-3 text-gray-300 text-sm"
        >
          {Array.isArray(content)
            ? content.map((faq, i) => (
                <div key={i} className="mt-2">
                  <p className="font-semibold">{faq.q}</p>
                  <p>{faq.a}</p>
                </div>
              ))
            : content}
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

export default Accordion;
