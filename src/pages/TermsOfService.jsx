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
import { Footer } from "react-day-picker";

export default function TermsOfService() {
  const navigate = useNavigate();

  const sections = [
    {
      icon: FileText,
      title: "Acceptance of Terms",
      content: [
        "By accessing and using JustPill, you accept and agree to be bound by these Terms of Service",
        "If you do not agree to these terms, please do not use our services",
        "We reserve the right to modify these terms at any time",
        "Continued use of the service constitutes acceptance of updated terms",
      ],
    },
    {
      icon: ShoppingCart,
      title: "Use of Service",
      content: [
        "You must be at least 18 years old to make purchases",
        "You are responsible for maintaining the confidentiality of your account",
        "You agree to provide accurate and complete information",
        "You may not use the service for any illegal or unauthorized purpose",
        "We reserve the right to refuse service to anyone for any reason",
      ],
    },
    {
      icon: Package,
      title: "Orders & Products",
      content: [
        "All product descriptions and prices are subject to change without notice",
        "We reserve the right to limit quantities or refuse orders",
        "Product images are for illustration purposes and may vary from actual items",
        "We strive to display accurate colors, but cannot guarantee exact color representation",
        "Custom/personalized items may have longer processing times",
      ],
    },
    {
      icon: CreditCard,
      title: "Pricing & Payment",
      content: [
        "All prices are in Nigerian Naira (NGN) unless otherwise stated",
        "Prices include applicable taxes where required",
        "Payment is processed securely through Paystack",
        "We do not store your credit card information",
        "Failed payments may result in order cancellation",
        "Promotional codes and discounts cannot be combined unless stated",
      ],
    },
    {
      icon: Package,
      title: "Shipping & Delivery",
      content: [
        "We offer free delivery on all orders nationwide",
        "Delivery times are estimates and not guaranteed",
        "You are responsible for providing accurate shipping information",
        "We are not liable for delays caused by courier services or unforeseen circumstances",
        "Risk of loss transfers to you upon delivery to the specified address",
      ],
    },
    {
      icon: AlertTriangle,
      title: "Returns & Refunds",
      content: [
        "Returns are accepted within 7 days of delivery for unopened items",
        "Custom/personalized items cannot be returned unless defective",
        "Refunds will be processed to the original payment method",
        "Shipping costs are non-refundable unless the return is due to our error",
        "Please contact customer support to initiate a return",
      ],
    },
    {
      icon: Scale,
      title: "Limitation of Liability",
      content: [
        "We are not liable for any indirect, incidental, or consequential damages",
        "Our total liability shall not exceed the amount paid for the product",
        "We do not guarantee uninterrupted or error-free service",
        "You use the service at your own risk",
        "Some jurisdictions do not allow limitation of liability, so these may not apply to you",
      ],
    },
    {
      icon: Shield,
      title: "Intellectual Property",
      content: [
        "All content on this site is owned by JustPill or its licensors",
        "You may not copy, reproduce, or distribute our content without permission",
        "Product names and logos are trademarks of their respective owners",
        "User-generated content (reviews, photos) grants us license to use",
      ],
    },
  ];

  return (
    <>
      <Header />
      <div className="min-h-screen pt-28 md:pt-44 pb-16 bg-gradient-to-br from-white via-[#f7fbff] to-[#fff5f7]">
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
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-[#2b6f99] to-[#fc7182] bg-clip-text text-transparent">
                  Terms of Service
                </h1>
                <p className="text-sm text-slate-600">
                  Last updated: January 24, 2026
                </p>
              </div>
            </div>

            <div className="prose prose-slate max-w-none">
              <p className="text-slate-700 mb-8">
                Welcome to JustPill. These Terms of Service govern your use of
                our website and services. Please read them carefully before
                making a purchase or using our platform.
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
                      className="border-l-4 border-[#fc7182] pl-6 py-4"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <Icon className="w-5 h-5 text-[#fc7182]" />
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
                <h3 className="text-lg font-bold text-slate-900 mb-3">
                  Governing Law
                </h3>
                <p className="text-slate-700">
                  These Terms shall be governed by and construed in accordance
                  with the laws of the Federal Republic of Nigeria, without
                  regard to its conflict of law provisions.
                </p>
              </div>

              <div className="mt-6 p-6 bg-gradient-to-r from-[#2b6f99]/5 to-[#fc7182]/5 rounded-xl">
                <h3 className="text-lg font-bold text-slate-900 mb-3">
                  Contact Us
                </h3>
                <p className="text-slate-700 mb-2">
                  If you have any questions about these Terms of Service, please
                  contact us:
                </p>
                <ul className="text-slate-700 space-y-1">
                  <li>📧 Email: support@justpill.com.ng</li>
                  <li>📱 Phone: +234 800 000 0000</li>
                  <li>📍 Location: Lagos, Nigeria</li>
                </ul>
              </div>

              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                <p className="text-sm text-blue-800 m-0">
                  <strong>Agreement:</strong> By using JustPill, you acknowledge
                  that you have read, understood, and agree to be bound by these
                  Terms of Service and our Privacy Policy.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </>
  );
}
