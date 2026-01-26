import { useEffect, useMemo, useState, useCallback } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  Package,
  Mail,
  Phone,
  ArrowRight,
  MapPin,
  Clock,
  Download,
  Copy,
  ChevronDown,
} from "lucide-react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";
import { useAuth } from "./auth/AuthProvider";

const BRAND = "#948179";

const cx = (...c) => c.filter(Boolean).join(" ");
const safe = (v) => (v === undefined || v === null || v === "" ? "—" : v);
const formatMoney = (amount) => `₦${Number(amount || 0).toLocaleString()}`;

export default function OrderSuccessPage() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");
  const { user } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const [copied, setCopied] = useState(false);
  const [showItems, setShowItems] = useState(false);

  const loadOrder = useCallback(async (id) => {
    try {
      setLoading(true);
      const snap = await getDoc(doc(db, "orders", id));
      if (snap.exists()) setOrder({ id: snap.id, ...snap.data() });
      else setOrder(null);
    } catch (error) {
      console.error("Error loading order:", error);
      setOrder(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      setOrder(null);
      return;
    }
    loadOrder(orderId);
  }, [orderId, loadOrder]);

  const formattedTotal = useMemo(() => formatMoney(order?.total ?? 0), [order]);

  const deliveryStatus = useMemo(() => {
    const raw = (order?.delivery?.status || order?.status || "processing")
      .toString()
      .toLowerCase();
    if (raw.includes("deliver")) return "delivered";
    if (raw.includes("dispatch") || raw.includes("shipp")) return "dispatched";
    if (raw.includes("paid") || raw.includes("complete")) return "processing";
    return raw;
  }, [order]);

  const statusLabel =
    deliveryStatus === "delivered"
      ? "Delivered"
      : deliveryStatus === "dispatched"
        ? "Dispatched"
        : "Processing";

  const statusDot =
    deliveryStatus === "delivered"
      ? "bg-emerald-500"
      : deliveryStatus === "dispatched"
        ? "bg-slate-700"
        : "bg-amber-500";

  const copyOrderId = async () => {
    try {
      await navigator.clipboard.writeText(String(order?.id || ""));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    } catch (e) {
      console.error("Copy failed:", e);
    }
  };

  // ====== Loading (minimal) ======
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fbfaf8] px-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-11 h-11 border-2 border-slate-200 border-t-slate-400 rounded-none mx-auto mb-3"
            style={{ borderTopColor: BRAND }}
          />
          <p className="text-slate-500 text-sm font-semibold tracking-wide">
            Loading order details…
          </p>
        </motion.div>
      </div>
    );
  }

  // ====== Not found ======
  if (!orderId || !order) {
    return (
      <div className="min-h-screen bg-[#fbfaf8] py-10 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white/80 backdrop-blur border border-slate-200 rounded-none p-6">
            <div className="border p-4 bg-white rounded-none" style={{ borderColor: `${BRAND}26` }}>
              <p className="text-xs tracking-[0.18em] uppercase" style={{ color: BRAND }}>
                Order
              </p>
              <p className="text-lg font-extrabold text-slate-900 mt-1">
                Order not found
              </p>
              <p className="text-sm text-slate-600 mt-2">
                We couldn’t load your order details. Please check the link and try again.
              </p>
              <p className="text-xs text-slate-500 mt-3">
                Ensure your success URL includes{" "}
                <span className="font-mono font-semibold">?orderId=YOUR_ORDER_ID</span>
              </p>
            </div>

            <div className="mt-4 flex gap-2 flex-col sm:flex-row">
              <Link
                to="/shop"
                className="w-full sm:w-auto h-11 px-5 rounded-none text-white font-semibold tracking-wide flex items-center justify-center gap-2 hover:opacity-90 transition"
                style={{ backgroundColor: BRAND }}
              >
                Go to shop <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/"
                className="w-full sm:w-auto h-11 px-5 rounded-none border border-slate-200 bg-white text-slate-700 font-semibold flex items-center justify-center hover:bg-slate-50 transition"
              >
                Back home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Panel height strategy (keeps page short)
  const productsPanelMaxH = "max-h-[240px] sm:max-h-[280px] lg:max-h-[320px]";

  return (
    <div className="min-h-screen bg-[#fbfaf8] px-4 py-10">
      <div className="max-w-6xl mx-auto">
        {/* ===== Header ===== */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="mb-4"
        >
          <div className="bg-white/80 backdrop-blur border border-slate-200 rounded-none p-6">
            <div className="flex items-start gap-4">
              <div
                className="w-12 h-12 rounded-none border bg-white flex items-center justify-center"
                style={{ borderColor: `${BRAND}33` }}
              >
                <Check className="w-6 h-6" style={{ color: BRAND }} strokeWidth={3} />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-[12px] tracking-[0.18em] uppercase" style={{ color: BRAND }}>
                  Order Confirmed
                </p>
                <h1 className="text-2xl font-extrabold text-slate-900 mt-1">
                  Payment successful
                </h1>
                <p className="text-sm text-slate-600 mt-2">
                  We’re preparing your order. You’ll get updates via email.
                </p>

                <div className="mt-4 grid gap-2 sm:grid-cols-[1fr_auto] sm:items-center">
                  {/* Order ID */}
                  <div className="border bg-white rounded-none px-4 py-3" style={{ borderColor: `${BRAND}26` }}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-[11px] tracking-[0.18em] uppercase text-slate-400">
                          Order Number
                        </p>
                        <p className="font-mono text-sm font-bold text-slate-900 break-all leading-snug">
                          {String(order.id)}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={copyOrderId}
                        className="shrink-0 inline-flex items-center gap-2 rounded-none border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                        title="Copy order number"
                      >
                        <Copy className="w-4 h-4" />
                        {copied ? "Copied" : "Copy"}
                      </button>
                    </div>

                    {order?.payment?.reference ? (
                      <p className="text-[11px] text-slate-500 mt-2">
                        Ref:{" "}
                        <span className="font-mono font-semibold text-slate-700">
                          {order.payment.reference}
                        </span>
                      </p>
                    ) : null}
                  </div>

                  {/* Status */}
                  <div className="flex sm:justify-end">
                    <div className="inline-flex items-center gap-2 border border-slate-200 bg-white rounded-none px-3 py-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${statusDot}`} />
                      <span className="text-xs font-bold text-slate-900">{statusLabel}</span>
                      <span className="text-xs text-slate-500">
                        • {order.cart?.length || 0} item(s)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-4 flex flex-col sm:flex-row gap-2">
                  <Link to="/shop" className="w-full sm:w-auto">
                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full sm:w-auto h-11 px-5 rounded-none text-white font-semibold tracking-wide flex items-center justify-center gap-2 hover:opacity-90 transition"
                      style={{ backgroundColor: BRAND }}
                      type="button"
                    >
                      Continue shopping <ArrowRight className="w-4 h-4" />
                    </motion.button>
                  </Link>

                  {user && (
                    <Link to="/orders" className="w-full sm:w-auto">
                      <motion.button
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full sm:w-auto h-11 px-5 rounded-none border border-slate-200 bg-white text-slate-700 font-semibold flex items-center justify-center gap-2 hover:bg-slate-50 transition"
                        type="button"
                      >
                        View My Orders <ArrowRight className="w-4 h-4" style={{ color: BRAND }} />
                      </motion.button>
                    </Link>
                  )}

                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => window?.print?.()}
                    className="w-full sm:w-auto h-11 px-5 rounded-none border border-slate-200 bg-white text-slate-700 font-semibold flex items-center justify-center gap-2 hover:bg-slate-50 transition"
                    type="button"
                  >
                    <Download className="w-4 h-4" style={{ color: BRAND }} />
                    Download receipt
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ===== Main ===== */}
        <div className="grid lg:grid-cols-2 gap-4">
          {/* Left stack */}
          <motion.div
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.25, delay: 0.03 }}
            className="space-y-4"
          >
            {/* Summary */}
            <div className="bg-white/80 backdrop-blur border border-slate-200 rounded-none p-5">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 border bg-white rounded-none flex items-center justify-center"
                    style={{ borderColor: `${BRAND}26` }}
                  >
                    <Package className="w-5 h-5" style={{ color: BRAND }} />
                  </div>
                  <div className="leading-tight">
                    <p className="text-[12px] tracking-[0.18em] uppercase text-slate-400">
                      Summary
                    </p>
                    <p className="text-sm font-extrabold text-slate-900">
                      Order total
                    </p>
                  </div>
                </div>

                <p className="text-lg font-extrabold text-slate-900">
                  {formattedTotal}
                </p>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2">
                <div className="border bg-white rounded-none px-3 py-2" style={{ borderColor: `${BRAND}26` }}>
                  <p className="text-[11px] tracking-wide uppercase text-slate-400">Items</p>
                  <p className="text-lg font-extrabold text-slate-900">{order.cart?.length || 0}</p>
                </div>

                <div className="border bg-white rounded-none px-3 py-2" style={{ borderColor: `${BRAND}26` }}>
                  <p className="text-[11px] tracking-wide uppercase text-slate-400">Delivery</p>
                  <p className="text-sm font-extrabold text-slate-900 mt-1">
                    {order?.delivery?.fee ? formatMoney(order.delivery.fee) : "FREE"}
                  </p>
                </div>

                <div className="border bg-white rounded-none px-3 py-2" style={{ borderColor: `${BRAND}26` }}>
                  <p className="text-[11px] tracking-wide uppercase text-slate-400">Window</p>
                  <p className="text-sm font-bold text-slate-900 mt-1">
                    {safe(order.delivery?.window || "24–48 hours")}
                  </p>
                </div>
              </div>

              <div
                className="mt-3 border rounded-none px-3 py-2 text-[12px] text-slate-700 flex items-start gap-2"
                style={{ borderColor: `${BRAND}26`, backgroundColor: `${BRAND}08` }}
              >
                <Clock className="w-4 h-4 mt-0.5" style={{ color: BRAND }} />
                <span>We’ll notify you once the rider picks up your package.</span>
              </div>
            </div>

            {/* Delivery + Contact */}
            <div className="bg-white/80 backdrop-blur border border-slate-200 rounded-none p-5">
              <div className="grid sm:grid-cols-2 gap-3">
                {/* Address */}
                <div className="border bg-white rounded-none p-4" style={{ borderColor: `${BRAND}26` }}>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" style={{ color: BRAND }} />
                    <p className="text-[11px] tracking-[0.18em] uppercase text-slate-400">
                      Delivery to
                    </p>
                  </div>

                  <p className="mt-3 text-sm font-extrabold text-slate-900 leading-tight">
                    {safe(order.billingInfo?.fullName)}
                  </p>
                  <p className="mt-2 text-xs text-slate-700 leading-relaxed">
                    {safe(order.billingInfo?.address)}
                    {order.billingInfo?.city ? `, ${order.billingInfo.city}` : ""}
                    {order.billingInfo?.state ? `, ${order.billingInfo.state}` : ""}
                    {order.billingInfo?.zipCode ? ` ${order.billingInfo.zipCode}` : ""}
                  </p>
                  <p className="mt-2 text-xs text-slate-700">
                    {safe(order.billingInfo?.country || "Nigeria")}
                  </p>
                </div>

                {/* Contact */}
                <div className="border bg-white rounded-none p-4" style={{ borderColor: `${BRAND}26` }}>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" style={{ color: BRAND }} />
                    <p className="text-[11px] tracking-[0.18em] uppercase text-slate-400">
                      Contact
                    </p>
                  </div>

                  <div className="mt-3 space-y-2">
                    <div className="flex items-center gap-2 border border-slate-200 bg-white rounded-none px-3 py-2">
                      <Mail className="w-4 h-4 text-slate-400" />
                      <p className="text-xs text-slate-700 break-all">{safe(order.email)}</p>
                    </div>

                    <div className="flex items-center gap-2 border border-slate-200 bg-white rounded-none px-3 py-2">
                      <Phone className="w-4 h-4 text-slate-400" />
                      <p className="text-xs text-slate-700 break-all">{safe(order.phone)}</p>
                    </div>
                  </div>

                  <p className="mt-3 text-[11px] tracking-wide uppercase text-slate-400">
                    Updates via email
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right: Items */}
          <motion.div
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.25, delay: 0.05 }}
            className="bg-white/80 backdrop-blur border border-slate-200 rounded-none p-5"
          >
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="text-sm font-extrabold text-slate-900">Items</p>
                <p className="text-xs text-slate-500">
                  {order.cart?.length || 0} product(s)
                </p>
              </div>

              {/* Mobile collapse */}
              <button
                type="button"
                onClick={() => setShowItems((v) => !v)}
                className="lg:hidden inline-flex items-center gap-2 border border-slate-200 bg-white rounded-none px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
              >
                {showItems ? "Hide" : "Show"} items
                <motion.span animate={{ rotate: showItems ? 180 : 0 }}>
                  <ChevronDown className="w-4 h-4" style={{ color: BRAND }} />
                </motion.span>
              </button>
            </div>

            <div className="mt-3">
              <AnimatePresence initial={false}>
                {showItems && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="lg:hidden overflow-hidden"
                  >
                    <ProductsList order={order} brand={BRAND} />
                  </motion.div>
                )}
              </AnimatePresence>

              <div className={cx("hidden lg:block overflow-auto pr-1", productsPanelMaxH)}>
                <ProductsList order={order} brand={BRAND} />
              </div>

              <p className="hidden lg:block mt-3 text-[11px] tracking-wide uppercase text-slate-400">
                This list scrolls inside the card
              </p>
            </div>
          </motion.div>
        </div>

        <p className="mt-5 text-[11px] tracking-[0.18em] uppercase text-slate-400 text-center">
          Yagso • Minimal • Modern
        </p>
      </div>
    </div>
  );
}

