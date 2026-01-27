// PrivacyPolicy.jsx
"use client";

import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Shield,
  Lock,
  Eye,
  Database,
  UserCheck,
  Mail,
} from "lucide-react";
import HeaderDesign from "@/layout/Header";
import Footer from "@/layout/Footer";

const BRAND = "#948179";
const DARK = "#0f172a";

export default function PrivacyPolicy() {
  const navigate = useNavigate();

  const sections = [
    {
      icon: Database,
      title: "Information We Collect",
      content: [
        "Email address and phone number for order processing",
        "Billing details including name and delivery address",
        "Order history and cart activity",
        "Device and browser data via cookies",
        "Payments are securely processed by Paystack — we do not store card details",
      ],
    },
    {
      icon: Eye,
      title: "How We Use Your Information",
      content: [
        "To process and deliver your orders",
        "To communicate order updates and support requests",
        "To improve our website, collections, and services",
        "To personalize your shopping experience",
        "To send curated updates (you can opt out anytime)",
      ],
    },
    {
      icon: Lock,
      title: "Data Storage & Security",
      content: [
        "Your data is securely stored using Firebase infrastructure",
        "Passwords are encrypted and never stored in plain text",
        "Payments are handled via Paystack with PCI compliance",
        "We take reasonable measures to protect against unauthorized access",
      ],
    },
    {
      icon: UserCheck,
      title: "Data Sharing",
      content: [
        "We do not sell or rent your personal information",
        "Shipping data is shared only with delivery partners",
        "Payment details are shared only with Paystack",
        "We may disclose information if required by law",
      ],
    },
    {
      icon: Shield,
      title: "Your Rights",
      content: [
        "Access and update your account information",
        "Request deletion of your data",
        "Opt out of marketing communications",
        "Request a copy of your order history",
      ],
    },
    {
      icon: Mail,
      title: "Cookies",
      content: [
        "Cookies help us remember your cart and preferences",
        "Guest sessions are stored temporarily",
        "Disabling cookies may affect site functionality",
      ],
    },
  ];

  return (
    <>
      <HeaderDesign />
      <div className="min-h-screen pt-20 md:pt-36 pb-24 bg-[#fbfaf8]">
        <div className="max-w-[820px] mx-auto px-4">
          {/* Back */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-xs tracking-[0.14em] uppercase mb-10 transition"
            style={{ color: BRAND }}
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          {/* Card */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="bg-white border rounded-sm p-10"
            style={{ borderColor: `${BRAND}33` }}
          >
            {/* Header */}
            <div className="mb-12">
              <p
                className="text-xs tracking-[0.18em] uppercase mb-2"
                style={{ color: BRAND }}
              >
                Legal
              </p>

              <h1
                className="text-[32px] md:text-[38px] leading-tight font-serif mb-3"
                style={{ color: DARK }}
              >
                Privacy Policy
              </h1>

              <p className="text-sm text-slate-500">
                Last updated: January 24, 2026
              </p>
            </div>

            {/* Intro */}
            <p className="text-[15px] leading-relaxed text-slate-700 mb-14 max-w-prose">
              At YAGSO, your privacy matters. This policy explains how we
              collect, use, and protect your personal information when you
              interact with our website and services.
            </p>

            {/* Sections */}
            <div className="space-y-14">
              {sections.map((section, index) => {
                const Icon = section.icon;

                return (
                  <motion.section
                    key={index}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.06 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4" style={{ color: BRAND }} />
                      <h2
                        className="text-[16px] font-semibold tracking-wide"
                        style={{ color: DARK }}
                      >
                        {section.title}
                      </h2>
                    </div>

                    <ul className="space-y-2 pl-7 list-disc text-[14px] text-slate-700">
                      {section.content.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>

                    <div
                      className="pt-6 border-b"
                      style={{ borderColor: `${BRAND}26` }}
                    />
                  </motion.section>
                );
              })}
            </div>

            {/* Contact */}
            <div className="mt-14">
              <h3
                className="text-[14px] font-semibold tracking-wide mb-3"
                style={{ color: DARK }}
              >
                Contact
              </h3>

              <p className="text-[14px] text-slate-700 max-w-prose">
                For questions regarding this Privacy Policy or your data, please
                contact us:
              </p>

              <ul className="mt-4 space-y-1 text-[14px] text-slate-700">
                <li>Email: support@yagso.com</li>
                <li>Phone: +234 915 348 0722</li>
                <li>Lagos, Nigeria</li>
              </ul>
            </div>

            {/* Note */}
            <div className="mt-12 text-xs text-slate-500">
              This policy may be updated periodically. Continued use of our
              website constitutes acceptance of any changes.
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </>
  );
}
