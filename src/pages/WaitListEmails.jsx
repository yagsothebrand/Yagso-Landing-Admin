"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Search,
  X,
  CheckCircle,
  XCircle,
  User,
  Clock,
  Hash,
  KeyRound,
  LogIn,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Layout from "@/components/layout/Layout";
import { useAuth } from "@/components/auth/AuthProvider";

export function WaitListEmails() {
  const { waitlistLogs } = useAuth();
  console.log(waitlistLogs);
  const [searchTerm, setSearchTerm] = useState("");

  // ✅ Adjusted search fields to match your data
  const filteredLogs = waitlistLogs.filter((log) => {
    const term = searchTerm.toLowerCase();
    return (
      log.email?.toLowerCase().includes(term) ||
      log.passcode?.toLowerCase().includes(term) ||
      String(log.loginAttempt).includes(term) ||
      log.id?.toLowerCase().includes(term)
    );
  });

  const totalLogs = waitlistLogs.length;

  // Example of status calculation (optional)
  const highLoginAttempt = waitlistLogs.filter(
    (log) => log.loginAttempt > 5
  ).length;

  const clearFilters = () => setSearchTerm("");

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen p-3 sm:p-3"
      >
        <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
          {/* Breadcrumb */}
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="font-semibold">Dashboard</BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem className="font-semibold">Users</BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem className="font-semibold">Waitlist</BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            <StatCard
              label="Total Users"
              value={totalLogs}
              icon={<Mail className="text-blue-600" />}
              color="blue"
            />
            <StatCard
              label="High Login Attempts"
              value={highLoginAttempt}
              icon={<LogIn className="text-red-600" />}
              color="red"
            />
          </div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 space-y-4 rounded-xl shadow-sm"
          >
            <div className="relative group w-full max-w-xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-blue-500 transition-colors duration-200 w-5 h-5" />
              <Input
                placeholder="Search by email, passcode, attempts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-full border-2 border-gray-200 bg-gray-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 ease-in-out shadow-sm hover:bg-white hover:shadow-md"
              />
            </div>

            {searchTerm && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  Showing {filteredLogs.length} of {waitlistLogs.length} logs
                </span>
                <Button
                  variant="ghost"
                  onClick={clearFilters}
                  className="text-gray-500 text-sm"
                >
                  <X className="w-4 h-4 mr-1" />
                  Clear Search
                </Button>
              </div>
            )}
          </motion.div>

          {/* Logs Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
          >
            {filteredLogs && filteredLogs.map((log, index) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.03, y: -5 }}
              >
                <Card className="backdrop-blur-sm bg-white/70 border border-gray-100 hover:shadow-xl transition-all duration-300 rounded-2xl">
                  <CardHeader className="pb-2 flex justify-between items-start">
                    <div className="flex flex-col gap-1 w-full">
                      <CardTitle className="text-sm sm:text-base font-semibold text-gray-800 truncate flex items-center gap-2">
                        <User className="w-4 h-4 text-blue-600" />
                        <span className="truncate">{log.email}</span>
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    {log.passcode && (
                      <p className="text-gray-600 flex items-center gap-2 text-xs">
                        <KeyRound className="w-4 h-4 text-gray-400" />
                        Passcode: {log.passcode}
                      </p>
                    )}
                    <p className="text-gray-600 flex items-center gap-2 text-xs">
                      <Hash className="w-4 h-4 text-gray-400" />
                      Login Attempts: {log.loginAttempt}
                    </p>
                    <p className="text-gray-500 flex items-center gap-2 text-xs">
                      <Clock className="w-4 h-4 text-gray-400" />
                      Created:{" "}
                      {/* {new Date(log?.createdAt.seconds * 1000).toLocaleString()} */}
                    </p>
                    <p className="text-gray-500 flex items-center gap-2 text-xs">
                      <Clock className="w-4 h-4 text-gray-400" />
                      Last Login:{" "}
                      {/* {new Date(log?.lastLogin.seconds * 1000).toLocaleString()} */}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Empty State */}
          {filteredLogs.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <Mail className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-base sm:text-lg">
                {searchTerm
                  ? "No users found matching your search."
                  : "No waitlist users available yet."}
              </p>
            </motion.div>
          )}
        </div>
      </motion.div>
    </Layout>
  );
}

/* ─────────────── 🧭 Reusable Stat Card Component ─────────────── */
function StatCard({ label, value, icon, color }) {
  const colorMap = {
    blue: "from-blue-50 to-white border-blue-200 text-blue-600",
    green: "from-green-50 to-white border-green-200 text-green-600",
    red: "from-red-50 to-white border-red-200 text-red-600",
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
    >
      <Card
        className={`border ${colorMap[color]} shadow-sm hover:shadow-md transition-all bg-gradient-to-br`}
      >
        <CardContent className="p-4 sm:p-6 flex justify-between items-center">
          <div>
            <p className="text-xs text-gray-600 mb-1">{label}</p>
            <p
              className={`text-xl sm:text-2xl font-bold ${
                colorMap[color].split(" ")[2]
              }`}
            >
              {value}
            </p>
          </div>
          <div className={`p-3 rounded-full bg-${color}-100`}>{icon}</div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
