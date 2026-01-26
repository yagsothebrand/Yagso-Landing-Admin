// PrivacyPolicy.jsx
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Shield, Lock, Eye, Database, UserCheck, Mail } from "lucide-react";

export default function PrivacyPolicy() {
  const navigate = useNavigate();

  const sections = [
    {
      icon: Database,
      title: "Information We Collect",
      content: [
        "Email address and phone number for order processing and communication",
        "Billing information including name, address, city, state, and postal code",
        "Order history and shopping cart data",
        "Device information and browsing activity through cookies",
        "Payment information processed securely through Paystack (we do not store card details)"
      ]
    },
    {
      icon: Eye,
      title: "How We Use Your Information",
      content: [
        "Process and fulfill your orders",
        "Send order confirmations and shipping updates via email/SMS",
        "Provide customer support and respond to inquiries",
        "Improve our products and services",
        "Personalize your shopping experience",
        "Send promotional offers (you can opt-out anytime)",
        "Detect and prevent fraud"
      ]
    },
    {
      icon: Lock,
      title: "Data Storage & Security",
      content: [
        "Your data is stored securely using Google Firebase with industry-standard encryption",
        "Cart data is stored locally in your browser and synced to our secure servers when you log in",
        "Payment processing is handled by Paystack with PCI-DSS compliance",
        "We use cookies to remember your cart and preferences",
        "Guest users are assigned a unique ID to track their cart and orders",
        "Your password is encrypted and never stored in plain text"
      ]
    },
    {
      icon: UserCheck,
      title: "Data Sharing",
      content: [
        "We DO NOT sell your personal information to third parties",
        "We share data with Paystack for payment processing only",
        "Shipping information is shared with delivery partners to fulfill orders",
        "We may share data if required by law or to protect our rights",
        "Anonymous analytics data may be used to improve our services"
      ]
    },
    {
      icon: Shield,
      title: "Your Rights",
      content: [
        "Access your personal data at any time through your account",
        "Request deletion of your account and associated data",
        "Update or correct your information",
        "Opt-out of marketing communications",
        "Export your order history",
        "Withdraw consent for data processing (may affect service availability)"
      ]
    },
    {
      icon: Mail,
      title: "Cookies & Tracking",
      content: [
        "We use cookies to remember your cart items across sessions",
        "Guest user IDs are stored in cookies for 1 year",
        "Analytics cookies help us understand how you use our site",
        "You can disable cookies in your browser, but this may affect functionality"
      ]
    }
  ];

  return (
    <div className="min-h-screen pt-20 pb-16 bg-gradient-to-br from-white via-[#f7fbff] to-[#fff5f7]">
      <div className="max-w-4xl mx-auto px-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-700 hover:text-[#fc7182] font-semibold mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-8 shadow-lg"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#2b6f99] to-[#4a8ab8] flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-[#2b6f99] to-[#fc7182] bg-clip-text text-transparent">
                Privacy Policy
              </h1>
              <p className="text-sm text-slate-600">Last updated: January 24, 2026</p>
            </div>
          </div>

          <div className="prose prose-slate max-w-none">
            <p className="text-slate-700 mb-8">
              At JustPill, we respect your privacy and are committed to protecting your personal information. 
              This Privacy Policy explains how we collect, use, store, and protect your data when you use our services.
            </p>

            <div className="space-y-6">
              {sections.map((section, index) => {
                const Icon = section.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="border-l-4 border-[#2b6f99] pl-6 py-4"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <Icon className="w-5 h-5 text-[#2b6f99]" />
                      <h2 className="text-xl font-bold text-slate-900 m-0">
                        {section.title}
                      </h2>
                    </div>
                    <ul className="space-y-2 m-0">
                      {section.content.map((item, idx) => (
                        <li key={idx} className="text-slate-700">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                );
              })}
            </div>

            <div className="mt-8 p-6 bg-gradient-to-r from-[#2b6f99]/5 to-[#fc7182]/5 rounded-xl">
              <h3 className="text-lg font-bold text-slate-900 mb-3">Contact Us</h3>
              <p className="text-slate-700 mb-2">
                If you have any questions about this Privacy Policy or how we handle your data, please contact us:
              </p>
              <ul className="text-slate-700 space-y-1">
                <li>📧 Email: privacy@justpill.com</li>
                <li>📱 Phone: +234 800 000 0000</li>
                <li>📍 Location: Lagos, Nigeria</li>
              </ul>
            </div>

            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
              <p className="text-sm text-yellow-800 m-0">
                <strong>Note:</strong> We may update this Privacy Policy from time to time. 
                We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}