"use client";

import { useState } from "react";
import { Menu, X, ChevronLeft, MailCheckIcon } from "lucide-react";
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
      icon: LayoutDashboard,
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
      id: "categories",
      label: "Categories",
      icon: Layers,
      path: "/dashboard/categories",
      requiredRole: "Sales Representative",
    },
    {
      id: "administration",
      label: "Administration",
      icon: Users,
      path: "/dashboard/administration",
      requiredRole: "General Manager",
    },
    {
      id: "analytics",
      label: "Analytics",
      icon: BarChart3,
      path: "/dashboard/analytics",
      requiredRole: "General Manager",
    },
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
        " border-r border-gray-200 flex flex-col h-full transition-all duration-300",
        collapsed ? "w-20" : "w-64"
      )}
    >
      {/* Header / Logo */}
      <div className="p-4 border-b border-gray-200 flex justify-between items-center relative">
        {!collapsed && (
          <motion.img
            src="/logo.png"
            alt="Yagso Logo"
            width={150}
            height={120}
            className="rounded-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          />
        )}

        {/* Collapse button (desktop) */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronLeft
            className={cn(
              "w-5 h-5 text-gray-600 transition-transform",
              collapsed && "rotate-180"
            )}
          />
        </button>

        {/* Mobile close button */}
        <button
          onClick={() => setOpen(false)}
          className="lg:hidden absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.id === "dashboard"
              ? currentPath === "dashboard" || currentPath === ""
              : currentPath === item.id;
          const canAccess = canAccessPage(item.requiredRole);
          if (!canAccess) return null;

          return (
            <button
              key={item.id}
              onClick={() => handleNavigation(item.path)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-colors text-sm",
                isActive
                  ? "bg-green-50 text-green-800 font-medium"
                  : "text-gray-700 hover:bg-gray-100"
              )}
            >
              <Icon className="w-5 h-5 shrink-0" />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* User Info */}
      {user && (
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={onProfileClick}
            className="w-full flex items-center gap-3 hover:bg-gray-50 p-2 rounded-lg transition-colors"
          >
            <div className="w-10 h-10 bg-green-800 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
              {user.profileImage ? (
                <img
                  src={user.profileImage}
                  alt="Profile"
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                user.firstName?.charAt(0).toUpperCase() || "U"
              )}
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0 text-left">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user.firstName && user.lastName
                    ? `${user.firstName} ${user.lastName}`
                    : user.email}
                </p>
                <p className="text-xs text-red-500 truncate">Edit Profile</p>
              </div>
            )}
          </button>
        </div>
      )}
    </aside>
  );

  return (
    <>
      {/* Mobile Hamburger Button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="lg:hidden fixed top-3 left-4 z-[100] p-3 bg-white rounded-lg shadow-md transition-colors"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5 text-gray-700" />
        </button>
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
              className="fixed inset-0 bg-black/50 z-[95] lg:hidden"
              onClick={() => setOpen(false)}
            />

            {/* Sidebar */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0  bg-white z-[98] lg:hidden w-64"
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
