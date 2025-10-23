"use client";

import { useState } from "react";
import { Menu, X, ChevronLeft, MailCheckIcon, Home } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  FileText,
  Users,
  BarChart3,
  Tag,
  Layers,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "../auth/AuthProvider";
import ProfileDrawer from "./ProfileDrawer";

export default function SidebarWrapper({
  setIsProfileDrawerOpen,
  isProfileDrawerOpen,
  onProfileClick,
}) {
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false); // 🆕 Collapsible desktop sidebar
  const navigate = useNavigate();
  const location = useLocation();
  const { user, getUserInfo } = useAuth();

  const currentPath = location.pathname.split("/").pop() || "dashboard";

  const canAccessPage = (requiredRole) => {
    if (!user) return false;
    const roleHierarchy = ["Sales Representative", "General Manager", "CEO"];
    const userLevel = roleHierarchy.indexOf(user.role);
    const requiredLevel = roleHierarchy.indexOf(requiredRole);
    return userLevel >= requiredLevel;
  };

  const handleProfileUpdate = async (authId) => {
    await getUserInfo(authId);
  };

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: Home,
      path: "/dashboard",
      requiredRole: "Sales Representative",
    },
    {
      id: "invoices",
      label: "Invoices",
      icon: FileText,
      path: "/dashboard/invoices",
      requiredRole: "Sales Representative",
    },
    {
      id: "products",
      label: "Products",
      icon: Package,
      path: "/dashboard/products",
      requiredRole: "Sales Representative",
    },

    {
      id: "administration",
      label: "Administration",
      icon: Users,
      path: "/dashboard/administration",
      requiredRole: "General Manager",
    },
    // {
    //   id: "analytics",
    //   label: "Analytics",
    //   icon: BarChart3,
    //   path: "/dashboard/analytics",
    //   requiredRole: "General Manager",
    // },
    {
      id: "email",
      label: "Email Logs",
      icon: MailCheckIcon,
      path: "/dashboard/email",
      requiredRole: "General Manager",
    },
    {
      id: "waitlist",
      label: "WaitList Logs",
      icon: MailCheckIcon,
      path: "/dashboard/waitlist",
      requiredRole: "General Manager",
    },
  ];

  const handleNavigation = (path) => {
    navigate(path);
    setOpen(false);
  };

  const renderSidebar = () => (
    <aside
      className={cn(
        "border-r border-[#e2cd9e]/30 flex flex-col h-full transition-all duration-300 bg-gradient-to-b from-[#f5f1e8] to-white",
        collapsed ? "w-20" : "w-64"
      )}
    >
      {/* Header / Logo */}
      {/* Header / Logo */}
      <div className="p-4 border-b border-[#e2cd9e]/30 flex justify-between items-center relative bg-gradient-to-r from-[#f5f1e8] to-[#f5f1e8]/50">
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 100 }}
            whileHover={{ scale: 1.05 }}
          >
            <motion.img
              src="/logo.png"
              alt="Yagso Logo"
              width={150}
              height={120}
              className="rounded-md shadow-lg"
              animate={{ y: [0, -2, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
          </motion.div>
        )}

        {/* Collapse button (desktop) */}
        <motion.button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex p-2 hover:bg-[#e2cd9e]/30 rounded-lg transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <ChevronLeft
            className={cn(
              "w-5 h-5 text-[#004f3f] transition-transform",
              collapsed && "rotate-180"
            )}
          />
        </motion.button>

        {/* Mobile close button */}
        <motion.button
          onClick={() => setOpen(false)}
          className="lg:hidden absolute top-4 right-4 p-2 hover:bg-[#e2cd9e]/20 rounded-lg transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <X className="w-5 h-5 text-[#004f3f]" />
        </motion.button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          const isActive =
            item.id === "dashboard"
              ? currentPath === "dashboard" || currentPath === ""
              : currentPath === item.id;
          const canAccess = canAccessPage(item.requiredRole);
          if (!canAccess) return null;

          return (
            <motion.button
              key={item.id}
              onClick={() => handleNavigation(item.path)}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all text-sm font-medium relative overflow-hidden group",
                isActive
                  ? "bg-gradient-to-r from-[#004f3f] to-[#004f3f]/80 text-[#e2cd9e] shadow-lg"
                  : "text-[#004f3f]/70 hover:text-[#004f3f] hover:bg-[#e2cd9e]/20"
              )}
            >
              {/* Shine effect on hover */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0"
                animate={{ x: ["100%", "-100%"] }}
                transition={{ duration: 2, repeat: Infinity }}
                whileHover={{ opacity: 0.2 }}
              />

              <Icon className="w-5 h-5 shrink-0 relative z-10" />
              {!collapsed && (
                <span className="truncate relative z-10">{item.label}</span>
              )}
            </motion.button>
          );
        })}
      </nav>

      {/* User Info */}

      {user && (
        <motion.div
          className="p-4 border-t border-[#e2cd9e]/30 bg-gradient-to-t from-[#f5f1e8] to-transparent"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <motion.button
            onClick={onProfileClick}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center gap-3 hover:bg-[#e2cd9e]/30 p-2 rounded-lg transition-all"
          >
            <motion.div
              className="w-10 h-10 bg-gradient-to-br from-[#004f3f] to-[#004f3f]/80 rounded-full flex items-center justify-center text-[#e2cd9e] font-semibold flex-shrink-0 shadow-lg"
              whileHover={{ scale: 1.1 }}
              animate={{
                boxShadow: [
                  "0 0 0 0 rgba(0,79,63,0.3)",
                  "0 0 0 8px rgba(0,79,63,0)",
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {user.profileImage ? (
                <img
                  src={user.profileImage || "/placeholder.svg"}
                  alt="Profile"
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                user.firstName?.charAt(0).toUpperCase() || "U"
              )}
            </motion.div>
            {!collapsed && (
              <div className="flex-1 min-w-0 text-left">
                <p className="text-sm font-semibold text-[#004f3f] truncate">
                  {user.firstName && user.lastName
                    ? `${user.firstName} ${user.lastName}`
                    : user.email}
                </p>
                <p className="text-xs text-[#e2cd9e] font-medium truncate">
                  Edit Profile
                </p>
              </div>
            )}
          </motion.button>
        </motion.div>
      )}
    </aside>
  );

  return (
    <>
      {/* Mobile Hamburger Button */}

      {!open && (
        <motion.button
          onClick={() => setOpen(true)}
          className="lg:hidden fixed top-3 left-4 z-[100] p-3 bg-gradient-to-br from-[#004f3f] to-[#004f3f]/80 rounded-lg shadow-lg text-[#e2cd9e] transition-all"
          aria-label="Open menu"
          whileHover={{ scale: 1.1, boxShadow: "0 8px 16px rgba(0,79,63,0.3)" }}
          whileTap={{ scale: 0.95 }}
          animate={{ y: [0, -2, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <Menu className="w-5 h-5" />
        </motion.button>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden lg:block h-screen sticky top-0">
        {renderSidebar()}
      </div>

      {/* Mobile Sidebar with Overlay */}
      <AnimatePresence>
        {open && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-[#004f3f]/40 backdrop-blur-sm z-[95] lg:hidden"
              onClick={() => setOpen(false)}
            />

            {/* Sidebar */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 bg-gradient-to-b from-[#f5f1e8] to-white z-[98] lg:hidden w-64 shadow-2xl"
            >
              {renderSidebar()}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Profile Drawer */}
      <ProfileDrawer
        isOpen={isProfileDrawerOpen}
        onClose={() => setIsProfileDrawerOpen(false)}
        user={user}
        onUpdate={handleProfileUpdate}
      />
    </>
  );
}