function ProductsList({ order, brand = "#948179" }) {
  const formatMoney = (amount) => `₦${Number(amount || 0).toLocaleString()}`;
  const safe = (v) => (v === undefined || v === null || v === "" ? "—" : v);

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={{
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.04 } },
      }}
      className="space-y-2"
    >
      {order.cart?.length ? (
        order.cart.map((item, idx) => {
          const unitPrice = item.selectedVariant?.price || item.price || 0;
          const qty = item.quantity || 1;
          const lineTotal = unitPrice * qty;

          return (
            <motion.div
              key={item.cartId || `${item.name}-${idx}`}
              variants={{
                hidden: { opacity: 0, y: 8 },
                show: { opacity: 1, y: 0 },
              }}
              className="flex gap-3 border bg-white rounded-none p-3"
              style={{ borderColor: `${brand}26` }}
            >
              <div
                className="w-14 h-14 border bg-slate-50 rounded-none overflow-hidden flex-shrink-0"
                style={{ borderColor: `${brand}1a` }}
              >
                <img
                  src={item.images?.[0] || "/placeholder.svg"}
                  alt={item.name || "Product"}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-extrabold text-slate-900 line-clamp-1">
                  {safe(item.name)}
                </p>

                <div className="mt-1 space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      {item.selectedVariant?.name ? (
                        <p className="text-[11px] text-slate-500 font-semibold">
                          Variant:{" "}
                          <span className="text-slate-700">
                            {item.selectedVariant.name}
                          </span>
                        </p>
                      ) : null}
                    </div>

                    <div className="text-right shrink-0">
                      <p className="text-[11px] text-slate-500 font-semibold">
                        Qty: {qty}
                      </p>
                      <p className="text-sm font-extrabold text-slate-900">
                        {formatMoney(lineTotal)}
                      </p>
                    </div>
                  </div>

                  {item.selectedExtras?.length > 0 ? (
                    <div
                      className="border rounded-none p-2 space-y-1"
                      style={{ borderColor: `${brand}26`, backgroundColor: `${brand}08` }}
                    >
                      <p
                        className="text-[10px] font-extrabold tracking-[0.18em] uppercase"
                        style={{ color: brand }}
                      >
                        Extras ({item.selectedExtras.length})
                      </p>

                      {item.selectedExtras.map((extra, extraIdx) => (
                        <div key={extraIdx} className="flex items-start justify-between gap-2 text-[11px]">
                          <div className="flex-1 min-w-0">
                            <span className="font-semibold text-slate-800">
                              • {extra.name}
                            </span>
                            {extra.selectedVariant?.name ? (
                              <span className="text-slate-500 ml-1">
                                ({extra.selectedVariant.name})
                              </span>
                            ) : null}
                          </div>

                          <span className="font-extrabold text-slate-900">
                            {formatMoney(extra.selectedVariant?.price || extra.price || 0)}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>
            </motion.div>
          );
        })
      ) : (
        <div className="border border-slate-200 bg-white rounded-none p-3">
          <p className="text-sm text-slate-600">No items found on this order.</p>
        </div>
      )}
    </motion.div>
  );
}
