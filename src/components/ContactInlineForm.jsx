// ContactInlineForm.jsx (collapsible form body + better success UX)
// Requires shadcn: Card, Button, Input, Textarea, Collapsible, CollapsibleTrigger, CollapsibleContent, Separator
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import emailjs from "emailjs-com";
import { Send, CheckCircle2, AlertCircle, ChevronDown, Copy } from "lucide-react";
import { useAuth } from "./auth/AuthProvider";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";

const BRAND = "#948179";
const BORDER = `${BRAND}26`;

/* ✅ EmailJS ENV */
const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

function starterFor(id) {
  if (id === "phone") return "Hi YAGSO, I have a quick question:\n";
  if (id === "hours") return "Hi YAGSO, please confirm your working hours:\n";
  if (id === "response") return "Hi YAGSO, I want to ask about response time:\n";
  return "Hi YAGSO, I need help with:\n";
}

export default function ContactInlineForm({ selected }) {
  const { user } = useAuth();

  const starter = useMemo(() => starterFor(selected?.id), [selected?.id]);

  const [formOpen, setFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: user?.email || "",
    message: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // null | success | error
  const [successMeta, setSuccessMeta] = useState(null); // { email, ts }

  useEffect(() => {
    if (user?.email) setFormData((p) => ({ ...p, email: user.email }));
  }, [user?.email]);

  // inject starter only if message empty
  useEffect(() => {
    setFormData((p) => {
      if (p.message?.trim()) return p;
      return { ...p, message: starter };
    });
  }, [starter]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const resetStatusSoon = () => {
    // auto-clear success after a bit (keeps UI tidy)
    window.clearTimeout(resetStatusSoon._t);
    resetStatusSoon._t = window.setTimeout(() => {
      setSubmitStatus(null);
      setSuccessMeta(null);
    }, 6000);
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.email || !formData.message) return;

    setIsLoading(true);
    setSubmitStatus(null);
    setSuccessMeta(null);

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
      setSuccessMeta({
        email: formData.email,
        ts: new Date().toLocaleString(),
      });

      // collapse form after success to save space
      setFormOpen(false);

      // keep message starter, clear name only
      setFormData((p) => ({ ...p, name: "", message: starter }));
      resetStatusSoon();
    } catch (err) {
      console.error("EmailJS error:", err);
      setSubmitStatus("error");
    } finally {
      setIsLoading(false);
    }
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText("support@yagso.com");
    } catch {}
  };

  return (
    <Card className="rounded-sm border bg-white" style={{ borderColor: BORDER }}>
      {/* Header row */}
      <div className="p-4 md:p-5 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[10px] tracking-[0.18em] uppercase font-semibold text-slate-500">
            Send a message
          </p>
          <p className="text-sm text-slate-600 mt-1">
            Topic:{" "}
            <span className="font-semibold text-slate-900">
              {selected?.label || "Email"}
            </span>
          </p>
        </div>

        <Collapsible open={formOpen} onOpenChange={setFormOpen}>
          <CollapsibleTrigger asChild>
            <Button
              variant="outline"
              className="h-9 rounded-sm bg-white"
              style={{ borderColor: BORDER }}
              type="button"
            >
              <span className="text-xs font-semibold">
                {formOpen ? "Hide" : "Write"}
              </span>
              <ChevronDown
                className={cx(
                  "w-4 h-4 ml-2 transition-transform",
                  formOpen ? "rotate-180" : "",
                )}
                style={{ color: BRAND }}
              />
            </Button>
          </CollapsibleTrigger>
        </Collapsible>
      </div>

      {/* Status banner (stays visible even when form is collapsed) */}
      <AnimatePresence>
        {submitStatus === "success" && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="px-4 md:px-5 pb-4"
          >
            <div
              className="border bg-[#fffdfb] rounded-sm p-3 flex items-start justify-between gap-3"
              style={{ borderColor: BORDER }}
            >
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 mt-0.5" style={{ color: BRAND }} />
                <div className="text-sm">
                  <p className="font-semibold text-slate-900">Message sent.</p>
                  <p className="text-slate-600 text-xs mt-1">
                    We’ll reply to{" "}
                    <span className="font-semibold text-slate-900">
                      {successMeta?.email}
                    </span>{" "}
                    within{" "}
                    <span className="font-semibold text-slate-900">24–48h</span>.
                  </p>
                  <p className="text-slate-500 text-[11px] mt-1">
                    Sent: {successMeta?.ts}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Button
                  variant="outline"
                  className="h-9 rounded-sm bg-white"
                  style={{ borderColor: BORDER }}
                  onClick={copyEmail}
                  type="button"
                >
                  <Copy className="w-4 h-4 mr-2" style={{ color: BRAND }} />
                  <span className="text-xs font-semibold">Copy email</span>
                </Button>

                <Button
                  className="h-9 rounded-sm text-white"
                  style={{ backgroundColor: BRAND }}
                  onClick={() => {
                    setSubmitStatus(null);
                    setSuccessMeta(null);
                    setFormOpen(true);
                  }}
                  type="button"
                >
                  <span className="text-xs font-semibold">New message</span>
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {submitStatus === "error" && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="px-4 md:px-5 pb-4"
          >
            <div className="border border-red-200 bg-red-50 rounded-sm p-3 flex items-center gap-2 text-sm font-semibold text-red-700">
              <AlertCircle className="w-4 h-4" />
              Failed to send. Please try again.
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Separator style={{ backgroundColor: BORDER }} />

      {/* Collapsible form body */}
      <Collapsible open={formOpen} onOpenChange={setFormOpen}>
        <CollapsibleContent asChild>
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <div className="p-4 md:p-5 grid gap-3">
              <div className="grid md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] tracking-[0.18em] uppercase font-semibold text-slate-500 mb-1.5">
                    Full name
                  </label>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={onChange}
                    className="h-10 rounded-sm bg-[#fffdfb]"
                    style={{ borderColor: BORDER }}
                    placeholder="Your full name"
                  />
                </div>

                <div>
                  <label className="block text-[10px] tracking-[0.18em] uppercase font-semibold text-slate-500 mb-1.5">
                    Email
                  </label>
                  <Input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={onChange}
                    className="h-10 rounded-sm bg-[#fffdfb]"
                    style={{ borderColor: BORDER }}
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] tracking-[0.18em] uppercase font-semibold text-slate-500 mb-1.5">
                  Message
                </label>
                <Textarea
                  name="message"
                  value={formData.message}
                  onChange={onChange}
                  rows={6}
                  className="rounded-sm bg-[#fffdfb] leading-relaxed"
                  style={{ borderColor: BORDER }}
                  placeholder="Tell us how we can help…"
                />
                <p className="mt-2 text-xs text-slate-500">
                  Add your <span className="font-semibold">Order ID</span> (if any) for faster help.
                </p>
              </div>

              <div className="flex items-center justify-end">
                <motion.div whileHover={{ y: -1 }} whileTap={{ scale: 0.99 }}>
                  <Button
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="h-10 rounded-sm text-white font-semibold"
                    style={{ backgroundColor: BRAND }}
                  >
                    <Send className="w-4 h-4 mr-2" />
                    {isLoading ? "Sending..." : "Send"}
                  </Button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}

function cx(...c) {
  return c.filter(Boolean).join(" ");
}
