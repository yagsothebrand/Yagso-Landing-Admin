"use client";

import { useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Package,
  Users,
  ShoppingCart,
} from "lucide-react";
import { useProducts } from "@/components/products/ProductsProvider";
import { useInvoices } from "@/components/invoice/InvoiceProvider";
import { motion } from "framer-motion";
import Layout from "@/components/layout/Layout";

export function AnalyticsDashboard() {
  const { inventory } = useProducts();
  const { invoices } = useInvoices();

  // Calculate monthly sales data for the last 6 months
  const salesData = useMemo(() => {
    const monthlyData = {};
    invoices.forEach((invoice) => {
      if (invoice.createdAt) {
        const date = new Date(invoice.createdAt);
        const monthKey = `${date.getFullYear()}-${String(
          date.getMonth() + 1
        ).padStart(2, "0")}`;
        if (!monthlyData[monthKey]) {
          monthlyData[monthKey] = { month: monthKey, sales: 0, orders: 0 };
        }
        monthlyData[monthKey].sales += invoice.amount || 0;
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
        sales: item.sales,
        orders: item.orders,
      }));
  }, [invoices]);

  // Calculate category distribution based on sales (paid invoices only)
  const categoryData = useMemo(() => {
    const categorySales = {};
    let totalSales = 0;

    invoices
      .filter((invoice) => invoice.status === "paid")
      .forEach((invoice) => {
        if (invoice.products && Array.isArray(invoice.products)) {
          invoice.products.forEach((item) => {
            const product = inventory.find((p) => p.id === item.id);
            if (product) {
              const category = product.category || "Uncategorized";
              categorySales[category] =
                (categorySales[category] || 0) + (item.quantity || 0);
              totalSales += item.quantity || 0;
            }
          });
        }
      });

    const colors = [
      "#3B82F6",
      "#EF4444",
      "#10B981",
      "#F59E0B",
      "#8B5CF6",
      "#EC4899",
      "#14B8A6",
    ];

    return Object.entries(categorySales)
      .map(([name, value], index) => ({
        name,
        value: totalSales > 0 ? Math.round((value / totalSales) * 100) : 0,
        color: colors[index % colors.length],
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  }, [invoices, inventory]);

  // Calculate top selling products (paid invoices only)
  const topProducts = useMemo(() => {
    const productSales = {};

    invoices
      .filter((invoice) => invoice.status === "paid")
      .forEach((invoice) => {
        if (invoice.products && Array.isArray(invoice.products)) {
          invoice.products.forEach((item) => {
            const product = inventory.find((p) => p.id === item.id);
            if (product) {
              if (!productSales[item.id]) {
                productSales[item.id] = {
                  name: product.name,
                  sales: 0,
                  revenue: 0,
                };
              }
              productSales[item.id].sales += item.quantity || 0;
              productSales[item.id].revenue += item.price * item.quantity || 0;
            }
          });
        }
      });

    return Object.values(productSales)
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 5);
  }, [invoices, inventory]);

  // Calculate KPIs for current and previous month
  const kpiData = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    let currentRevenue = 0;
    let currentOrders = 0;
    let currentProducts = 0;
    let lastRevenue = 0;
    let lastOrders = 0;
    let lastProducts = 0;

    const currentCustomers = new Set();
    const lastCustomers = new Set();

    invoices.forEach((invoice) => {
      if (invoice.createdAt) {
        const date = new Date(invoice.createdAt);
        const month = date.getMonth();
        const year = date.getFullYear();

        const productCount =
          invoice.items?.reduce((sum, item) => sum + (item.quantity || 0), 0) ||
          0;

        if (year === currentYear && month === currentMonth) {
          currentRevenue += invoice.amount || 0;
          currentOrders += 1;
          currentProducts += productCount;
          if (invoice.customerId) currentCustomers.add(invoice.customerId);
        } else if (year === lastMonthYear && month === lastMonth) {
          lastRevenue += invoice.amount || 0;
          lastOrders += 1;
          lastProducts += productCount;
          if (invoice.customerId) lastCustomers.add(invoice.customerId);
        }
      }
    });

    const revenueChange =
      lastRevenue > 0
        ? ((currentRevenue - lastRevenue) / lastRevenue) * 100
        : 0;
    const ordersChange =
      lastOrders > 0 ? ((currentOrders - lastOrders) / lastOrders) * 100 : 0;
    const productsSoldChange =
      lastProducts > 0
        ? ((currentProducts - lastProducts) / lastProducts) * 100
        : 0;
    const customersChange =
      lastCustomers.size > 0
        ? ((currentCustomers.size - lastCustomers.size) / lastCustomers.size) *
          100
        : 0;

    return {
      totalRevenue: currentRevenue,
      totalOrders: currentOrders,
      productsSold: currentProducts,
      activeCustomers: currentCustomers.size,
      revenueChange,
      ordersChange,
      productsSoldChange,
      customersChange,
    };
  }, [invoices]);

  const maxSales = topProducts.length > 0 ? topProducts[0].sales : 1;

  return (
    <Layout>
      <div className="space-y-6">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-3 text-white"
        >
          <h1 className="text-3xl font-bold">Analytics & Reports</h1>
          <p className="mt-1 text-blue-100">
            Business insights and performance metrics
          </p>
        </motion.div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Total Revenue
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      ₦{kpiData.totalRevenue.toLocaleString()}
                    </p>
                    <p
                      className={`text-xs flex items-center mt-1 ${
                        kpiData.revenueChange >= 0
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {kpiData.revenueChange >= 0 ? (
                        <TrendingUp className="w-3 h-3 mr-1" />
                      ) : (
                        <TrendingDown className="w-3 h-3 mr-1" />
                      )}
                      {Math.abs(kpiData.revenueChange).toFixed(1)}% from last
                      month
                    </p>
                  </div>
                  <p className="w-8 h-8 text-green-500"> ₦</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Total Orders
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {kpiData.totalOrders}
                    </p>
                    <p
                      className={`text-xs flex items-center mt-1 ${
                        kpiData.ordersChange >= 0
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {kpiData.ordersChange >= 0 ? (
                        <TrendingUp className="w-3 h-3 mr-1" />
                      ) : (
                        <TrendingDown className="w-3 h-3 mr-1" />
                      )}
                      {Math.abs(kpiData.ordersChange).toFixed(1)}% from last
                      month
                    </p>
                  </div>
                  <ShoppingCart className="w-8 h-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Products Sold
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {kpiData.productsSold}
                    </p>
                    <p
                      className={`text-xs flex items-center mt-1 ${
                        kpiData.productsSoldChange >= 0
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {kpiData.productsSoldChange >= 0 ? (
                        <TrendingUp className="w-3 h-3 mr-1" />
                      ) : (
                        <TrendingDown className="w-3 h-3 mr-1" />
                      )}
                      {Math.abs(kpiData.productsSoldChange).toFixed(1)}% from
                      last month
                    </p>
                  </div>
                  <Package className="w-8 h-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Active Customers
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {kpiData.activeCustomers}
                    </p>
                    <p
                      className={`text-xs flex items-center mt-1 ${
                        kpiData.customersChange >= 0
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {kpiData.customersChange >= 0 ? (
                        <TrendingUp className="w-3 h-3 mr-1" />
                      ) : (
                        <TrendingDown className="w-3 h-3 mr-1" />
                      )}
                      {Math.abs(kpiData.customersChange).toFixed(1)}% from last
                      month
                    </p>
                  </div>
                  <Users className="w-8 h-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sales Trend */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>Sales Trend</CardTitle>
              <CardDescription>
                Monthly sales performance over the last 6 months
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={salesData}>
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
                  <Line
                    type="monotone"
                    dataKey="sales"
                    stroke="#3B82F6"
                    strokeWidth={2}
                    name="Sales (₦)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Category Distribution */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>Sales by Category</CardTitle>
              <CardDescription>
                Distribution of sales across product categories
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Top Products */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>Top Selling Products</CardTitle>
            <CardDescription>
              Best performing products by sales volume and revenue
            </CardDescription>
          </CardHeader>
          <CardContent>
            {topProducts.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">
                        Product
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">
                        Units Sold
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">
                        Revenue
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">
                        Performance
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {topProducts.map((product, index) => (
                      <motion.tr
                        key={product.name}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="hover:bg-gray-50"
                      >
                        <td className="py-4 px-4">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                              <span className="text-sm font-medium text-orange-600">
                                #{index + 1}
                              </span>
                            </div>
                            <span className="font-medium text-gray-900">
                              {product.name}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-gray-600">
                          {product.sales}
                        </td>
                        <td className="py-4 px-4 font-medium text-gray-900">
                          ₦{product.revenue.toLocaleString()}
                        </td>
                        <td className="py-4 px-4">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-orange-500 h-2 rounded-full transition-all"
                              style={{
                                width: `${(product.sales / maxSales) * 100}%`,
                              }}
                            ></div>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-center text-gray-500 py-8">
                No sales data available yet
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
