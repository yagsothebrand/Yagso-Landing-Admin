"use client";

import { useState, useEffect } from "react";

import {
  ShoppingCart,
  User,
  Heart,
  Menu,
  X,
  ChevronDown,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../cart/CartProvider";
import { Link } from "react-router-dom";

const navLinks = {
  left: ["About", "Shop", "Contact"],
  bottom: ["Earrings", "Bracelets", "Necklace", "Rings", "Collections"],
};

const Header = ({ onOpenContact }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [wishCount, setWishCount] = useState(0);
  const { setIsDrawerOpen, getCartCount, loading } = useCart();
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setCartCount(getCartCount());
  }, [getCartCount]);

  const scrollToAbout = () => {
    const section = document.querySelector("#about-section");
    if (section) section.scrollIntoView({ behavior: "smooth" });
  };

  const handleNavClick = (item) => {
    if (item === "About") scrollToAbout();
    else if (item === "Contact") onOpenContact?.();
    else if (item === "Shop") window.location.href = "/";
  };

  return (
    <header
      className={`relative left-0 right-0 bg-transparent text-black z-[9999] transition-all duration-300 ${
        scrolled ? "shadow-md" : "shadow-none"
      }`}
    >
      {/* Top Bar */}
      <div className="flex justify-between items-center h-[80px] max-w-[1200px] mx-auto px-[1rem] md:px-[2rem] lg:px-[4rem]">
        <div className="flex items-center gap-4">
          <button
            className="sm:block md:hidden lg:hidden p-2 rounded-md hover:bg-gray-200 transition"
            onClick={() => setMenuOpen(true)}
            aria-label="Open Menu"
          >
            <Menu className="w-6 h-6 text-[#133827]" />
          </button>

          {/* Desktop Nav */}
          <ul className="hidden md:flex flex-row gap-6 items-center text-[16px] font-medium">
            {navLinks.left.map((item) => (
              <li
                key={item}
                onClick={() => handleNavClick(item)}
                className="cursor-pointer relative group"
              >
                <span className="transition-colors duration-300 text-[#133827] group-hover:text-[#133827]">
                  {item}
                </span>
                <span className="absolute bottom-[-4px] left-0 w-0 h-[2px] bg-[#133827] transition-all duration-300 group-hover:w-full"></span>
              </li>
            ))}
          </ul>
        </div>

        {/* Center: Logo */}
        <Link to="/" className="block">
          <img
            src="/Yagso-logo.png"
            alt="Yagso Logo"
            className="w-[15rem] hover:opacity-90 transition"
          />
        </Link>

        {/* Right Icons */}
        <ul className="flex flex-row gap-6 items-center text-[16px]">
          <li className="relative">
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="relative p-2 hover:bg-gray-100 rounded-lg transition"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 text-[#133827] animate-spin" />
              ) : (
                <ShoppingCart className="w-5 h-5 text-[#133827]" />
              )}
              {cartCount > 0 && (
                <motion.span
                  key={cartCount}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 bg-red-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold"
                >
                  {cartCount}
                </motion.span>
              )}
            </button>
          </li>

          <li>
            <Link to="/account">
              <User className="w-5 h-5 hover:text-[#133827] text-[#133827] transition-colors duration-300" />
            </Link>
          </li>
          <li className="relative">
            <Link to="/wishlist">
              <Heart className="w-5 h-5 hover:text-red-500 text-[#133827]" />
              {wishCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#133827] text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px]">
                  {wishCount}
                </span>
              )}
            </Link>
          </li>
        </ul>
      </div>

      {/* Bottom Nav (Desktop Only) */}
      <nav className="h-[50px] hidden md:flex items-center justify-center max-w-[1200px] mx-auto">
        <ul className="flex flex-row gap-[20px] items-center text-[16px]">
          {navLinks.bottom.map((cat) => (
            <li
              key={cat}
              className="cursor-pointer hover:text-bold text-[#133827] transition-colors duration-300"
            >
              {cat}
            </li>
          ))}
        </ul>
      </nav>

      {/* Sidebar Menu (Mobile) */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[99998]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
            />
            <motion.aside
              className="fixed top-0 left-0 h-full w-[80%] sm:w-[300px] bg-[#133827] text-white z-[99999] flex flex-col p-6 gap-6"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
              <button
                className="self-end mb-2"
                onClick={() => setMenuOpen(false)}
              >
                <X className="w-6 h-6" />
              </button>

              {["Home", "About", "Shop", "Contact"].map((item) => (
                <p
                  key={item}
                  className="hover:text-[#debfad] text-lg cursor-pointer"
                  onClick={() => {
                    handleNavClick(item);
                    setMenuOpen(false);
                  }}
                >
                  {item}
                </p>
              ))}

              {/* Mobile Categories Dropdown */}
              <div className="mt-4">
                <p
                  className="text-lg mb-3 flex items-center gap-1 cursor-pointer"
                  onClick={() => setShowCategories(!showCategories)}
                >
                  Categories
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      showCategories ? "rotate-180" : ""
                    }`}
                  />
                </p>
                <AnimatePresence>
                  {showCategories && (
                    <motion.ul
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      className="flex flex-col gap-3 pl-4"
                    >
                      {navLinks.bottom.map((cat) => (
                        <li
                          key={cat}
                          className="cursor-pointer hover:text-[#debfad] transition-all duration-300"
                        >
                          {cat}
                        </li>
                      ))}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};

export { Header };
export default Header;
