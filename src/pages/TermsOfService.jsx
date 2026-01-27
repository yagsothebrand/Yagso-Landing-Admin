// TermsOfService.jsx
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  FileText,
  Shield,
  ShoppingCart,
  Package,
  CreditCard,
  AlertTriangle,
  Scale,
} from "lucide-react";
import Header from "@/layout/Header";

import HeaderDesign from "@/layout/Header";
import Footer from "@/layout/Footer";

const BRAND = "#948179";
const DARK = "#0f172a";

export default function TermsOfService() {
  const navigate = useNavigate();

  const sections = [
    {
      icon: FileText,
      title: "Acceptance of Terms",
      content: [
        "By accessing and using JustPill, you accept and agree to be bound by these Terms of Service.",
        "If you do not agree to these terms, please do not use our services.",
        "We reserve the right to modify these terms at any time.",
        "Continued use of the service constitutes acceptance of updated terms.",
      ],
    },
    {
      icon: ShoppingCart,
      title: "Use of Service",
      content: [
        "You must be at least 18 years old to make purchases.",
        "You are responsible for maintaining the confidentiality of your account.",
        "You agree to provide accurate and complete information.",
        "You may not use the service for any illegal or unauthorized purpose.",
        "We reserve the right to refuse service to anyone for any reason.",
      ],
    },
    {
      icon: Package,
      title: "Orders & Products",
      content: [
        "All product descriptions and prices are subject to change without notice.",
        "We reserve the right to limit quantities or refuse orders.",
        "Product images are for illustration purposes and may vary from actual items.",
        "We strive to display accurate colors, but cannot guarantee exact color representation.",
        "Custom or personalized items may have longer processing times.",
      ],
    },
    {
      icon: CreditCard,
      title: "Pricing & Payment",
      content: [
        "All prices are in Nigerian Naira (NGN) unless otherwise stated.",
        "Prices include applicable taxes where required.",
        "Payment is processed securely through Paystack.",
        "We do not store your credit card information.",
        "Failed payments may result in order cancellation.",
        "Promotional codes and discounts cannot be combined unless stated.",
      ],
    },
    {
      icon: Package,
      title: "Shipping & Delivery",
      content: [
        "We offer free delivery on all orders nationwide.",
        "Delivery times are estimates and not guaranteed.",
        "You are responsible for providing accurate shipping information.",
        "We are not liable for delays caused by courier services or unforeseen circumstances.",
        "Risk of loss transfers to you upon delivery to the specified address.",
      ],
    },
    {
      icon: AlertTriangle,
      title: "Returns & Refunds",
      content: [
        "Returns are accepted within 7 days of delivery for unopened items.",
        "Custom or personalized items cannot be returned unless defective.",
        "Refunds will be processed to the original payment method.",
        "Shipping costs are non-refundable unless the return is due to our error.",
        "Please contact customer support to initiate a return.",
      ],
    },
    {
      icon: Scale,
      title: "Limitation of Liability",
      content: [
        "We are not liable for any indirect, incidental, or consequential damages.",
        "Our total liability shall not exceed the amount paid for the product.",
        "We do not guarantee uninterrupted or error-free service.",
        "You use the service at your own risk.",
        "Some jurisdictions do not allow limitation of liability, so these may not apply to you.",
      ],
    },
    {
      icon: Shield,
      title: "Intellectual Property",
      content: [
        "All content on this site is owned by JustPill or its licensors.",
        "You may not copy, reproduce, or distribute our content without permission.",
        "Product names and logos are trademarks of their respective owners.",
        "User-generated content (reviews, photos) grants us license to use.",
      ],
    },
  ];

  return (
    <>
      <HeaderDesign />
      <div className="min-h-screen pt-20 md:pt-36 pb-24 bg-[#fbfaf8]">
        <div className="max-w-[820px] mx-auto px-4">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-xs tracking-[0.14em] uppercase mb-10 transition"
            style={{ color: BRAND }}
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          {/* Card Container */}
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
                Terms of Service
              </h1>

              <p className="text-sm text-slate-500">
                Last updated: January 24, 2026
              </p>
            </div>

            {/* Introduction */}
            <p className="text-[15px] leading-relaxed text-slate-700 mb-14 max-w-prose">
              Welcome to JustPill. These Terms of Service govern your use of our
              website and services. Please read them carefully before making a
              purchase or using our platform.
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

            {/* Governing Law */}
            <div className="mt-14">
              <h3
                className="text-[14px] font-semibold tracking-wide mb-3"
                style={{ color: DARK }}
              >
                Governing Law
              </h3>
              <p className="text-[14px] text-slate-700 max-w-prose">
                These Terms shall be governed by and construed in accordance
                with the laws of the Federal Republic of Nigeria, without regard
                to its conflict of law provisions.
              </p>
            </div>

            {/* Contact */}
            <div className="mt-12">
              <h3
                className="text-[14px] font-semibold tracking-wide mb-3"
                style={{ color: DARK }}
              >
                Contact Us
              </h3>
              <p className="text-[14px] text-slate-700 max-w-prose mb-4">
                If you have any questions about these Terms of Service, please
                contact us:
              </p>
              <ul className="space-y-1 text-[14px] text-slate-700 max-w-prose">
                <li>Email: support@justpill.com.ng</li>
                <li>Phone: +234 800 000 0000</li>
                <li>Lagos, Nigeria</li>
              </ul>
            </div>

            {/* Agreement Note */}
            <div
              className="mt-12 text-xs text-slate-500 max-w-prose"
              style={{ fontStyle: "italic" }}
            >
              By using JustPill, you acknowledge that you have read, understood,
              and agree to be bound by these Terms of Service and our Privacy
              Policy.
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </>
  );
}
