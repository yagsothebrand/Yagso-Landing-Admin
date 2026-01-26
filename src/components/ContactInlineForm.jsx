import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import emailjs from "emailjs-com";
import {
  Mail,
  Phone,
  Clock,
  Zap,
  CheckCircle,
  AlertCircle,
  Send,
} from "lucide-react";
import { useAuth } from "./auth/AuthProvider";

/* ✅ EmailJS ENV */
const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

export default function ContactInlineForm() {
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: user?.email || "",
    message: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const suggestions = [
    "Share your amazing ideas with us…",
    "Tell us how we can make your experience even better…",
    "We’d love to hear your feedback!",
    "Ask us anything—you’re in good hands!",
    "Send a message and brighten someone’s day here!",
  ];

  const [suggestionIndex, setSuggestionIndex] = useState(0);

  const handleFocus = () => {
    setSuggestionIndex((prev) => (prev + 1) % suggestions.length);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /* ✅ REAL EMAIL SEND */
  const handleSubmit = async () => {
    if (!formData.name || !formData.email || !formData.message) return;

    setIsLoading(true);
    setSubmitStatus(null);

    try {
      await emailjs.send(
        SERVICE_ID,
        TEMPLATE_ID,
        {
          from_name: formData.name,
          from_email: formData.email,
          message: formData.message,
        },
        PUBLIC_KEY,
      );

      setSubmitStatus("success");
      setFormData({ name: "", email: user?.email || "", message: "" });
    } catch (error) {
      console.error("EmailJS error:", error);
      setSubmitStatus("error");
    } finally {
      setIsLoading(false);
    }
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
    },
    {
      label: "Response",
      value: "24-48 hours",
      icon: Zap,
    },
  ];

  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-black/5 p-8">
      {/* contact info */}
      {/* <div className="grid grid-cols-2 gap-3 mb-8">
        {contactInfo.map((item, index) => {
          const Icon = item.icon;

          return (
            <motion.a
              key={index}
              href={item.link || "#"}
              onClick={(e) => !item.link && e.preventDefault()}
              whileHover={{ y: -2 }}
              className="flex items-center gap-3 px-3 py-2 rounded-lg border bg-white text-gray-800"
            >
              <div className="w-8 h-8 flex items-center justify-center rounded-md bg-gray-100">
                <Icon size={16} />
              </div>

              <div className="leading-tight">
                <p className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold">
                  {item.label}
                </p>
                <p className="text-xs font-medium">{item.value}</p>
              </div>
            </motion.a>
          );
        })}
      </div> */}

      {/* form */}
      <div className="space-y-5">
        {["name", "email", "message"].map((field) => (
          <motion.div key={field}>
            <label className="block text-sm font-semibold mb-2">
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
                onFocus={handleFocus}
                rows="5"
                className="w-full px-4 py-3 border rounded-xl focus:outline-none"
                placeholder={suggestions[suggestionIndex]}
              />
            ) : (
              <motion.input
                type={field === "email" ? "email" : "text"}
                name={field}
                value={formData[field]}
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded-xl focus:outline-none"
                placeholder={
                  field === "name" ? "Your full name" : "your.email@example.com"
                }
              />
            )}
          </motion.div>
        ))}

        <motion.button
          onClick={handleSubmit}
          disabled={isLoading}
          whileHover={{ scale: 1.02 }}
          className="w-full bg-black text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-60"
        >
          {isLoading ? (
            "Sending..."
          ) : (
            <>
              <Send size={18} />
              Send Message
            </>
          )}
        </motion.button>
      </div>

      {/* status */}
      <AnimatePresence>
        {submitStatus && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`mt-4 p-4 rounded-xl text-sm font-semibold flex items-center gap-2 ${
              submitStatus === "success"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
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
                Failed to send message.
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
