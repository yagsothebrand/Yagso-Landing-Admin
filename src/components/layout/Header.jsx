"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, LogOut, User, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { NotificationBell } from "@/components/notification-bell";
import { useAuth } from "../auth/AuthProvider";

export function Header({ onProfileClick }) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user, logout } = useAuth();
  
  const name = user ? `${user.firstName} ${user.lastName}` : "Guest";
  const initials = user
    ? `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase()
    : "G";

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm backdrop-blur-sm bg-white/95">
      <div className="px-3 sm:px-4 md:px-6 py-2.5 sm:py-3 lg:pl-6">
        <div className="flex items-center justify-between pl-10 sm:pl-12 lg:pl-0 gap-2 sm:gap-3">
          {/* Left: Logo & Greeting */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, type: "spring" }}
            className="flex items-center gap-2 sm:gap-4 min-w-0"
          >
            <div className="min-w-0 pl-5">
              <h1 className="text-base text-blue-700 font-medium sm:block truncate">
                Welcome back, {user?.firstName || "User"}!
              </h1>
            </div>
          </motion.div>

          {/* Right side */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, type: "spring", delay: 0.1 }}
            className="flex items-center gap-1.5 sm:gap-2 md:gap-3 flex-shrink-0"
          >
            {user ? (
              <>
                {/* Add New button */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="hidden xs:block"
                >
                  <Button className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white text-sm sm:text-sm px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 shadow-md hover:shadow-lg transition-all h-8 sm:h-9">
                    <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 sm:mr-2" />
                    <span className="hidden sm:inline">Add New</span>
                  </Button>
                </motion.div>

                <NotificationBell />

                {/* User Menu */}
                <div className="relative">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 sm:gap-3 px-1.5 sm:px-2 md:px-3 py-1.5 sm:py-2 hover:bg-gray-100 rounded-lg transition-all"
                  >
                    {/* Avatar */}
                    <div className="relative flex-shrink-0">
                      {!user?.profileImage ? (
                        <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold text-sm sm:text-sm border-2 border-blue-100">
                          {initials}
                        </div>
                      ) : (
                        <img
                          src={user?.profileImage || "/placeholder.svg"}
                          alt={name}
                          className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-full object-cover border-2 border-blue-100"
                        />
                      )}
                      <div className="absolute bottom-0 right-0 w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 bg-green-500 border-2 border-white rounded-full" />
                    </div>

                    {/* User Info - hidden on mobile */}
                    <div className="hidden md:flex flex-col items-start text-left min-w-0">
                      <span className="font-semibold text-sm text-gray-900 leading-tight truncate max-w-[120px] lg:max-w-none">
                        {name}
                      </span>
                      <span className="text-sm text-gray-500 leading-tight truncate max-w-[120px] lg:max-w-none">
                        {user?.role}
                      </span>
                    </div>

                    <ChevronDown
                      className={`w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-500 transition-transform hidden md:block ${
                        showUserMenu ? "rotate-180" : ""
                      }`}
                    />
                  </motion.button>

                  {/* Dropdown Menu */}
                  <AnimatePresence>
                    {showUserMenu && (
                      <>
                        {/* Backdrop */}
                        <div
                          className="fixed inset-0 z-10"
                          onClick={() => setShowUserMenu(false)}
                        />

                        {/* Menu */}
                        <motion.div
                          initial={{ opacity: 0, y: -10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -10, scale: 0.95 }}
                          transition={{ duration: 0.15 }}
                          className="absolute right-0 mt-2 w-[280px] sm:w-72 md:w-80 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden z-20"
                        >
                          {/* User Info Card */}
                          <div className="p-3 sm:p-4 bg-gradient-to-br from-blue-50 to-blue-100 border-b border-blue-200">
                            <div className="flex items-center gap-2 sm:gap-3">
                              {!user?.profileImage ? (
                                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-base sm:text-lg border-2 border-white shadow-sm flex-shrink-0">
                                  {initials}
                                </div>
                              ) : (
                                <img
                                  src={user?.profileImage || "/placeholder.svg"}
                                  alt={name}
                                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-white shadow-sm flex-shrink-0"
                                />
                              )}
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-sm sm:text-base text-gray-900 truncate">
                                  {name}
                                </p>
                                <p className="text-sm text-gray-600 truncate">
                                  {user?.email}
                                </p>
                                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mt-1">
                                  <Badge className="bg-blue-600 text-white text-sm px-1.5 sm:px-2 py-0 hover:bg-blue-600 whitespace-nowrap">
                                    {user?.role}
                                  </Badge>
                                  <span className="text-sm text-gray-600 truncate">
                                    ID: {user?.extensionId}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Menu Items */}
                          <div className="p-2">
                            <button
                              onClick={() => {
                                setShowUserMenu(false);
                                onProfileClick?.();
                              }}
                              className="w-full flex items-center gap-2.5 sm:gap-3 px-2.5 sm:px-3 py-2 sm:py-2.5 hover:bg-gray-100 rounded-lg transition-colors text-left"
                            >
                              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600" />
                              </div>
                              <div className="min-w-0">
                                <p className="text-sm font-medium text-gray-900">
                                  View Profile
                                </p>
                                <p className="text-sm text-gray-500">
                                  Manage your account
                                </p>
                              </div>
                            </button>

                            <button
                              onClick={logout}
                              className="w-full flex items-center gap-2.5 sm:gap-3 px-2.5 sm:px-3 py-2 sm:py-2.5 hover:bg-red-50 rounded-lg transition-colors text-left group"
                            >
                              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-red-100 rounded-lg flex items-center justify-center group-hover:bg-red-200 transition-colors flex-shrink-0">
                                <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-600" />
                              </div>
                              <div className="min-w-0">
                                <p className="text-sm font-medium text-red-600">
                                  Log out
                                </p>
                                <p className="text-sm text-red-500">
                                  Sign out of your account
                                </p>
                              </div>
                            </button>
                          </div>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <>
                {/* Guest view */}
                <Button
                  variant="outline"
                  className="border-gray-300 hover:bg-gray-50 text-gray-700 text-sm sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 h-8 sm:h-9 bg-transparent"
                >
                  Login
                </Button>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </header>
  );
}
