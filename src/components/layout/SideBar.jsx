"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useAuth } from "../auth/AuthProvider";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  FileText,
  Users,
  BarChart3,
  Tag,
  Layers,
  X,
} from "lucide-react";
export function Sidebar() {
  // Get current page from URL path
  const navigate = useNavigate();
  const location = useLocation();

  const canAccessPage = (requiredRole) => {
    if (!user) return false;
    const roleHierarchy = ["Sales Representative", "General Manager", "CEO"];
    const userLevel = roleHierarchy.indexOf(user.role);
    const requiredLevel = roleHierarchy.indexOf(requiredRole);
    return userLevel >= requiredLevel;
  };

  const currentPath = location.pathname.split("/").pop() || "dashboard";

  const handleNavigation = (path, id) => {
    navigate(path);
    setOpen(false); // Close mobile menu after navigation
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
      id: "inventory",
      label: "Inventory",
      icon: Package,
      path: "/dashboard/inventory",
      requiredRole: "Sales Representative",
    },
    {
      id: "brands",
      label: "Brands",
      icon: Tag,
      path: "/dashboard/brands",
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
  ];
  const { user } = useAuth();

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Logo */}
      <aside
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out",
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-2 border-b border-gray-200">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              className="flex items-center gap-2"
            >
              <img
                src="/images/osondu-logo.png"
                alt="Osondu Logo"
                width={150}
                height={120}
                className="rounded-md"
              />
              {/* <span className="text-base sm:text-lg font-semibold text-gray-800">
            Osondu Nigeria Enterprises
          </span> */}
            </motion.div>
            <div className="mt-1 text-xs text-gray-500 capitalize">
              {/* {user?.role || "Guest"} Account */}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto py-4">
            {/* Main Section */}
            {menuItems.length > 0 && (
              <div className="px-4 mb-6">
                <nav className="space-y-1">
                  {menuItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleNavigation(item.path, item.id)}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                        currentPath === item.id
                          ? "bg-blue-50 text-blue-600"
                          : "text-gray-700 hover:bg-gray-50"
                      )}
                    >
                      <item.icon className="w-4 h-4" />
                      {item.label}
                    </button>
                  ))}
                </nav>
              </div>
            )}
            {/* <div className="px-4">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Inventory
            </h3>
             <nav className="space-y-1">
                          {menuItems.map((item) => (
                            <button
                              key={item.id}
                                                 onClick={() => handleNavigation(item.path, item.id)}
                              className={cn(
                                "w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                                currentPath === item.id
                                  ? "bg-blue-50 text-blue-600"
                                  : "text-gray-700 hover:bg-gray-50"
                              )}
                            >
                              <item.icon className="w-4 h-4" />
                              {item.label}
                            </button>
                          ))}
                        </nav>
            </div> */}
            {/* Inventory Section */}
            {/* {visibleInventoryItems.length > 0 && (
                      <div className="px-4">
                        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                          Inventory
                        </h3>
                        <nav className="space-y-1">
                          {visibleInventoryItems.map((item) => (
                            <button
                              key={item.id}
                              onClick={() => onPageChange(item.id)}
                              className={cn(
                                "w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                                currentPage === item.id
                                  ? "bg-blue-50 text-blue-600"
                                  : "text-gray-700 hover:bg-gray-50"
                              )}
                            >
                              <item.icon className="w-4 h-4" />
                              {item.label}
                            </button>
                          ))}
                        </nav>
                      </div>
                    )} */}
          </div>
          {/* <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
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
                    onClick={() => handleNavigation(item.path, item.id)}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                      isActive
                        ? "bg-blue-50 text-blue-600 font-medium"
                        : "text-gray-700 hover:bg-gray-100"
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav> */}

          {/* User Info */}
          {user && (
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                  {user.name?.charAt(0).toUpperCase() || "U"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user.name}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{user.role}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}
