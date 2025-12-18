"use client";

import React from "react";
import { motion } from "framer-motion";

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
};

const item = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0 },
};

export default function TermsOfService() {
  return (
    <motion.section
      variants={container}
      initial="hidden"
      animate="visible"
      className="max-w-4xl mx-auto px-4 py-16 text-[#c4a68f]"
    >
      {/* Header */}
      <motion.div variants={item} className="mb-12">
        <h1 className="text-3xl md:text-4xl font-semibold tracking-wide mb-2">
          Terms of Service
        </h1>
        <p className="text-sm text-[#c4a68f]/70">
          Last updated: 2nd November 2025
        </p>
        <div className="mt-4 h-px w-24 bg-[#c4a68f]/40" />
      </motion.div>

      {/* Shipping */}
      <motion.div
        variants={item}
        className="border border-[#c4a68f]/20 rounded-2xl p-6 mb-12"
      >
        <h2 className="text-xl font-semibold mb-4">Shipping & Deliveries</h2>

        <p className="mb-4">
          YAGSO aims to dispatch most orders within{" "}
          <strong>7–15 working days</strong>, subject to item availability,
          stock levels, and customer specifications.
        </p>

        <p className="mb-4">
          A valid contact phone number and email address are required for all
          shipments. Missing or incorrect details may cause delays.
        </p>

        <ul className="list-disc pl-6 space-y-2 mb-4 text-sm">
          <li>
            <strong>Lagos:</strong> Same-day delivery after courier pickup,
            subject to confirmation.
          </li>
          <li>
            <strong>Outside Lagos:</strong> 1–3 working days via DHL or similar
            courier.
          </li>
          <li>
            <strong>International:</strong> 3–5 working days via DHL, depending
            on destination.
          </li>
        </ul>

        <p className="text-sm mb-3">
          Some international orders are shipped on a{" "}
          <strong>DDU (Delivery Duties Unpaid)</strong> basis. Any customs
          duties or taxes are the customer’s responsibility.
        </p>

        <p className="text-sm text-[#c4a68f]/80">
          Refused or unsuccessful deliveries due to customer unavailability will
          be returned to YAGSO, and additional charges may apply.
        </p>
      </motion.div>

      {/* Returns */}
      <motion.div variants={item} className="mb-12">
        <h2 className="text-xl font-semibold mb-4">
          Exchanges, Returns & Refunds
        </h2>

        <p className="mb-4">
          YAGSO does not offer refunds except for damaged or faulty merchandise.
          Customers are encouraged to review all product details carefully
          before purchasing.
        </p>

        <p className="mb-4">
          Exchanges are available for <strong>full-price items only</strong>{" "}
          within <strong>7 days</strong> of delivery, subject to availability.
        </p>

        <p className="mb-4">
          Custom-made or personalized jewelry pieces are{" "}
          <strong>not eligible</strong> for returns or exchanges.
        </p>

        <p className="text-sm text-[#c4a68f]/80">
          Sale and promotional items are final sale.
        </p>
      </motion.div>

      {/* Exchange Conditions */}
      <motion.div
        variants={item}
        className="border border-[#c4a68f]/20 rounded-2xl p-6 mb-12 bg-[#c4a68f]/5"
      >
        <h3 className="text-lg font-medium mb-3">Exchange Conditions</h3>
        <ul className="list-disc pl-6 space-y-2 text-sm">
          <li>Items must be returned within 7 working days.</li>
          <li>Items must be unworn, unused, and unaltered.</li>
          <li>Original packaging and tags must be intact.</li>
          <li>Return shipping costs are the customer’s responsibility.</li>
        </ul>
      </motion.div>

      {/* Damaged Goods */}
      <motion.div variants={item} className="mb-12">
        <h2 className="text-xl font-semibold mb-4">Damaged Goods</h2>
        <p className="mb-4">
          If a damaged or faulty item is received, please notify us within{" "}
          <strong>2 business days</strong> of delivery with your order number
          and images.
        </p>
        <p className="text-sm text-[#c4a68f]/80">
          Approved replacements will be shipped at no extra cost. If
          unavailable, a credit note or refund may be issued.
        </p>
      </motion.div>

      {/* Sales & Cancellation */}
      <motion.div variants={item} className="mb-12">
        <h2 className="text-xl font-semibold mb-4">Sales & Cancellations</h2>
        <p className="mb-4">
          During sale periods, processing may take{" "}
          <strong>10–21 working days</strong>.
        </p>
        <p className="mb-4">
          Sale items are final sale and not eligible for returns, exchanges, or
          alterations.
        </p>
        <p className="text-sm text-[#c4a68f]/80">
          Once an order is placed on yagso.com, it is final and cannot be
          cancelled.
        </p>
      </motion.div>
      {/* Payment Methods */}
      <motion.div variants={item} className="mb-12">
        <h2 className="text-xl font-semibold mb-4">Payment Methods</h2>

        <p className="mb-4">
          YAGSO currently accepts payments through the following methods only:
        </p>

        <ul className="list-disc pl-6 space-y-2 text-sm mb-4">
          <li>
            <strong>Paystack</strong> — secure online payments via debit or
            credit card.
          </li>
          <li>
            <strong>Direct Bank Transfer</strong> — Zenith Bank
            <div className="mt-1 text-[#c4a68f]/80">
              Account Number: <strong>1310626056</strong>
              <br />
              Bank Name: <strong>Zenith Bank</strong>
            </div>
          </li>
        </ul>

        <p className="text-sm text-[#c4a68f]/80">
          Orders paid via bank transfer will be processed only after payment has
          been confirmed. Customers are responsible for ensuring accurate
          payment details and reference information. Send an email to info@yagso.com
        </p>
      </motion.div>

      {/* Contact */}
      <motion.div variants={item} className="border-t border-[#c4a68f]/30 pt-8">
        <h2 className="text-xl font-semibold mb-4">Contact Us</h2>
        <ul className="space-y-2 text-sm">
          <li>
            Email:{" "}
            <a
              href="mailto:support@yagso.com"
              className="underline hover:opacity-80"
            >
              support@yagso.com
            </a>
          </li>
          <li>
            Website:{" "}
            <a
              href="https://yagso.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:opacity-80"
            >
              yagso.com
            </a>
          </li>
        </ul>
      </motion.div>
    </motion.section>
  );
}
