"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Package,
  DollarSign,
  AlertTriangle,
  ShoppingCart,
  Tag,
  Box,
  Activity,
} from "lucide-react";
import { useInventory } from "@/components/inventory/InventoryProvider";
import { useInvoices } from "@/components/invoice/InvoiceProvider";
import { useMemo } from "react";
import { motion } from "framer-motion";

export function DashboardHome() {
  const { inventory, categories, brands, getInventoryStats } = useInventory();

  const { invoices, getInvoiceStats } = useInvoices();

  const inventoryStats = getInventoryStats();
  const invoiceStats = getInvoiceStats();

  const revenueData = useMemo(() => {
    const monthlyData = {};
    invoices.forEach((invoice) => {
      if (invoice.createdAt) {
        const date = new Date(invoice.createdAt);
        const monthKey = `${date.getFullYear()}-${String(
          date.getMonth() + 1
        ).padStart(2, "0")}`;
        if (!monthlyData[monthKey]) {
          monthlyData[monthKey] = { month: monthKey, revenue: 0, orders: 0 };
        }
        monthlyData[monthKey].revenue += invoice.amount || 0;
        monthlyData[monthKey].orders += 1;
      }
    });

    return Object.values(monthlyData)
      .sort((a, b) => a.month.localeCompare(b.month))
      .slice(-6)
      .map((item) => ({
        month: new Date(item.month + "-01").toLocaleDateString("en-US", {
          month: "short",
        }),
        revenue: item.revenue,
        orders: item.orders - invoiceStats?.unpaid,
      }));
  }, [invoices]);

  const categoryDistribution = useMemo(() => {
    const distribution = {};
    inventory.forEach((item) => {
      const cat = item.category || "Uncategorized";
      distribution[cat] = (distribution[cat] || 0) + 1;
    });

    const colors = [
      "#3b82f6",
      "#f97316",
      "#10b981",
      "#f59e0b",
      "#6b7280",
      "#8b5cf6",
      "#ec4899",
    ];
    return Object.entries(distribution).map(([name, value], index) => ({
      name,
      value,
      color: colors[index % colors.length],
    }));
  }, [inventory]);

  const stockDistribution = useMemo(() => {
    return [
      { name: "In Stock", value: inventoryStats.inStock, color: "#10b981" },
      { name: "Low Stock", value: inventoryStats.lowStock, color: "#f59e0b" },
      {
        name: "Out of Stock",
        value: inventoryStats.outOfStock,
        color: "#ef4444",
      },
    ];
  }, [inventoryStats]);

  const recentInvoices = useMemo(() => {
    return invoices
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5)
      .map((inv) => ({
        id: inv.id,
        customer: inv.customerId || "N/A",
        amount: inv.amount || 0,
        status: inv.status,
        authorizedBy: inv.authorizedByName || "Unknown",
      }));
  }, [invoices]);

  const recentActivity = useMemo(() => {
    const activities = [];

    // Add inventory activities
    inventory.slice(-5).forEach((item) => {
      activities.push({
        user: item.authorizedByName || "Unknown",
        action: "added inventory item",
        item: item.name,
        time: item.createdAt || new Date(),
      });
    });

    // Add invoice activities
    invoices.slice(-5).forEach((invoice) => {
      activities.push({
        user: invoice.authorizedByName || "Unknown",
        action:
          invoice.status === "paid" ? "completed invoice" : "created invoice",
        item: invoice.id,
        time: invoice.createdAt || new Date(),
      });
    });

    return activities
      .sort((a, b) => new Date(b.time) - new Date(a.time))
      .slice(0, 8);
  }, [inventory, invoices]);

  const revenueChange = 20.1;
  const ordersChange = 12.5;
  const lowStockChange = inventoryStats.lowStock > 0 ? 3 : 0;

  return (
    <div className="space-y-6 p-3">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="hover:shadow-lg transition-shadow  bg-gradient-to-br from-blue-100 to-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Revenue
              </CardTitle>
              <p className="h-4 w-4 text-blue-600"> ₦</p>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ₦{invoiceStats.totalAmount.toLocaleString()}
              </div>
              <p className="text-sm text-muted-foreground flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1 text-green-500" />+
                {revenueChange}% from last month
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="hover:shadow-lg transition-shadow  bg-gradient-to-br from-green-100 to-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Invoices
              </CardTitle>
              <ShoppingCart className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{invoiceStats.total}</div>
              <p className="text-sm text-muted-foreground flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                {invoiceStats.paid} paid, {invoiceStats.unpaid} unpaid
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="hover:shadow-lg transition-shadow  bg-gradient-to-br from-yellow-100 to-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Inventory
              </CardTitle>
              <Package className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{inventoryStats.total}</div>
              <p className="text-sm text-muted-foreground flex items-center mt-1">
                <Box className="h-3 w-3 mr-1 text-blue-500" />
                {inventoryStats.inStock} in stock
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="hover:shadow-lg transition-shadow border-orange-200  bg-gradient-to-br from-orange-100 to-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Low Stock Items
              </CardTitle>
              <AlertTriangle className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {inventoryStats.lowStock}
              </div>
              <p className="text-sm text-muted-foreground flex items-center mt-1">
                <TrendingDown className="h-3 w-3 mr-1 text-red-500" />
                {inventoryStats.outOfStock} out of stock
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 ">
        <Card className="hover:shadow-lg transition-shadow bg-gradient-to-br from-slate-200 to-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <Tag className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categories.length}</div>
            <p className="text-sm text-muted-foreground mt-1">
              Product categories
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow bg-gradient-to-br from-purple-100 to-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Brands</CardTitle>
            <Tag className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{brands.length}</div>
            <p className="text-sm text-muted-foreground mt-1">
              Available brands
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow bg-gradient-to-br from-red-100 to-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Amount Due</CardTitle>
            <p className="h-4 w-4 text-orange-600"> ₦</p>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              ₦{invoiceStats.totalDue.toLocaleString()}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Pending payments
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="space-y-6">
        {/* Charts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {/* Revenue Chart */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3 md:pb-6">
              <CardTitle className="text-sm md:text-sm">
                Revenue Overview
              </CardTitle>
              <CardDescription className="text-sm md:text-sm">
                Monthly revenue and invoice trends
              </CardDescription>
            </CardHeader>
            <CardContent className="px-2 md:px-6">
              <ResponsiveContainer
                width="100%"
                height={250}
                className="md:h-[300px]"
              >
                <LineChart
                  data={revenueData}
                  margin={{ left: -20, right: 10, top: 5, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="month"
                    stroke="#6b7280"
                    tick={{ fontSize: 12 }}
                    className="text-sm md:text-sm"
                  />
                  <YAxis
                    stroke="#6b7280"
                    tick={{ fontSize: 12 }}
                    className="text-sm md:text-sm"
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: "12px" }} iconSize={12} />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    name="Revenue (₦)"
                    dot={{ r: 3 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="orders"
                    stroke="#f97316"
                    strokeWidth={2}
                    name="Orders"
                    dot={{ r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Category Distribution */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3 md:pb-6">
              <CardTitle className="text-sm md:text-sm">
                Inventory by Category
              </CardTitle>
              <CardDescription className="text-sm md:text-sm">
                Distribution of items across categories
              </CardDescription>
            </CardHeader>
            <CardContent className="px-2 md:px-6">
              <ResponsiveContainer
                width="100%"
                height={250}
                className="md:h-[300px]"
              >
                <PieChart>
                  <Pie
                    data={categoryDistribution}
                    cx="50%"
                    cy="50%"
                    outerRadius={window.innerWidth < 768 ? 60 : 80}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                    labelStyle={{
                      fontSize: window.innerWidth < 768 ? "10px" : "12px",
                    }}
                  >
                    {categoryDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ fontSize: "12px" }} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Stock Status Chart */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3 md:pb-6">
              <CardTitle className="text-sm md:text-sm">Stock Status</CardTitle>
              <CardDescription className="text-sm md:text-sm">
                Current inventory stock levels
              </CardDescription>
            </CardHeader>
            <CardContent className="px-2 md:px-6">
              <ResponsiveContainer
                width="100%"
                height={250}
                className="md:h-[300px]"
              >
                <BarChart
                  data={stockDistribution}
                  margin={{ left: -20, right: 10, top: 5, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="name"
                    stroke="#6b7280"
                    tick={{ fontSize: 12 }}
                    className="text-sm md:text-sm"
                  />
                  <YAxis
                    stroke="#6b7280"
                    tick={{ fontSize: 12 }}
                    className="text-sm md:text-sm"
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                      fontSize: "8px",
                    }}
                  />
                  <Bar dataKey="value" fill="#3b82f6" radius={[8, 8, 0, 0]}>
                    {stockDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Invoice Status Distribution */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3 md:pb-6">
              <CardTitle className="text-sm md:text-sm">
                Invoice Status
              </CardTitle>
              <CardDescription className="text-sm md:text-sm">
                Breakdown of invoice statuses
              </CardDescription>
            </CardHeader>
            <CardContent className="px-2 md:px-6">
              <ResponsiveContainer
                width="100%"
                height={250}
                className="md:h-[300px]"
              >
                <PieChart>
                  <Pie
                    data={[
                      {
                        name: "Paid",
                        value: invoiceStats.paid,
                        color: "#10b981",
                      },
                      {
                        name: "Unpaid",
                        value: invoiceStats.unpaid,
                        color: "#f59e0b",
                      },
                      {
                        name: "Overdue",
                        value: invoiceStats.overdue,
                        color: "#ef4444",
                      },
                    ]}
                    cx="50%"
                    cy="50%"
                    outerRadius={window.innerWidth < 768 ? 60 : 80}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                    labelStyle={{
                      fontSize: window.innerWidth < 768 ? "10px" : "12px",
                    }}
                  >
                    {[
                      { color: "#10b981" },
                      { color: "#f59e0b" },
                      { color: "#ef4444" },
                    ].map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ fontSize: "12px" }} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {/* Recent Invoices */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3 md:pb-6">
              <CardTitle className="text-sm md:text-sm">
                Recent Invoices
              </CardTitle>
              <CardDescription className="text-sm md:text-sm">
                Latest invoice activity
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 md:space-y-4">
                {recentInvoices.length > 0 ? (
                  recentInvoices.map((invoice) => (
                    <div
                      key={invoice.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm md:text-sm truncate">
                          {invoice.id}
                        </p>
                        <p className="text-sm md:text-sm text-gray-600 truncate">
                          {invoice.customer}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          By: {invoice.authorizedBy}
                        </p>
                      </div>
                      <div className="flex items-center justify-between sm:justify-end gap-3 flex-shrink-0">
                        <span className="font-medium text-sm md:text-sm">
                          ₦{invoice.amount.toLocaleString()}
                        </span>
                        <Badge
                          className={`text-sm ${
                            invoice.status === "paid"
                              ? "bg-green-100 text-green-700 hover:bg-green-100"
                              : invoice.status === "unpaid"
                              ? "bg-orange-100 text-orange-700 hover:bg-orange-100"
                              : "bg-red-100 text-red-700 hover:bg-red-100"
                          }`}
                        >
                          {invoice.status}
                        </Badge>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No invoices yet
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Who Did What - Activity Log */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3 md:pb-6">
              <CardTitle className="flex items-center gap-2 text-sm md:text-sm">
                <Activity className="h-4 w-4 md:h-5 md:w-5 text-blue-600" />
                Recent Activity
              </CardTitle>
              <CardDescription className="text-sm md:text-sm">
                Who did what in the system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-[300px] md:max-h-[350px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800">
                {recentActivity.length > 0 ? (
                  recentActivity.map((activity, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-start gap-2 md:gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm md:text-sm">
                          <span className="font-medium text-blue-600">
                            {activity.user}
                          </span>{" "}
                          <span className="text-gray-600">
                            {activity.action}
                          </span>{" "}
                          <span className="font-medium break-words">
                            {activity.item}
                          </span>
                        </p>
                        <p className="text-sm text-gray-500 mt-0.5">
                          {new Date(activity.time).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No recent activity
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
