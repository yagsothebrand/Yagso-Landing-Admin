import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Phone,
  Clock,
  Zap,
  X,
  CheckCircle,
  AlertCircle,
  Send,
  Sparkles,
} from "lucide-react";
import { useLandingAuth } from "../landingauth/LandingAuthProvider";

const ContactModal = ({ setShowContact }) => {
  const { user } = useLandingAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: user.email,
    message: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const suggestions = [
    "Share your amazing ideas with us…",
    "Tell us how we can make your experience even better…",
    "We’d love to hear your feedback!",
    "Ask us anything—you’re in good hands!",
    "Send a message and brighten someone’s day here!",
  ];

  const [suggestionIndex, setSuggestionIndex] = useState(0);

  const handleFocus = () => {
    // Move to the next suggestion each time the textarea is focused
    setSuggestionIndex((prev) => (prev + 1) % suggestions.length);
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.email || !formData.message) return;

    setIsLoading(true);
    setSubmitStatus(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setSubmitStatus("success");
      setFormData({ name: "", email: "", message: "" });

      setTimeout(() => {
        setShowContact(false);
        setSubmitStatus(null);
      }, 6000);
    } catch (error) {
      console.error("Email send error:", error);
      setSubmitStatus("error");
    } finally {
      setIsLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const inputVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
  };

  const floatingVariants = {
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  const contactInfo = [
    {
      label: "Email",
      value: "support@yagso.com",
      icon: Mail,
      link: "mailto:support@yagso.com",
    },
    {
      label: "Phone",
      value: "+234 812 345 6789",
      icon: Phone,
      link: "tel:+2348123456789",
    },
    {
      label: "Hours",
      value: "Mon - Fri, 9am - 6pm",
      icon: Clock,
      link: null,
    },
    {
      label: "Response",
      value: "24-48 hours",
      icon: Zap,
      link: null,
    },
  ];

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[9999] flex justify-end"
        role="dialog"
        aria-modal="true"
      >
        <motion.div
          className="absolute inset-0 bg-white/20 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          onClick={() => setShowContact(false)}
        />

        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-[#254331]/30 rounded-full"
              initial={{
                x: Math.random() * 1200,
                y: Math.random() * 800,
              }}
              animate={{
                y: [null, Math.random() * -100 - 50],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        <motion.div
          className="relative w-[90vw] sm:w-[540px]  backdrop-blur-2xl shadow-2xl overflow-hidden border-l-2 border-[#c4a68f]/30"
          initial={{ x: "100%", opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: "100%", opacity: 0 }}
          transition={{ type: "spring", stiffness: 70, damping: 20, mass: 1 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-[#c4a68f]/10 via-transparent to-[#c4a68f]/20 pointer-events-none" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#c4a68f]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#254331]/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative h-64 bg-white/50 overflow-hidden p-8 pt-12">
            <div className="absolute inset-0 opacity-10">
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-32 h-32 border border-[#254331]/30 rounded-full"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{
                    duration: 4 + i,
                    repeat: Infinity,
                    delay: i * 0.5,
                  }}
                />
              ))}
            </div>

            <motion.button
              className="absolute top-6 right-6 z-10 text-[#254331]/70 hover:text-[#254331] rounded-full p-2.5 backdrop-blur-sm transition-all border  shadow-lg"
              onClick={() => setShowContact(false)}
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.95 }}
            >
              <X size={24} />
            </motion.button>

            <motion.div
              className="relative h-full flex flex-col justify-end"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              <motion.div
                className="inline-flex items-center gap-2 mb-3"
                variants={floatingVariants}
                animate="animate"
              >
                <Sparkles className="text-[#254331]" size={20} />
                <span className="text-[#254331]/80 text-sm font-medium tracking-wider">
                  CONNECT WITH US
                </span>
              </motion.div>
              <h2 className="text-5xl font-bold mb-3 text-[#254331] tracking-tight">
                Get In Touch
              </h2>
              <p className="text-[#254331] text-base font-light leading-relaxed">
                We'd love to hear from you. Send us a message and we'll respond
                as soon as possible.
              </p>
            </motion.div>
          </div>

          <div className="relative p-8 overflow-y-auto max-h-[calc(100vh-256px)]">
            <motion.div
              className="grid grid-cols-2 gap-4 mb-8"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {contactInfo.map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <motion.a
                    key={index}
                    href={item.link || "#"}
                    onClick={(e) => !item.link && e.preventDefault()}
                    className="group relative overflow-hidden block"
                    variants={itemVariants}
                    whileHover={
                      item.link ? { y: -6, scale: 1.02 } : { scale: 1.02 }
                    }
                  >
                    <div className="relative bg-[#ffffff]/60 backdrop-blur-sm rounded-xl p-5 border border-[#c4a68f]/40 group-hover:border-[#254331]/50 transition-all h-full shadow-lg group-hover:shadow-xl">
                      <div className="absolute inset-0 bg-gradient-to-br from-[#254331]/0 to-[#254331]/0 group-hover:from-[#254331]/10 group-hover:to-transparent rounded-xl transition-all duration-300" />

                      <motion.div
                        className="relative w-10 h-10 rounded-lg bg-gradient-to-br from-[#254331]/30 to-[#254331]/10 flex items-center justify-center mb-3 text-[#254331] group-hover:from-[#254331]/50 group-hover:to-[#254331]/20 transition-all border border-[#254331]/20"
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                      >
                        <IconComponent size={20} />
                      </motion.div>
                      <p className="relative text-xs text-[#254331]/70 font-semibold tracking-wider uppercase">
                        {item.label}
                      </p>
                      <p className="relative text-sm text-[#254331] mt-1.5 font-medium">
                        {item.value}
                      </p>
                    </div>
                  </motion.a>
                );
              })}
            </motion.div>

            <div className="space-y-5">
              {["name", "email", "message"].map((field, idx) => (
                <motion.div
                  key={field}
                  variants={inputVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.3 + idx * 0.05 }}
                >
                  <label className="block text-sm font-semibold text-[#254331] mb-2 tracking-wide">
                    {field === "name"
                      ? "Full Name"
                      : field === "email"
                      ? "Email Address"
                      : "Your Message"}
                  </label>

                  {field === "message" ? (
                    <motion.textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      onFocus={handleFocus} // <-- add this
                      rows="5"
                      whileFocus={{ scale: 1.01 }}
                      className="w-full px-5 py-4 border-2 border-[#c4a68f]/30 rounded-xl bg-white/80 backdrop-blur-sm text-[#254331] placeholder:text-[#254331]/40 focus:border-[#c4a68f]/60 focus:bg-white focus:outline-none transition-all shadow-sm hover:shadow-md font-medium resize-none"
                      placeholder={suggestions[suggestionIndex]} // dynamic placeholder
                    />
                  ) : (
                    <motion.input
                      type={field === "email" ? "email" : "text"}
                      name={field}
                      value={formData[field]}
                      onChange={handleChange}
                      whileFocus={{ scale: 1.01 }}
                      className="w-full px-5 py-4 border-2 border-[#c4a68f]/30 rounded-xl bg-white/80 backdrop-blur-sm text-[#254331] placeholder:text-[#254331]/40 focus:border-[#c4a68f]/60 focus:bg-white focus:outline-none transition-all shadow-sm hover:shadow-md font-medium"
                      placeholder={
                        field === "name"
                          ? "Your full name"
                          : "your.email@example.com"
                      }
                    />
                  )}
                </motion.div>
              ))}

              <motion.button
                onClick={handleSubmit}
                disabled={isLoading}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45, duration: 0.5 }}
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="relative w-full bg-[#254331] text-[#debfad] py-4 px-6 rounded-xl font-bold text-sm tracking-wide shadow-xl hover:shadow-2xl transition-all overflow-hidden border border-[#c4a68f]/50 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <motion.div
                  className="absolute inset-0 "
                  animate={{ x: ["-100%", "200%"] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                />
                <span className="relative flex items-center justify-center gap-2">
                  {isLoading ? (
                    <>
                      <motion.div
                        className="w-5 h-5 border-2 border-[#254331]/30 border-t-[#254331] rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      Send Message
                    </>
                  )}
                </span>
              </motion.button>
            </div>

            <AnimatePresence>
              {submitStatus && (
                <motion.div
                  key={submitStatus}
                  initial={{ opacity: 0, y: 10, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className={`mt-5 px-5 py-4 rounded-xl text-sm font-semibold flex items-center gap-3 shadow-lg backdrop-blur-sm ${
                    submitStatus === "success"
                      ? "bg-green-500/20 border-2 border-green-500/40 text-green-100"
                      : "bg-red-500/20 border-2 border-red-500/40 text-red-100"
                  }`}
                >
                  {submitStatus === "success" ? (
                    <>
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 0.5 }}
                      >
                        <CheckCircle size={22} />
                      </motion.div>
                      Message sent successfully!
                    </>
                  ) : (
                    <>
                      <AlertCircle size={22} />
                      Failed to send message. Please try again.
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ContactModal;
