"use client";

import { useState } from "react";
import { Bell, X, AlertTriangle, AlertCircle, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

import { formatDistanceToNow } from "date-fns";
import { useNotifications } from "./notification/NotificationProvider";

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const {
    notifications,
    unreadCount,
    dismissNotification,
    markAsRead,
    markAllAsRead,
    clearAll,
  } = useNotifications();

  const activeNotifications = notifications.filter((n) => !n.dismissed);

  const handleNotificationClick = (id) => {
    markAsRead(id);
  };

  return (
    <div className="relative">
      {/* Bell Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5 text-gray-600" />
        {unreadCount > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center"
          >
            <span className="text-white text-xs font-bold">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          </motion.div>
        )}
      </motion.button>

      {/* Notification Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden z-50"
            >
              {/* Header */}
              <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      Notifications
                    </h3>
                    <p className="text-sm text-gray-600">
                      {unreadCount > 0
                        ? `${unreadCount} unread`
                        : "All caught up!"}
                    </p>
                  </div>
                  {activeNotifications.length > 0 && (
                    <div className="flex gap-2">
                      {unreadCount > 0 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={markAllAsRead}
                          className="text-xs"
                        >
                          <Check className="w-3 h-3 mr-1" />
                          Mark all read
                        </Button>
                      )}
                      {/* <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearAll}
                        className="text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        Clear all
                      </Button> */}
                    </div>
                  )}
                </div>
              </div>

              {/* Notifications List */}
              <ScrollArea className="h-[400px]">
                {activeNotifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-[400px] text-gray-500">
                    <Bell className="w-12 h-12 mb-2 opacity-20" />
                    <p className="text-sm">No notifications</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {activeNotifications.map((notification) => (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                          !notification.read ? "bg-blue-50/50" : ""
                        }`}
                        onClick={() => handleNotificationClick(notification.id)}
                      >
                        <div className="flex gap-3">
                          {/* Icon */}
                          <div
                            className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                              notification.type === "out-of-stock"
                                ? "bg-red-100"
                                : "bg-yellow-100"
                            }`}
                          >
                            {notification.type === "out-of-stock" ? (
                              <AlertCircle className="w-5 h-5 text-red-600" />
                            ) : (
                              <AlertTriangle className="w-5 h-5 text-yellow-600" />
                            )}
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1">
                                <p className="font-semibold text-sm text-gray-900">
                                  {notification.title}
                                </p>
                                <p className="text-sm text-gray-600 mt-1">
                                  {notification.message}
                                </p>
                                <p className="text-xs text-gray-400 mt-2">
                                  {formatDistanceToNow(notification.timestamp, {
                                    addSuffix: true,
                                  })}
                                </p>
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  dismissNotification(notification.id);
                                }}
                                className="flex-shrink-0 p-1 hover:bg-gray-200 rounded transition-colors"
                              >
                                <X className="w-4 h-4 text-gray-400" />
                              </button>
                            </div>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full absolute left-2 top-1/2 -translate-y-1/2" />
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
