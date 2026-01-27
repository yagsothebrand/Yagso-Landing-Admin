import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, User, X, ChevronDown, LogOut, ShoppingBag } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useProducts } from "@/components/auth/ProductsProvider";
import { useAuth } from "@/components/auth/AuthProvider";
import CartSidebar from "@/components/CartDrawer";

const cx = (...c) => c.filter(Boolean).join(" ");
const BRAND = "#948179";

function getCatFromSearch(search) {
  try {
    const params = new URLSearchParams(search || "");
    return params.get("cat") || "";
  } catch {
    return "";
  }
}

export default function HeaderDesign() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showCategories, setShowCategories] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const { getCartCount, clearGuestCart } = useProducts();
  const { user, logout, isAdmin } = useAuth();
  const cartCount = getCartCount();

  const navLinks = useMemo(
    () => ({
      left: [
        { label: "Home", path: "/" },
        // { label: "About", path: "/about" },
        { label: "Shop", path: "/shop" },
        { label: "Contact", path: "/contact" },
        { label: "Blog", path: "/blog" },
      ],
      bottom: [
        { label: "Rings", path: "/shop?cat=rings", cat: "rings" },
        { label: "Necklaces", path: "/shop?cat=necklaces", cat: "necklaces" },
        { label: "Sets", path: "/shop?cat=sets", cat: "sets" },
        { label: "Earrings", path: "/shop?cat=earrings", cat: "earrings" },
        { label: "Bracelets", path: "/shop?cat=bracelets", cat: "bracelets" },
        { label: "New Arrivals", path: "/shop?cat=new", cat: "new" },
      ],
    }),
    [],
  );

  // ✅ close drawer on route change (prevents stuck drawer)
  useEffect(() => {
    setMenuOpen(false);
    setShowCategories(false);
  }, [location.pathname, location.search]);

  // ✅ lock body scroll when drawer open
  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [menuOpen]);

  const activeCat = getCatFromSearch(location.search);

  const isActive = (path) => {
    // exact pathname match
    if (!path.includes("?")) return location.pathname === path;

    // for /shop?cat=... treat active by cat only
    const [pathname, qs] = path.split("?");
    if (location.pathname !== pathname) return false;

    const want = getCatFromSearch("?" + (qs || ""));
    return want && want === activeCat;
  };

  const handleLogout = async () => {
    try {
      // if your logout expects a callback, keep it; if not, harmless.
      await logout?.(clearGuestCart);
      clearGuestCart?.(); // ✅ make sure guest cart is cleared
      toast.success("Logged out successfully");
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to log out");
    }
  };

  const go = (path) => navigate(path);

  return (
    <header className="fixed left-0 right-0 top-0 z-[9999]">
      {/* Top bar */}
      <div
        className="backdrop-blur-md bg-white/40 border-b"
        style={{ borderColor: `${BRAND}33` }}
      >
        <div className="max-w-[1200px] mx-auto px-4 lg:px-10 h-[64px] flex items-center justify-between">
          {/* Left */}
          <div className="flex items-center gap-3">
            <button
              className="md:hidden p-2 border rounded-sm transition"
              style={{ borderColor: `${BRAND}33` }}
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" style={{ color: BRAND }} />
            </button>

            {/* Desktop nav */}
            <ul className="hidden md:flex items-center gap-6 text-[13px] tracking-[0.14em] uppercase">
              {navLinks.left.map((item) => (
                <li key={item.path} className="relative group">
                  <Link
                    to={item.path}
                    className={cx(
                      "transition",
                      isActive(item.path)
                        ? "text-slate-900"
                        : "text-[#948179] hover:text-slate-900",
                    )}
                  >
                    {item.label}
                  </Link>

                  <span
                    className={cx(
                      "absolute -bottom-2 left-0 h-[1px] transition-all duration-300",
                      isActive(item.path)
                        ? "w-full opacity-100"
                        : "w-0 opacity-0 group-hover:w-full group-hover:opacity-100",
                    )}
                    style={{ backgroundColor: BRAND }}
                  />
                </li>
              ))}
            </ul>
          </div>

          {/* Logo (use ONE asset) */}
          <Link to="/" className="shrink-0">
            <img
              src="/logs.png"
              alt="Yagso"
              className="w-[8rem] object-contain"
            />
          </Link>

          {/* Right */}
          <div className="flex items-center gap-3">
            {/* Cart */}
            <div className="relative">
              <CartSidebar />
              {cartCount > 0 && (
                <span
                  className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 text-white text-[11px] font-bold flex items-center justify-center rounded-sm"
                  style={{ backgroundColor: BRAND }}
                >
                  {cartCount}
                </span>
              )}
            </div>

            {/* Account */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="p-2 border rounded-sm transition relative"
                  style={{ borderColor: `${BRAND}33` }}
                  aria-label="Account"
                >
                  <User className="w-5 h-5" style={{ color: BRAND }} />
                  {user && (
                    <span
                      className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full border"
                      style={{ backgroundColor: BRAND, borderColor: "white" }}
                    />
                  )}
                </button>
              </DropdownMenuTrigger>

              {!user ? (
                <DropdownMenuContent
                  align="end"
                  sideOffset={8}
                  className="w-56 rounded-sm bg-white z-[10000]"
                >
                  <DropdownMenuLabel>Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate("/login")}>
                    <User className="w-4 h-4 mr-2" />
                    Log In
                  </DropdownMenuItem>
                </DropdownMenuContent>
              ) : (
                <DropdownMenuContent
                  align="end"
                  sideOffset={8}
                  className="w-56 rounded-sm bg-white z-[10000]"
                >
                  <DropdownMenuLabel>
                    <div className="flex flex-col">
                      <span className="font-semibold">My Account</span>
                      <span className="text-xs text-slate-500 truncate">
                        {user.email}
                      </span>
                    </div>
                  </DropdownMenuLabel>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem onClick={() => navigate("/profile")}>
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </DropdownMenuItem>

                  <DropdownMenuItem onClick={() => navigate("/orders")}>
                    <ShoppingBag className="w-4 h-4 mr-2" />
                    My Orders
                  </DropdownMenuItem>

                  {isAdmin && (
                    <DropdownMenuItem onClick={() => navigate("/users")}>
                      <ShoppingBag className="w-4 h-4 mr-2" />
                      Manage Users
                    </DropdownMenuItem>
                  )}

                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-red-600 focus:text-red-600"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Log Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              )}
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Category bar */}
      <nav
        className="hidden md:block backdrop-blur-md bg-white/70 border-b"
        style={{ borderColor: `${BRAND}26` }}
      >
        <div className="max-w-[1200px] mx-auto px-4 lg:px-10 h-[46px] flex items-center justify-center">
          <ul className="flex items-center gap-6 text-[12px] tracking-[0.14em] uppercase">
            {navLinks.bottom.map((cat) => (
              <li key={cat.label}>
                <Link
                  to={cat.path}
                  className={cx(
                    "transition",
                    isActive(cat.path) ? "font-semibold" : "font-medium",
                  )}
                  style={{ color: isActive(cat.path) ? "#0f172a" : BRAND }}
                >
                  {cat.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/50 z-[99998]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
            />

            <motion.aside
              className="fixed top-0 left-0 h-full w-[86%] max-w-[340px] bg-white z-[99999] flex flex-col border-r"
              style={{ borderColor: `${BRAND}26` }}
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.32, ease: "easeInOut" }}
            >
              {/* Drawer header */}
              <div
                className="p-3 flex items-center justify-between border-b"
                style={{ borderColor: `${BRAND}26` }}
              >
                <Link
                  to="/"
                  className="shrink-0"
                  onClick={() => setMenuOpen(false)}
                >
                  <img
                    src="/logs.png"
                    alt="Yagso"
                    className="w-[6rem] object-contain"
                  />
                </Link>

                <button
                  className="p-2 border rounded-sm transition"
                  style={{ borderColor: `${BRAND}33` }}
                  onClick={() => setMenuOpen(false)}
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" style={{ color: BRAND }} />
                </button>
              </div>

              {/* Drawer body */}
              <div className="p-5 flex-1 overflow-y-auto">
                {/* User block */}
                <div
                  className="border bg-white p-4 rounded-sm"
                  style={{ borderColor: `${BRAND}26` }}
                >
                  {user ? (
                    <>
                      <p className="text-xs tracking-wide uppercase text-slate-400">
                        Signed in
                      </p>
                      <p className="text-sm mt-1 truncate text-slate-800">
                        {user.email}
                      </p>
                    </>
                  ) : (
                    <Button
                      onClick={() => go("/login")}
                      className="w-full rounded-sm text-white hover:opacity-90"
                      style={{ backgroundColor: BRAND }}
                    >
                      Log In
                    </Button>
                  )}
                </div>

                {/* Main nav */}
                <div className="mt-6 space-y-2">
                  {navLinks.left.map((item) => (
                    <button
                      key={item.path}
                      onClick={() => go(item.path)}
                      className={cx(
                        "w-full text-left py-2 text-[14px] tracking-[0.14em] uppercase transition",
                        isActive(item.path)
                          ? "text-slate-900"
                          : "text-slate-600 hover:text-slate-900",
                      )}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>

                {/* Categories */}
                <div
                  className="mt-8 pt-6 border-t"
                  style={{ borderColor: `${BRAND}26` }}
                >
                  <button
                    className="flex items-center justify-between w-full text-[12px] tracking-[0.14em] uppercase text-slate-700"
                    onClick={() => setShowCategories((s) => !s)}
                  >
                    Categories
                    <ChevronDown
                      className={cx(
                        "w-4 h-4 transition-transform",
                        showCategories ? "rotate-180" : "",
                      )}
                      style={{ color: BRAND }}
                    />
                  </button>

                  <AnimatePresence>
                    {showCategories && (
                      <motion.ul
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        className="mt-4 space-y-1"
                      >
                        {navLinks.bottom.map((cat) => (
                          <li key={cat.label}>
                            <button
                              onClick={() => go(cat.path)}
                              className="w-full text-left py-2 text-sm text-slate-600 hover:text-slate-900 transition"
                            >
                              {cat.label}
                            </button>
                          </li>
                        ))}
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </div>

                {/* Auth actions */}
                {user && (
                  <div
                    className="mt-8 pt-6 border-t space-y-2"
                    style={{ borderColor: `${BRAND}26` }}
                  >
                    <button
                      onClick={() => go("/profile")}
                      className="w-full text-left py-2 text-sm flex items-center gap-2 text-slate-700 hover:text-slate-900 transition"
                    >
                      <User className="w-4 h-4" style={{ color: BRAND }} />
                      Profile
                    </button>

                    <button
                      onClick={() => go("/orders")}
                      className="w-full text-left py-2 text-sm flex items-center gap-2 text-slate-700 hover:text-slate-900 transition"
                    >
                      <ShoppingBag
                        className="w-4 h-4"
                        style={{ color: BRAND }}
                      />
                      My Orders
                    </button>

                    {isAdmin && (
                      <button
                        onClick={() => go("/users")}
                        className="w-full text-left py-2 text-sm flex items-center gap-2 text-slate-700 hover:text-slate-900 transition"
                      >
                        <ShoppingBag
                          className="w-4 h-4"
                          style={{ color: BRAND }}
                        />
                        Manage Users
                      </button>
                    )}

                    <button
                      onClick={handleLogout}
                      className="w-full text-left py-2 text-sm flex items-center gap-2 text-red-600 hover:text-red-700 transition"
                    >
                      <LogOut className="w-4 h-4" />
                      Log Out
                    </button>
                  </div>
                )}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
