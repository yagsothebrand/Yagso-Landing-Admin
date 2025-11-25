import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Phone,
  Clock,
  Zap,
  X,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import emailjs from "@emailjs/browser";

const ContactModal = ({ setShowContact }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setSubmitStatus(null);

    try {
      // EmailJS send
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        {
          name: formData.name,
          email: formData.email,
          message: formData.message,
        },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );

      setSubmitStatus("success");
      setFormData({ name: "", email: "", message: "" });

      setTimeout(() => {
        setShowContact(false);
        setSubmitStatus(null);
      }, 2000);
    } catch (error) {
      console.error("Email send error:", error);
      setSubmitStatus("error");
    } finally {
      setIsLoading(false);
    }
  };

  // --- animations and UI identical to your original version ---
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

  const contactInfo = [
    {
      label: "Email",
      value: "contact@example.com",
      icon: Mail,
      link: "mailto:contact@example.com",
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
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-black/50 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={() => setShowContact(false)}
        />

        {/* Slide-In Panel */}
        <motion.div
          className="relative w-[90vw] sm:w-[520px] bg-[#e8dbd4]/30 backdrop-blur-md shadow-2xl overflow-hidden border-l border-[#d4c4b0]/40"
          initial={{ x: "100%", opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: "100%", opacity: 0 }}
          transition={{ type: "spring", stiffness: 70, damping: 18, mass: 1.2 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="relative h-56 bg-gradient-to-br from-[#133827] via-[#1a4d3d] to-[#0f2f23] overflow-hidden p-8 pt-12">
            <motion.button
              className="absolute top-6 right-6 z-10 text-[#debfad]/60 hover:text-[#debfad] bg-[#133827]/30 hover:bg-[#133827]/50 rounded-full p-2 backdrop-blur-sm transition-all border border-[#debfad]/20"
              onClick={() => setShowContact(false)}
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Close contact modal"
            >
              <X size={24} />
            </motion.button>

            <motion.div
              className="relative h-full flex flex-col justify-end text-white"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <h2 className="text-4xl font-serif mb-2 text-[#debfad]">
                Get In Touch
              </h2>
              <p className="text-[#debfad]/80 text-sm font-light">
                We'd love to hear from you. Send us a message and we'll respond
                as soon as possible.
              </p>
            </motion.div>
          </div>

          {/* Content */}
          <div className="p-8 overflow-y-auto max-h-[calc(100vh-224px)]">
            {/* Info Cards */}
            <motion.div
              className="grid grid-cols-2 gap-4 mb-10"
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
                    whileHover={item.link ? { y: -4 } : {}}
                  >
                    <div className="bg-white/50 backdrop-blur-sm rounded-lg p-4 border border-[#d4c4b0]/20 group-hover:bg-white/70 group-hover:border-[#8B6F47]/40 transition-all h-full">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#133827] to-[#0f2f23] flex items-center justify-center mb-3 text-[#debfad] group-hover:from-[#8B6F47] group-hover:to-[#6b5835] transition-all">
                        <IconComponent size={18} />
                      </div>
                      <p className="text-xs text-[#8B6F47] font-semibold tracking-wide">
                        {item.label}
                      </p>
                      <p className="text-sm text-[#0d3324] mt-1 font-medium">
                        {item.value}
                      </p>
                    </div>
                  </motion.a>
                );
              })}
            </motion.div>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="space-y-5"
              aria-label="Contact form"
            >
              {["name", "email", "message"].map((field, idx) => (
                <motion.div
                  key={field}
                  variants={inputVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.3 + idx * 0.05 }}
                >
                  <label className="block text-sm font-semibold text-[#debfad] mb-3 tracking-wide">
                    {field === "name"
                      ? "Full Name"
                      : field === "email"
                      ? "Email Address"
                      : "Message"}
                  </label>

                  {field === "message" ? (
                    <textarea
                      name={field}
                      value={formData[field]}
                      onChange={handleChange}
                      rows="5"
                      required
                      className="w-full px-5 py-3 border border-[#d4c4b0]/40 rounded-lg bg-white/60 backdrop-blur-sm"
                      placeholder="Tell us what's on your mind..."
                    />
                  ) : (
                    <input
                      type={field === "email" ? "email" : "text"}
                      name={field}
                      value={formData[field]}
                      onChange={handleChange}
                      required
                      className="w-full px-5 py-3 border border-[#d4c4b0]/40 rounded-lg bg-white/60 backdrop-blur-sm"
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
                type="submit"
                disabled={isLoading}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45, duration: 0.5 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-[#faf6f1] to-[#faf6f1] text-[#0d3324] py-3 px-6 rounded-lg font-semibold text-sm tracking-wide shadow-lg"
              >
                {isLoading ? "Sending..." : "Send Message"}
              </motion.button>
            </form>

            <AnimatePresence>
              {submitStatus && (
                <motion.div
                  key={submitStatus}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={`px-4 py-3 rounded-lg text-sm font-semibold flex items-center gap-2 ${
                    submitStatus === "success"
                      ? "bg-green-50 border border-green-200 text-green-700"
                      : "bg-red-50 border border-red-200 text-red-700"
                  }`}
                >
                  {submitStatus === "success" ? (
                    <>
                      <CheckCircle size={18} />
                      Message sent successfully!
                    </>
                  ) : (
                    <>
                      <AlertCircle size={18} />
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
