import { motion } from "framer-motion";
import { Mail, Phone, MapPin, ShieldCheck, MessageCircle } from "lucide-react";

function InfoRow({ icon, label, value, hint, href }) {
  const body = (
    <div className="flex items-start gap-4 rounded-2xl border border-gray-200 bg-white/80 backdrop-blur p-4">
      <div className="text-gray-600 mt-0.5">{icon}</div>
      <div className="min-w-0">
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-gray-900 font-medium truncate">{value ? value === "08027719561" ? "08027719561, 07046109192" : value : "08027719561, 07046109192"}</p>
        {hint ? <p className="text-xs text-gray-500 mt-1">{hint}</p> : null}
      </div>
    </div>
  );

  if (!href) return body;

  return (
    <a href={href} className="block hover:opacity-90 transition">
      {body}
    </a>
  );
}

export default function ContactDetails({ showForm, onToggle }) {
  // ✅ Replace with your real details:
  const email = "support@yagso.com";
  const phone = "+2348123456789";
  const location = "Lagos, Nigeria";

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.55 }}
      className="
        rounded-2xl bg-white/85 backdrop-blur
        border border-gray-200
        shadow-[0_20px_50px_rgba(0,0,0,0.08)]
        p-8
      "
    >
      {/* top row */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="max-w-md">
          <h3 className="text-xl font-semibold text-gray-900">
            Contact details
          </h3>
          <p className="text-gray-600 mt-2">
            Discreet support and fast replies.
          </p>
        </div>
      </div>

      {/* details */}
      <div className="mt-8 space-y-4">
        <InfoRow
          icon={<Mail className="w-5 h-5" />}
          label="Email"
          value={email}
          hint="Best for questions & support"
          href={`mailto:${email}`}
        />

        <InfoRow
          icon={<Phone className="w-5 h-5" />}
          label="Phone"
          value={phone}
          hint="Weekdays • 9am – 5pm"
          href={`tel:${phone.replace(/\s/g, "")}`}
        />

        <InfoRow
          icon={<MapPin className="w-5 h-5" />}
          label="Location"
          value={location}
          hint="Fast delivery available"
        />
      </div>

      {/* privacy reassurance */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="flex items-start gap-3 rounded-2xl bg-gradient-to-r from-[#2b6f99]/8 to-[#fc7182]/8 border border-gray-200 p-4">
          <ShieldCheck className="w-5 h-5 text-gray-700 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-gray-900">
              Premium Care, Complete Privacy
            </p>
            <p className="text-sm text-gray-600 mt-1">
              We never share your information. All communication is discreet.
            </p>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-3 text-sm text-gray-600">
          <MessageCircle className="w-4 h-4" />
          <span>Tip: include your order number if it’s about delivery.</span>
        </div>
      </div>
    </motion.div>
  );
}
