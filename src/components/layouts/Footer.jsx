"use client";
import React from "react";
import { motion } from "framer-motion";
import { Instagram, Facebook, Twitter, Youtube } from "lucide-react";

const Footer = () => {
  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <footer className="bg-[#debfad] text-[#133827] py-[80px] px-[2rem] md:px-[4rem] lg:px-[6rem] max-w-[1200px] mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* 🪞 Logo & Text */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex flex-col items-start gap-4"
        >
          <img className="w-[8rem]" src="/Yagso-logo.png" alt="Yagso logo" />
          <p className="text-[17px] leading-relaxed max-w-[280px]">
            Experience the art of luxury jewelry, where every piece tells a
            story of elegance and sophistication.
          </p>
        </motion.div>

        {/* 🌐 Socials */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex flex-col gap-4"
        >
          <h3 className="text-lg font-semibold">Follow Us</h3>
          <div className="flex gap-4">
            <motion.a
              href="#"
              whileHover={{ scale: 1.2 }}
              className="bg-[#133827] text-[#debfad] p-2 rounded-full"
            >
              <Instagram size={20} />
            </motion.a>
            <motion.a
              href="#"
              whileHover={{ scale: 1.2 }}
              className="bg-[#133827] text-[#debfad] p-2 rounded-full"
            >
              <Facebook size={20} />
            </motion.a>
            <motion.a
              href="#"
              whileHover={{ scale: 1.2 }}
              className="bg-[#133827] text-[#debfad] p-2 rounded-full"
            >
              <Twitter size={20} />
            </motion.a>
            <motion.a
              href="#"
              whileHover={{ scale: 1.2 }}
              className="bg-[#133827] text-[#debfad] p-2 rounded-full"
            >
              <Youtube size={20} />
            </motion.a>
          </div>
        </motion.div>

        {/* 💎 Mini Gallery */}
        {/* <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <h3 className="text-lg font-semibold mb-4">Our Collection</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              "/hijabibg.JPG",
              "/necklace-noodles.jpeg",
              "/rings-collect.jpg",
              "/newsletter-bg.jpg",
            ].map((src, i) => (
              <motion.img
                key={i}
                src={src}
                alt={`gallery-${i}`}
                className="w-full h-[100px] object-cover rounded-lg"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 120 }}
              />
            ))}
          </div>
        </motion.div> */}

        {/* 📨 Newsletter */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex flex-col gap-4"
        >
          <h3 className="text-lg font-semibold">Join Our Newsletter</h3>
          <p className="text-sm">
            Get the latest drops and exclusive offers straight to your inbox.
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              alert("Subscribed ✅");
            }}
            className="flex flex-col gap-3"
          >
            <input
              type="email"
              required
              placeholder="Enter your email"
              className="flex-1 p-3 rounded-lg border border-[#133827] bg-white/60 placeholder:text-[#133827]/70 focus:outline-none focus:ring-2 focus:ring-[#133827]"
            />
            <button
              type="submit"
              className="bg-[#133827] text-[#debfad] px-5 py-3 rounded-lg hover:bg-[#1b4e36] transition-all duration-200"
            >
              Subscribe
            </button>
          </form>
        </motion.div>
      </div>

      {/* 🧩 Divider */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="w-full border-t border-[#133827] mt-10 pt-4 text-center"
      >
        <p className="text-sm">&copy; 2025 YAGSO. All rights reserved.</p>
      </motion.div>
    </footer>
  );
};

export default Footer;
