import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import emailjs from "@emailjs/browser";
import {
  Mail,
  User,
  MessageSquare,
  Send,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { Field, FieldTextArea } from "./fields";

export default function ContactFormPanel() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState({
    loading: false,
    success: "",
    error: "",
  });

  const canSend = useMemo(() => {
    const emailOk = /^\S+@\S+\.\S+$/.test(form.email.trim());
    return (
      form.name.trim().length >= 2 &&
      emailOk &&
      form.message.trim().length >= 10
    );
  }, [form]);

  const resetStatus = () =>
    setStatus({ loading: false, success: "", error: "" });

  const handleChange = (e) => {
    resetStatus();
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    resetStatus();

    if (!canSend) {
      setStatus((p) => ({
        ...p,
        error: "Fill all fields correctly (message should be 10+ chars).",
      }));
      return;
    }

    const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
      setStatus((p) => ({
        ...p,
        error:
          "EmailJS is not configured. Add VITE_EMAILJS_* values to your .env.",
      }));
      return;
    }

    try {
      setStatus({ loading: true, success: "", error: "" });

      const templateParams = {
        from_name: form.name,
        reply_to: form.email,
        message: form.message,
      };

      await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY);

      setStatus({
        loading: false,
        success: "Sent! We’ll get back to you shortly.",
        error: "",
      });

      setForm({ name: "", email: "", message: "" });

      //   setTimeout(() => onClose?.(), 1200);
    } catch (err) {
      setStatus({
        loading: false,
        success: "",
        error: err?.text || "Sending failed. Please try again.",
      });
    }
  };

  return (
    <motion.aside
      initial={{ opacity: 0, x: 22 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 22 }}
      transition={{ duration: 0.45 }}
      className="
        rounded-2xl bg-white/90 backdrop-blur
        border border-gray-200
        shadow-[0_20px_50px_rgba(0,0,0,0.08)]
        overflow-hidden
      "
    >
      <div className="h-1.5 bg-gradient-to-r from-[#2b6f99] to-[#fc7182]" />

      <div className="p-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">
              Send a message
            </h3>
            <p className="text-gray-600 text-sm mt-1">
              Your message is private. We reply to the email you provide.
            </p>
          </div>
        </div>

        {status.error ? (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {status.error}
          </div>
        ) : null}

        {status.success ? (
          <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            {status.success}
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <Field
            icon={<User className="w-4 h-4" />}
            label="Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Your name"
          />

          <Field
            icon={<Mail className="w-4 h-4" />}
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="you@example.com"
          />

          <FieldTextArea
            icon={<MessageSquare className="w-4 h-4" />}
            label="Message"
            name="message"
            value={form.message}
            onChange={handleChange}
            placeholder="How can we help?"
          />

          <div className="pt-2 flex items-center justify-between gap-3">
            <motion.button
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={!canSend || status.loading}
              className={`
                inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium text-white
                bg-gradient-to-r from-[#2b6f99] to-[#fc7182]
                shadow-lg transition
                ${!canSend || status.loading ? "opacity-50 cursor-not-allowed" : "hover:opacity-95"}
              `}
            >
              {status.loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Sending…
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Send
                </>
              )}
            </motion.button>
          </div>

          <p className="text-xs text-gray-500 pt-1">
            Discreet support only. We don’t share your information.
          </p>
        </form>
      </div>
    </motion.aside>
  );
}
