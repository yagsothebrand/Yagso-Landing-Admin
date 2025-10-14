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
  MailOpen,
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

export function EmailLogsPage() {
  const { emailLogs } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredLogs = emailLogs.filter((log) => {
    const term = searchTerm.toLowerCase();
    return (
      log.subject?.toLowerCase().includes(term) ||
      log.to?.toLowerCase().includes(term) ||
      log.invoiceId?.toLowerCase().includes(term) ||
      log.sender?.toLowerCase().includes(term)
    );
  });

  const totalLogs = emailLogs.length;
  const sentLogs = emailLogs.filter((log) => log.status === "sent").length;
  const failedLogs = emailLogs.filter((log) => log.status === "failed").length;

  const clearFilters = () => setSearchTerm("");

  const getStatusBadge = (status) => {
    const baseStyle =
      "px-2 py-0.5 text-xs font-semibold rounded-full flex items-center gap-1";
    if (status === "sent") {
      return (
        <span className={`${baseStyle} bg-green-100 text-green-700`}>
          <CheckCircle className="w-3 h-3" />
          Sent
        </span>
      );
    }
    return (
      <span className={`${baseStyle} bg-red-100 text-red-700`}>
        <XCircle className="w-3 h-3" />
        Failed
      </span>
    );
  };

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 p-3 sm:p-3"
      >
        <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
          {/* Breadcrumb */}
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="font-semibold">
                Dashboard
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem className="font-semibold">Email</BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem className="font-semibold">
                Email Logs
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p>View Email Logs</p>
            </div>
          </div>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            <StatCard
              label="Total Emails"
              value={totalLogs}
              icon={<Mail className="text-blue-600" />}
              color="blue"
            />
            <StatCard
              label="Sent Emails"
              value={sentLogs}
              icon={<CheckCircle className="text-green-600" />}
              color="green"
            />
            <StatCard
              label="Failed Emails"
              value={failedLogs}
              icon={<XCircle className="text-red-600" />}
              color="red"
            />
          </div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-4 space-y-4 rounded-xl shadow-sm"
          >
            <div className="relative group w-full max-w-xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-blue-500 transition-colors duration-200 w-5 h-5" />
              <Input
                placeholder="Search by subject, recipient, invoice..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-full border-2 border-gray-200 bg-gray-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 ease-in-out shadow-sm hover:bg-white hover:shadow-md"
              />
            </div>

            {searchTerm && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  Showing {filteredLogs.length} of {emailLogs.length} logs
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

          {/* Email Logs Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
          >
            {filteredLogs.map((log, index) => (
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
                        <MailOpen className="w-4 h-4 text-blue-600" />
                        <span className="truncate">{log.subject}</span>
                      </CardTitle>
                    </div>
                    {getStatusBadge(log.status)}
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <p className="text-gray-700 flex items-center gap-2 truncate">
                      <User className="w-4 h-4 text-gray-400" />
                      {log.to}
                    </p>
                    {log.sender && (
                      <p className="text-gray-600 flex items-center gap-2 text-xs truncate">
                        <Mail className="w-4 h-4 text-gray-400" />
                        {log.sender}
                      </p>
                    )}
                    {log.invoiceId && (
                      <p className="text-gray-600 flex items-center gap-2 text-xs">
                        <Hash className="w-4 h-4 text-gray-400" />
                        {log.invoiceId}
                      </p>
                    )}
                    <p className="text-gray-500 flex items-center gap-2 text-xs">
                      <Clock className="w-4 h-4 text-gray-400" />
                      {new Date(log.sentAt.seconds * 1000).toLocaleString()}
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
                  ? "No email logs found matching your search."
                  : "No email logs available yet."}
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
