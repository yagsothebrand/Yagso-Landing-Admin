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
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

export default function ReturnAndRefundPolicy() {
  return (
    <motion.section
      variants={container}
      initial="hidden"
      animate="visible"
      className="max-w-4xl mx-auto px-4 py-16 text-[#c4a68f]"
    >
      {/* Header */}
      <motion.div variants={item} className="mb-10">
        <h1 className="text-3xl md:text-4xl font-semibold tracking-wide mb-2">
          Return & Refund Policy
        </h1>
        <p className="text-sm text-[#c4a68f]/70">
          Last updated: 2nd November 2025
        </p>
        <div className="mt-4 h-px w-24 bg-[#c4a68f]/40" />
      </motion.div>

      {/* Intro */}
      <motion.p variants={item} className="mb-4">
        Thank you for shopping at <strong>YAGSO</strong>.
      </motion.p>

      <motion.p variants={item} className="mb-6">
        If for any reason you are not completely satisfied with your purchase,
        we invite you to review our policy on returns and refunds.
      </motion.p>

      <motion.p variants={item} className="mb-10">
        The following terms apply to all products purchased from
        <strong> yagso.com</strong>.
      </motion.p>

      {/* Definitions Card */}
      <motion.div
        variants={item}
        className="border border-[#c4a68f]/30 rounded-2xl p-6 mb-12 bg-[#c4a68f]/5"
      >
        <h2 className="text-xl font-semibold mb-4">
          Interpretation & Definitions
        </h2>

        <p className="mb-4 text-sm leading-relaxed">
          Words with capitalized initial letters have meanings defined under the
          following conditions and apply regardless of singular or plural usage.
        </p>

        <ul className="list-disc pl-6 space-y-2 text-sm">
          <li>
            <strong>Company</strong> refers to YAGSO.
          </li>
          <li>
            <strong>Goods</strong> refer to fine jewelry items offered for sale.
          </li>
          <li>
            <strong>Orders</strong> mean a request to purchase Goods from us.
          </li>
          <li>
            <strong>Service</strong> refers to the Website.
          </li>
          <li>
            <strong>Website</strong> refers to YAGSO, accessible via yagso.com.
          </li>
          <li>
            <strong>You</strong> refers to the individual or entity using the
            Service.
          </li>
        </ul>
      </motion.div>

      {/* Cancellation */}
      <motion.div variants={item} className="mb-12">
        <h2 className="text-xl font-semibold mb-3">
          Order Cancellation Rights
        </h2>
        <p className="mb-4">
          You may request a return or cancellation within{" "}
          <strong>7 days</strong> of receiving your order, provided the item is
          unused, unworn, and in its original packaging.
        </p>
        <p className="text-sm text-[#c4a68f]/80">
          The return window expires 7 days from the date of delivery or
          collection by a designated third party.
        </p>
      </motion.div>

      {/* Contact */}
      <motion.div variants={item} className="border-t border-[#c4a68f]/30 pt-8">
        <h2 className="text-xl font-semibold mb-4">Contact Us</h2>
        <p className="mb-4 text-sm">
          If you have any questions regarding this policy, please reach out to
          us:
        </p>

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
