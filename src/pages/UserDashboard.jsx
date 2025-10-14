"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
} from "recharts";
import {
  Package,
  DollarSign,
  Clock,
  FileText,
  TrendingUp,
  ArrowLeft,
} from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { useInvoices } from "@/components/invoice/InvoiceProvider";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { formatCurrency, exportToCSV } from "@/lib/invoice-utils";

export function UserDashboard() {
  const { user } = useAuth();
  const { invoices } = useInvoices();
  const navigate = useNavigate();
  const [showInvoices, setShowInvoices] = useState(false);

  // Filter invoices for current user (sales rep)
  const userInvoices = useMemo(() => {
    if (!user?.id) return [];
    return invoices.filter((invoice) => invoice.userId === user.id);
  }, [invoices, user?.id]);

  // Calculate user-specific stats
  const userStats = useMemo(() => {
    const totalOrders = userInvoices.length;
    const totalSpent = userInvoices.reduce(
      (sum, inv) => sum + (inv.amount || 0),
      0
    );
    const paidInvoices = userInvoices.filter(
      (inv) => inv.status === "paid"
    ).length;
    const unpaidInvoices = userInvoices.filter(
      (inv) => inv.status === "unpaid"
    ).length;
    const pendingInvoices = userInvoices.filter(
      (inv) => inv.status === "unpaid" || inv.status === "overdue"
    ).length;

    // Calculate previous month stats for comparison
    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const lastMonthInvoices = userInvoices.filter((inv) => {
      const invDate = new Date(inv.createdAt);
      return invDate >= lastMonth && invDate < thisMonth;
    });

    const thisMonthInvoices = userInvoices.filter((inv) => {
      const invDate = new Date(inv.createdAt);
      return invDate >= thisMonth;
    });

    const lastMonthCount = lastMonthInvoices.length;
    const thisMonthCount = thisMonthInvoices.length;
    const orderGrowth =
      lastMonthCount > 0
        ? (((thisMonthCount - lastMonthCount) / lastMonthCount) * 100).toFixed(
            1
          )
        : 0;

    const lastMonthSpent = lastMonthInvoices.reduce(
      (sum, inv) => sum + (inv.amount || 0),
      0
    );
    const thisMonthSpent = thisMonthInvoices.reduce(
      (sum, inv) => sum + (inv.amount || 0),
      0
    );
    const spentGrowth =
      lastMonthSpent > 0
        ? (((thisMonthSpent - lastMonthSpent) / lastMonthSpent) * 100).toFixed(
            1
          )
        : 0;

    return {
      totalOrders,
      totalSpent,
      paidInvoices,
      unpaidInvoices,
      pendingInvoices,
      orderGrowth: parseFloat(orderGrowth),
      spentGrowth: parseFloat(spentGrowth),
    };
  }, [userInvoices]);

  // Monthly order data for chart
  const monthlyOrderData = useMemo(() => {
    const monthlyData = {};

    userInvoices.forEach((invoice) => {
      if (invoice.createdAt) {
        const date = new Date(invoice.createdAt);
        const monthKey = `${date.getFullYear()}-${String(
          date.getMonth() + 1
        ).padStart(2, "0")}`;

        if (!monthlyData[monthKey]) {
          monthlyData[monthKey] = {
            month: monthKey,
            orders: 0,
            revenue: 0,
          };
        }
        monthlyData[monthKey].orders += 1;
        monthlyData[monthKey].revenue += invoice.amount || 0;
      }
    });

    return Object.values(monthlyData)
      .sort((a, b) => a.month.localeCompare(b.month))
      .slice(-6)
      .map((item) => ({
        month: new Date(item.month + "-01").toLocaleDateString("en-US", {
          month: "short",
        }),
        orders: item.orders,
        revenue: item.revenue,
      }));
  }, [userInvoices]);

  // Recent orders (last 5)
  const recentOrders = useMemo(() => {
    return userInvoices
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5)
      .map((inv) => ({
        id: inv.id,
        date: new Date(inv.createdAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        }),
        amount: inv.amount || 0,
        status: inv.status,
        customer: inv.customerId || "N/A",
      }));
  }, [userInvoices]);

  // Pending payment invoices
  const pendingPaymentInvoices = useMemo(() => {
    return userInvoices.filter(
      (inv) => inv.status === "unpaid" || inv.status === "overdue"
    );
  }, [userInvoices]);

  const getStatusBadge = (status) => {
    switch (status) {
      case "paid":
        return (
          <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
            Paid
          </Badge>
        );
      case "unpaid":
        return (
          <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">
            Unpaid
          </Badge>
        );
      case "overdue":
        return (
          <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
            Overdue
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  // Handle quick actions
  const handleViewAllInvoices = () => {
    navigate("/dashboard/invoices");
  };

  const handleExportSalesReport = () => {
    if (userInvoices.length === 0) {
      alert("No invoices to export");
      return;
    }

    const reportData = userInvoices.map((inv) => ({
      "Invoice ID": inv.id,
      Customer: inv.customerId,
      "Customer Email": inv.customerEmail || "N/A",
      Amount: inv.amount,
      "Amount Due": inv.amountDue,
      Status: inv.status,
      Date: new Date(inv.createdAt).toLocaleDateString(),
      Products: inv.products?.map((p) => p.name).join(", ") || inv.description,
    }));

    exportToCSV(
      reportData,
      `sales-report-${user?.name || "user"}-${
        new Date().toISOString().split("T")[0]
      }`
    );
  };

  const handleViewPendingPayments = () => {
    setShowInvoices(true);
  };

  if (showInvoices) {
    return (
      <div className="space-y-6 p-6">
        {/* Header with back button */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4"
        >
          <Button
            variant="outline"
            onClick={() => setShowInvoices(false)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Pending Payments</h1>
            <p className="text-gray-600">Invoices awaiting payment</p>
          </div>
        </motion.div>

        {/* Pending Invoices List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pendingPaymentInvoices.length > 0 ? (
            pendingPaymentInvoices.map((invoice, index) => (
              <motion.div
                key={invoice.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">{invoice.id}</h3>
                  {getStatusBadge(invoice.status)}
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">
                    Customer:{" "}
                    <span className="font-medium">{invoice.customerId}</span>
                  </p>
                  <p className="text-sm text-gray-600">
                    Amount:{" "}
                    <span className="font-medium text-blue-600">
                      {formatCurrency(invoice.amount)}
                    </span>
                  </p>
                  <p className="text-sm text-gray-600">
                    Due:{" "}
                    <span className="font-medium text-red-600">
                      {formatCurrency(invoice.amountDue)}
                    </span>
                  </p>
                  <p className="text-xs text-gray-500">
                    Created: {new Date(invoice.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No pending payments</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Welcome Header */}
      {/* <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between bg-gradient-to-r from-orange-500 to-orange-700 rounded-lg p-6 text-white"
      >
        <div>
          <h1 className="text-3xl font-bold">Welcome back, {user?.name || "User"}!</h1>
          <p className="mt-1 text-orange-100">
            Here's your sales overview and recent activity.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Avatar className="w-12 h-12 border-2 border-white">
            <AvatarImage src="/professional-avatar.png" />
            <AvatarFallback className="bg-orange-300 text-orange-900">
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{user?.name}</p>
            <p className="text-sm text-orange-100">{user?.role} Account</p>
          </div>
        </div>
      </motion.div> */}

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="hover:shadow-lg transition-shadow bg-gradient-to-br from-blue-100 to-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Invoices
              </CardTitle>
              <Package className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userStats.totalOrders}</div>
              <p className="text-xs text-muted-foreground flex items-center mt-1">
                {userStats.orderGrowth >= 0 ? (
                  <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                ) : (
                  <TrendingUp className="h-3 w-3 mr-1 text-red-500 rotate-180" />
                )}
                {userStats.orderGrowth >= 0 ? "+" : ""}
                {userStats.orderGrowth}% from last month
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="hover:shadow-lg transition-shadow  bg-gradient-to-br from-orange-100 to-white ">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Revenue
              </CardTitle>
              <p className="h-4 w-4 text-orange-600" > ₦</p>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ₦{userStats.totalSpent.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground flex items-center mt-1">
                {userStats.spentGrowth >= 0 ? (
                  <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                ) : (
                  <TrendingUp className="h-3 w-3 mr-1 text-red-500 rotate-180" />
                )}
                {userStats.spentGrowth >= 0 ? "+" : ""}
                {userStats.spentGrowth}% from last month
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="hover:shadow-lg transition-shadow border-yellow-200  bg-gradient-to-br from-yellow-100 to-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Pending Invoices
              </CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {userStats.pendingInvoices}
              </div>
              <p className="text-xs text-muted-foreground">
                {userStats.unpaidInvoices} unpaid invoices
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="hover:shadow-lg transition-shadow border-green-200  bg-gradient-to-br from-green-100 to-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Paid Invoices
              </CardTitle>
              <FileText className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {userStats.paidInvoices}
              </div>
              <p className="text-xs text-muted-foreground">
                {userStats.totalOrders > 0
                  ? (
                      (userStats.paidInvoices / userStats.totalOrders) *
                      100
                    ).toFixed(1)
                  : 0}
                % success rate
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Charts and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Order History Chart */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>Sales Performance</CardTitle>
            <CardDescription>Your monthly sales activity</CardDescription>
          </CardHeader>
          <CardContent>
            {monthlyOrderData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyOrderData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="orders"
                    stroke="#f97316"
                    strokeWidth={2}
                    name="Invoices"
                  />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    name="Revenue (₦)"
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-gray-500">
                No sales data available yet
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Orders */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>Recent Invoices</CardTitle>
            <CardDescription>Your latest invoice activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.length > 0 ? (
                recentOrders.map((order, index) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div>
                      <p className="font-medium text-sm">{order.id}</p>
                      <p className="text-xs text-gray-600">{order.date}</p>
                      <p className="text-xs text-gray-500">
                        Customer: {order.customer}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-medium">
                        ₦{order.amount.toLocaleString()}
                      </span>
                      {getStatusBadge(order.status)}
                    </div>
                  </motion.div>
                ))
              ) : (
                <p className="text-sm text-gray-500 text-center py-8">
                  No invoices yet. Create your first invoice to get started!
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
 <Card className="hover:shadow-xl transition-all duration-300 border-blue-100">
  <CardHeader className="pb-3 sm:pb-4">
    <CardTitle className="text-lg sm:text-xl md:text-2xl">Quick Actions</CardTitle>
    <CardDescription className="text-xs sm:text-sm">
      Common tasks and shortcuts
    </CardDescription>
  </CardHeader>
  <CardContent>
    <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
      {/* View All Invoices */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        whileHover={{ scale: 1.05, y: -5 }}
        whileTap={{ scale: 0.98 }}
      >
        <Button
          className="w-full h-24 sm:h-28 flex flex-col gap-2 sm:gap-3 bg-gradient-to-br from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-md hover:shadow-xl transition-all border-0"
          onClick={handleViewAllInvoices}
        >
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
            <FileText className="h-5 w-5 sm:h-6 sm:w-6" />
          </div>
          <span className="text-xs sm:text-sm font-semibold">View All Invoices</span>
        </Button>
      </motion.div>

  

      {/* Export Sales Report */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        whileHover={{ scale: 1.05, y: -5 }}
        whileTap={{ scale: 0.98 }}
        className="xs:col-span-2 lg:col-span-1"
      >
        <Button
          className="w-full h-24 sm:h-28 flex flex-col gap-2 sm:gap-3 bg-gradient-to-br from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 shadow-md hover:shadow-xl transition-all border-0"
          onClick={handleExportSalesReport}
        >
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
            <p className="h-5 w-5 sm:h-6 sm:w-6"> ₦</p>
          </div>
          <span className="text-xs sm:text-sm font-semibold">Export Sales Report</span>
        </Button>
      </motion.div>
    </div>
  </CardContent>
</Card>
    </div>
  );
}
