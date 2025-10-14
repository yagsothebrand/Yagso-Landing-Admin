import { motion } from "framer-motion";
import { Loader2 } from "lucide-react"; // gear-like icon

export default function AutoPartsLoader() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      {/* Blurred background glow */}
      <div className="absolute w-72 h-72 rounded-full bg-blue-500/30 blur-3xl animate-pulse" />

      {/* Spinning gear */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
        className="relative z-10"
      >
        <Loader2 className="w-16 h-16 text-blue-600 drop-shadow-xl" />
      </motion.div>

      {/* Pulsing text */}
      <motion.p
        className="mt-6 text-lg font-semibold text-gray-700"
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
       
      </motion.p>
    </div>
  );
}
