"use client";

import { useLandingAuth } from "@/components/landingauth/LandingAuthProvider";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase";
import { motion, AnimatePresence } from "framer-motion";
import { User, MapPin, Phone, Mail, Package, Calendar, CreditCard, Truck, ShoppingBag } from "lucide-react";

const Account = () => {
  const { user, userId, loading: authLoading } = useLandingAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchOrders = async () => {
      setLoading(true);
      try {
        const ordersRef = collection(db, "users", userId, "orders");
        const snapshot = await getDocs(ordersRef);
        const userOrders = snapshot.docs.map((doc) => ({
          orderId: doc.id,
          ...doc.data(),
        }));

        userOrders.sort(
          (a, b) => b.createdAt?.seconds - a.createdAt?.seconds || 0
        );

        setOrders(userOrders);
      } catch (error) {
        console.error("Error fetching user orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userId]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center ">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            className="w-16 h-16 border-4 border-[#254331] border-t-transparent rounded-full mx-auto mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <p className="text-[#254331] text-lg font-semibold">Fetching up your account information...</p>
        </motion.div>
      </div>
    );
  }

  if (!userId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#c4a68f] via-[#b89780] to-[#ad8877]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center bg-[#254331]/95 backdrop-blur-sm p-12 rounded-2xl shadow-2xl"
        >
          <User className="w-16 h-16 text-[#0e4132] mx-auto mb-4" />
          <p className="text-[#0e4132] text-xl">Please log in to view your account.</p>
        </motion.div>
      </div>
    );
  }

  const { billingInfo, email } = user || {};

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen  py-12 px-4 sm:px-6 lg:px-8">
      <div className="absolute inset-0  pointer-events-none" />
      
      <motion.div
        className="max-w-7xl mx-auto space-y-8 relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center mb-12">
          {/* <motion.h1
            className="text-5xl font-bold text-[#254331] mb-2"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            My Account
          </motion.h1> */}
         
        
        </motion.div>

        {/* Profile Section */}
        <motion.section
          variants={itemVariants}
          className="bg-[#ffffff]/55 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden border "
        >
          <div className=" px-8 py-6 relative overflow-hidden">
            <div className="absolute inset-0 to-transparent" />
            <motion.div
              className="flex items-center gap-3 relative z-10"
              whileHover={{ x: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <motion.div
                className="bg-[#c4a68f]/20 p-3 rounded-full"
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.5 }}
              >
                <User className="w-6 h-6 text-[#c4a68f]" />
              </motion.div>
              <h2 className="text-2xl font-bold text-[#0e4132]">Profile Details</h2>
            </motion.div>
          </div>
          
          <div className="p-8">
            {billingInfo ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <motion.div
                  className="space-y-4"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <motion.div
                    className="flex items-start gap-3 p-4 bg-[#254331]/20 backdrop-blur-sm rounded-xl hover:bg-[#254331]/30 transition-all cursor-pointer border border-[#254331]/20"
                    whileHover={{ scale: 1.02, x: 5 }}
                  >
                    <User className="w-5 h-5 text-[#c4a68f] mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-300 mb-1">Full Name</p>
                      <p className="text-[#0e4132] font-semibold">{billingInfo.fullName}</p>
                    </div>
                  </motion.div>
                  
                  <motion.div
                    className="flex items-start gap-3 p-4 bg-[#254331]/20 backdrop-blur-sm rounded-xl hover:bg-[#254331]/30 transition-all cursor-pointer border border-[#254331]/20"
                    whileHover={{ scale: 1.02, x: 5 }}
                  >
                    <Mail className="w-5 h-5 text-[#c4a68f] mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-300 mb-1">Email Address</p>
                      <p className="text-[#0e4132] font-semibold break-all">{email}</p>
                    </div>
                  </motion.div>
                  
                  <motion.div
                    className="flex items-start gap-3 p-4 bg-[#254331]/20 backdrop-blur-sm rounded-xl hover:bg-[#254331]/30 transition-all cursor-pointer border border-[#254331]/20"
                    whileHover={{ scale: 1.02, x: 5 }}
                  >
                    <Phone className="w-5 h-5 text-[#c4a68f] mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-300 mb-1">Phone Number</p>
                      <p className="text-[#0e4132] font-semibold">{billingInfo.phone}</p>
                    </div>
                  </motion.div>
                </motion.div>
                
                <motion.div
                  className="space-y-4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <motion.div
                    className="flex items-start gap-3 p-4 bg-[#254331]/20 backdrop-blur-sm rounded-xl hover:bg-[#254331]/30 transition-all cursor-pointer border border-[#254331]/20"
                    whileHover={{ scale: 1.02, x: 5 }}
                  >
                    <MapPin className="w-5 h-5 text-[#c4a68f] mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-300 mb-1">Address</p>
                      <p className="text-[#0e4132] font-semibold">{billingInfo.address}</p>
                      <p className="text-[#0e4132] mt-2">
                        {billingInfo.city}, {billingInfo.state} {billingInfo.zipCode}
                      </p>
                    </div>
                  </motion.div>
                </motion.div>
              </div>
            ) : (
              <motion.div
                className="text-center py-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <MapPin className="w-12 h-12 text-[#0e4132]/60 mx-auto mb-3" />
                <p className="text-[#0e4132]">No billing information saved yet.</p>
              </motion.div>
            )}
          </div>
        </motion.section>

        {/* Orders Section */}
        <motion.section variants={itemVariants} className="space-y-6">
          <div className="rounded-2xl px-8 py-6 shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent" />
            <motion.div
              className="flex items-center gap-3 relative z-10"
              whileHover={{ x: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <motion.div
                className=" p-3 rounded-full"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              >
                <Package className="w-6 h-6 text-[#c4a68f]" />
              </motion.div>
              <div>
                <h2 className="text-2xl font-bold text-[#0e4132]">Your Orders</h2>
                <p className="text-[#b8957a] text-sm">{orders.length} {orders.length === 1 ? 'order' : 'orders'} total</p>
              </div>
            </motion.div>
          </div>

          {orders.length > 0 ? (
            <AnimatePresence >
              <div className="space-y-6">
                {orders.map((order, index) => (
                  <motion.div
                    key={order.orderId}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.01 }}
                    className="backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden border bg-[#bda290]/50 border-[#254331]/30"
                  >
                    {/* Order Header */}
                    <div className="bg-gradient-to-r from-[#ffffff]/70 to-[#0e4132]/40 px-6 py-4 border-b border-[#254331]/40">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <Package className="w-5 h-5 text-[#c4a68f]" />
                          <span className="font-bold text-lg text-[#c4a68f]">
                            Order #{order.orderNumber}
                          </span>
                        </div>
                        <motion.span
                          whileHover={{ scale: 1.05 }}
                          className={`px-4 py-2 text-sm font-semibold rounded-full ${
                            order.status === "Processing"
                              ? "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30"
                              : order.status === "Delivered"
                              ? "bg-green-500/20 text-green-300 border border-green-500/30"
                              : "bg-gray-500/20 text-gray-300 border border-gray-500/30"
                          }`}
                        >
                          {order.status}
                        </motion.span>
                      </div>
                    </div>

                    {/* Order Details */}
                    <div className="p-6 bg-white/70">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 ">
                        <div className="space-y-3">
                          <motion.div
                            className="flex items-start gap-3"
                            whileHover={{ x: 5 }}
                          >
                            <Calendar className="w-5 h-5 text-[#c4a68f] mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-sm text-[#988f7e]">Order Date</p>
                              <p className="font-medium text-[#0e4132]">
                                {order.createdAt?.toDate
                                  ? order.createdAt.toDate().toLocaleDateString('en-US', {
                                      year: 'numeric',
                                      month: 'long',
                                      day: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })
                                  : "N/A"}
                              </p>
                            </div>
                          </motion.div>

                          <motion.div
                            className="flex items-start gap-3"
                            whileHover={{ x: 5 }}
                          >
                            <CreditCard className="w-5 h-5 text-[#c4a68f] mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-sm text-[#988f7e]">Payment</p>
                              <p className="font-medium text-[#0e4132]">{order.paymentMethod}</p>
                              <p className={`text-sm ${order.paymentStatus === 'Paid' ? 'text-green-400' : 'text-yellow-400'}`}>
                                {order.paymentStatus}
                              </p>
                            </div>
                          </motion.div>

                          <motion.div
                            className="flex items-start gap-3"
                            whileHover={{ x: 5 }}
                          >
                            <div className="text-[#0e4132] font-bold text-lg mt-0.5 flex-shrink-0">₦</div>
                            <div>
                              <p className="text-sm text-[#988f7e]">Total Amount</p>
                              <p className="font-bold text-xl text-[#0e4132]">
                                ₦{order.totalAmount?.toLocaleString() || 0}
                              </p>
                            </div>
                          </motion.div>
                        </div>

                        <div className="space-y-3">
                          <motion.div
                            className="flex items-start gap-3"
                            whileHover={{ x: 5 }}
                          >
                            <MapPin className="w-5 h-5 text-[#c4a68f] mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-sm text-[#988f7e] mb-1">Shipping Name & Address</p>
                              <p className="font-medium text-[#0e4132]">{order.shippingAddress.fullName}</p>
                              <p className="text-[#0e4132] text-sm mt-1">
                                {order.shippingAddress.address}
                              </p>
                              <p className=" text-[#0e4132] text-sm">
                                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                              </p>
                            </div>
                          </motion.div>

                          <motion.div
                            className="flex items-start gap-3"
                            whileHover={{ x: 5 }}
                          >
                            <Phone className="w-5 h-5 text-[#c4a68f] mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-sm text-[#988f7e]">Contact Phone</p>
                              <p className="font-medium text-[#0e4132]">{order.shippingAddress.phone}</p>
                            </div>
                          </motion.div>

                          {order.trackingNumber && (
                            <motion.div
                              className="flex items-start gap-3"
                              whileHover={{ x: 5 }}
                            >
                              <Truck className="w-5 h-5 text-[#c4a68f] mt-0.5 flex-shrink-0" />
                              <div>
                                <p className="text-sm text-[#0e4132]">Tracking Number</p>
                                <p className="font-mono font-medium text-[#0e4132]">{order.trackingNumber}</p>
                              </div>
                            </motion.div>
                          )}
                        </div>
                      </div>

                      {/* Products */}
                      {order.items && order.items.length > 0 && (
                        <div className="border-t border-[#254331]/40 pt-6">
                          <h3 className="font-semibold text-[#0e4132] mb-4 flex items-center gap-2">
                            <ShoppingBag className="w-4 h-4 text-[#c4a68f]" />
                            Order Items ({order.items.length})
                          </h3>
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            {order.items.map((product, idx) => (
                              <motion.div
                                key={idx}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: idx * 0.05 }}
                                whileHover={{ scale: 1.02, y: -2 }}
                                className="flex items-center gap-4 bg-[#254331]/30 backdrop-blur-sm border border-[#254331]/40 p-4 rounded-xl hover:bg-[#254331]/40 transition-all"
                              >
                                <motion.img
                                  whileHover={{ scale: 1.1, rotate: 2 }}
                                  src={product.image}
                                  alt={product.productName}
                                  className="w-24 h-24 object-cover rounded-lg border-2 border-[#c4a68f]/30 shadow-lg"
                                />
                                <div className="flex-1 min-w-0">
                                  <p className="font-semibold text-[#0e4132] truncate">{product.productName}</p>
                                  {product.variant && (
                                    <p className="text-sm text-[#0e4132] mt-1">Variant: {product.variant}</p>
                                  )}
                                  <div className="mt-2 space-y-1 text-sm">
                                    <p className="text-gray-300">Qty: <span className="font-medium text-[#0e4132]">{product.quantity}</span></p>
                                    <p className="text-gray-300">Unit: <span className="font-medium">₦{product.unitPrice?.toLocaleString()}</span></p>
                                    <p className="text-[#0e4132] font-bold">Total: ₦{product.totalPrice?.toLocaleString()}</p>
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </AnimatePresence>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-[#254331]/95 backdrop-blur-sm rounded-2xl shadow-2xl p-12 text-center border border-[#254331]/30"
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Package className="w-16 h-16 text-[#0e4132]/50 mx-auto mb-4" />
              </motion.div>
              <p className="text-gray-300 text-lg">You haven't placed any orders yet.</p>
              <p className="text-gray-400 text-sm mt-2">Start shopping to see your orders here!</p>
            </motion.div>
          )}
        </motion.section>
      </motion.div>
    </div>
  );
};

export default Account;