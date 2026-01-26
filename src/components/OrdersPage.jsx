import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/auth/AuthProvider";
import { useProducts } from "@/components/auth/ProductsProvider";
import {
  ArrowLeft,
  Package,
  Calendar,
  CreditCard,
  MapPin,
  ShoppingBag,
  CheckCircle,
  Clock,
  XCircle,
  Eye,
  Edit3,
  Download,
  Truck,
  Save,
  X,
  Trash2,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useOrders } from "./auth/OrdersProvider";

const BRAND = "#948179"; // YAGSO taupe
const BORDER = `${BRAND}26`;

const STATUS_OPTIONS = [
  { value: "pending", label: "Pending" },
  { value: "paid", label: "Paid" },
  { value: "processing", label: "Processing" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];
function formatDateTime(ts) {
  if (!ts) return "—";
  const d = typeof ts?.toDate === "function" ? ts.toDate() : new Date(ts);
  return d.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function InfoRow({ label, value, mono }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <p className="text-xs tracking-[0.14em] uppercase text-slate-500">
        {label}
      </p>
      <p
        className={[
          "text-sm text-slate-900 text-right break-words max-w-[70%]",
          mono ? "font-mono text-[12px]" : "",
        ].join(" ")}
      >
        {value ?? "—"}
      </p>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div
      className="rounded-2xl border bg-white p-4 space-y-3"
      style={{ borderColor: BORDER }}
    >
      <div className="flex items-center justify-between">
        <h4 className="font-extrabold text-slate-900">{title}</h4>
      </div>
      {children}
    </div>
  );
}

function safeArray(v) {
  return Array.isArray(v) ? v : [];
}

function safeObj(v) {
  return v && typeof v === "object" ? v : {};
}

function cx(...c) {
  return c.filter(Boolean).join(" ");
}

function formatDate(ts) {
  if (!ts) return "N/A";
  const date = typeof ts?.toDate === "function" ? ts.toDate() : new Date(ts);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function buildMapUrl(billingInfo) {
  const parts = [
    billingInfo?.address,
    billingInfo?.city,
    billingInfo?.state,
    billingInfo?.zipCode,
    billingInfo?.country,
  ].filter(Boolean);
  const q = encodeURIComponent(parts.join(", "));
  return `https://www.google.com/maps/search/?api=1&query=${q}`;
}

/* ------------------ taupe badge (no green/red/blue) ------------------ */
function StatusBadge({ status = "pending" }) {
  const s = String(status || "pending").toLowerCase();

  const items = {
    paid: { icon: CheckCircle, text: "Paid" },
    pending: { icon: Clock, text: "Pending" },
    cancelled: { icon: XCircle, text: "Cancelled" },
    processing: { icon: Clock, text: "Processing" },
    shipped: { icon: Truck, text: "Shipped" },
    delivered: { icon: CheckCircle, text: "Delivered" },
  };

  const badge = items[s] || items.pending;
  const Icon = badge.icon;

  return (
    <span
      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border bg-white"
      style={{ borderColor: BORDER }}
    >
      <Icon className="w-3.5 h-3.5" style={{ color: BRAND }} />
      <span className="text-slate-800">{badge.text}</span>
    </span>
  );
}

/* ------------------ minimal taupe confetti (optional) ------------------ */
function ConfettiBurst({ show }) {
  if (!show) return null;
  const colors = [BRAND, "#d8c9bb", "#f0e6db", "#b9a89a"];
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {[...Array(14)].map((_, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 0, x: 0, scale: 0 }}
          animate={{
            opacity: [1, 1, 0],
            y: -240 - Math.random() * 220,
            x: (Math.random() - 0.5) * 340,
            rotate: Math.random() * 360,
            scale: [1, 1, 0.9],
          }}
          transition={{
            duration: 1.5,
            delay: i * 0.03,
            ease: "easeOut",
          }}
          className="absolute left-1/2 top-1/2 w-2.5 h-2.5 rounded-full"
          style={{ background: colors[i % colors.length] }}
        />
      ))}
    </div>
  );
}

/* ------------------ map embed (optional) ------------------ */
function MapEmbed({ billingInfo }) {
  if (!billingInfo?.address) return null;
  const q = encodeURIComponent(
    `${billingInfo?.address || ""}, ${billingInfo?.city || ""}, ${billingInfo?.state || ""}, ${billingInfo?.country || ""}`,
  );
  return (
    <div
      className="mt-3 overflow-hidden rounded-2xl border bg-white"
      style={{ borderColor: BORDER }}
    >
      <iframe
        title="map"
        src={`https://www.google.com/maps?q=${q}&output=embed`}
        className="w-full h-44"
        loading="lazy"
      />
    </div>
  );
}

export default function OrdersPage() {
  const navigate = useNavigate();
  const auth = useAuth();
  const { user, loading: authLoading } = auth;

  const isAdmin = Boolean(auth?.isAdmin || user?.isAdmin);
  const { formatPrice } = useProducts();

  const {
    tab,
    setTab,
    filteredOrders,
    stats,
    filters,
    setFilters,
    clearFilters,
    loading,
    exportOrdersToCsv,
    updateOrder,
    deleteOrder,
    refreshOrders,
  } = useOrders();

  const [expandedOrderId, setExpandedOrderId] = useState(null);

  // edit modal
  const [editingOrder, setEditingOrder] = useState(null);
  const [saving, setSaving] = useState(false);

  // confetti only once on mount (optional)
  const [showConfetti, setShowConfetti] = useState(false);
  useEffect(() => {
    setShowConfetti(true);
    const t = setTimeout(() => setShowConfetti(false), 1600);
    return () => clearTimeout(t);
  }, []);

  // ✅ gate page
  useEffect(() => {
    if (authLoading) return;
    if (!user) navigate("/login", { replace: true });
  }, [authLoading, user, navigate]);

  const title = tab === "all" ? "All Orders" : "My Orders";

  const onExport = () => {
    exportOrdersToCsv(filteredOrders, "orders");
  };

  const openEdit = (order) => {
    setEditingOrder({
      ...order,
      billingInfo: {
        fullName: order?.billingInfo?.fullName || "",
        address: order?.billingInfo?.address || "",
        city: order?.billingInfo?.city || "",
        state: order?.billingInfo?.state || "",
        zipCode: order?.billingInfo?.zipCode || "",
        country: order?.billingInfo?.country || "Nigeria",
      },
      deliveryInfo: {
        status: order?.deliveryInfo?.status || "",
        courier: order?.deliveryInfo?.courier || "",
        trackingNumber: order?.deliveryInfo?.trackingNumber || "",
        notes: order?.deliveryInfo?.notes || "",
      },
      status: order?.status || "pending",
    });
  };

  const closeEdit = () => setEditingOrder(null);

  const saveEdit = async () => {
    if (!editingOrder?.id) return;
    setSaving(true);

    try {
      await updateOrder(editingOrder.id, {
        status: editingOrder.status,
        billingInfo: editingOrder.billingInfo,
        deliveryInfo: editingOrder.deliveryInfo,
      });

      await refreshOrders();
      closeEdit();
    } catch (e) {
      console.error("Update order failed:", e);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (orderId) => {
    if (!orderId) return;

    const ok = window.confirm(
      "Delete this order permanently? This cannot be undone.",
    );
    if (!ok) return;

    setSaving(true);
    try {
      await deleteOrder(orderId);
      await refreshOrders();

      setExpandedOrderId((prev) => (prev === orderId ? null : prev));
      setEditingOrder((prev) => (prev?.id === orderId ? null : prev));
    } catch (e) {
      console.error("Delete order failed:", e);
    } finally {
      setSaving(false);
    }
  };

  // loader while auth resolves
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#fbfaf8] flex items-center justify-center">
        <div className="text-center">
          <div
            className="w-14 h-14 border-4 border-t-transparent rounded-full mx-auto mb-4"
            style={{ borderColor: BRAND, borderTopColor: "transparent" }}
          />
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  // if not logged in, effect will redirect
  if (!user) return null;

  return (
    <div className="min-h-screen pb-16 bg-[#fbfaf8] relative overflow-hidden">
      {/* taupe glow */}
      <div
        className="absolute -top-20 -right-20 w-[520px] h-[520px] rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle at 30% 30%, rgba(148,129,121,0.16), transparent 60%)",
        }}
      />
      <div
        className="absolute -bottom-20 -left-20 w-[520px] h-[520px] rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle at 70% 70%, rgba(148,129,121,0.12), transparent 60%)",
        }}
      />

      <ConfettiBurst show={showConfetti} />

      <div className="max-w-6xl mx-auto px-4 pt-6 md:pt-10 relative z-10">
        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-700 hover:opacity-80 font-semibold mb-6"
        >
          <ArrowLeft className="w-4 h-4" style={{ color: BRAND }} />
          Back
        </button>

        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl font-extrabold text-slate-900"
            >
              <span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage: `linear-gradient(90deg, ${BRAND}, #b9a89a)`,
                }}
              >
                {title}
              </span>
            </motion.h1>
            <p className="text-slate-600 mt-2">
              {isAdmin
                ? "Manage and track all customer orders"
                : "Track and manage your orders"}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {isAdmin && (
              <div
                className="flex items-center rounded-2xl shadow-sm border p-1 bg-white"
                style={{ borderColor: BORDER }}
              >
                <button
                  onClick={() => setTab("all")}
                  className={cx(
                    "px-3 py-2 rounded-xl text-sm font-semibold transition",
                    tab === "all"
                      ? "text-white"
                      : "text-slate-700 hover:bg-[#f6f3ef]",
                  )}
                  style={
                    tab === "all"
                      ? { background: BRAND }
                      : { background: "transparent" }
                  }
                >
                  All Orders
                </button>

                <button
                  onClick={() => setTab("mine")}
                  className={cx(
                    "px-3 py-2 rounded-xl text-sm font-semibold transition",
                    tab === "mine"
                      ? "text-white"
                      : "text-slate-700 hover:bg-[#f6f3ef]",
                  )}
                  style={
                    tab === "mine"
                      ? { background: BRAND }
                      : { background: "transparent" }
                  }
                >
                  My Orders
                </button>
              </div>
            )}

            {isAdmin && (
              <Button
                variant="outline"
                onClick={() => navigate("/users")}
                className="bg-white"
                style={{ borderColor: BORDER }}
              >
                <Users className="w-4 h-4 mr-2" style={{ color: BRAND }} />
                Manage Users
              </Button>
            )}

            {isAdmin && (
              <Button
                variant="outline"
                onClick={onExport}
                disabled={filteredOrders.length === 0}
                className="bg-white"
                style={{ borderColor: BORDER }}
              >
                <Download className="w-4 h-4 mr-2" style={{ color: BRAND }} />
                Export CSV
              </Button>
            )}
          </div>
        </div>
        <div
          className="mt-4 mb-5 rounded-lg border bg-white p-3 shadow-sm"
          style={{ borderColor: BORDER }}
        >
          <div className="flex flex-col md:flex-row md:items-center gap-2">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <input
                  value={filters.q}
                  onChange={(e) =>
                    setFilters((p) => ({ ...p, q: e.target.value }))
                  }
                  placeholder="Search: order id, email, phone, product, pay ref…"
                  className="w-full h-11 rounded-2xl border bg-[#fffdfb] px-4 pr-10 text-sm outline-none"
                  style={{ borderColor: BORDER }}
                />
                {filters.q?.trim() && (
                  <button
                    onClick={() => setFilters((p) => ({ ...p, q: "" }))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-xl hover:bg-[#f6f3ef]"
                    aria-label="Clear search"
                  >
                    <X className="w-4 h-4 text-slate-600" />
                  </button>
                )}
              </div>
            </div>

            {/* Status */}
            <select
              value={filters.status}
              onChange={(e) =>
                setFilters((p) => ({ ...p, status: e.target.value }))
              }
              className="h-11 rounded-2xl border bg-[#fffdfb] px-3 text-sm outline-none"
              style={{ borderColor: BORDER }}
              title="Filter status"
            >
              <option value="all">All status ({stats.all})</option>
              <option value="pending">Pending ({stats.pending})</option>
              <option value="paid">Paid ({stats.paid})</option>
              <option value="processing">
                Processing ({stats.processing})
              </option>
              <option value="shipped">Shipped ({stats.shipped})</option>
              <option value="delivered">Delivered ({stats.delivered})</option>
              <option value="cancelled">Cancelled ({stats.cancelled})</option>
            </select>

            {/* Date range */}
            <select
              value={filters.dateRange}
              onChange={(e) =>
                setFilters((p) => ({ ...p, dateRange: e.target.value }))
              }
              className="h-11 rounded-2xl border bg-[#fffdfb] px-3 text-sm outline-none"
              style={{ borderColor: BORDER }}
              title="Date range"
            >
              <option value="all">Any time</option>
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="365d">Last 12 months</option>
            </select>

            {/* Sort */}
            <select
              value={filters.sort}
              onChange={(e) =>
                setFilters((p) => ({ ...p, sort: e.target.value }))
              }
              className="h-11 rounded-2xl border bg-[#fffdfb] px-3 text-sm outline-none"
              style={{ borderColor: BORDER }}
              title="Sort"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="totalHigh">Total: High → Low</option>
              <option value="totalLow">Total: Low → High</option>
            </select>

            {/* Clear */}
            <Button
              variant="outline"
              onClick={clearFilters}
              className="h-11 rounded-2xl bg-white"
              style={{ borderColor: BORDER }}
            >
              Clear
            </Button>
          </div>

          {/* tiny result line (space-conscious) */}
          <div className="mt-2 text-xs text-slate-500 flex items-center justify-between">
            <span>
              Showing{" "}
              <span className="font-semibold text-slate-800">{stats.all}</span>{" "}
              order{stats.all === 1 ? "" : "s"}
            </span>
            <button
              onClick={refreshOrders}
              className="text-xs font-semibold hover:underline"
              style={{ color: BRAND }}
            >
              Refresh
            </button>
          </div>
        </div>
        {/* Loading */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                className="w-16 h-16 border-4 border-t-transparent rounded-full mx-auto mb-4"
                style={{ borderColor: BRAND, borderTopColor: "transparent" }}
              />
              <p className="text-slate-600">Loading orders...</p>
            </div>
          </div>
        ) : filteredOrders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-lg p-12 shadow-xl text-center border bg-[#fffdfb]"
            style={{ borderColor: BORDER }}
          >
            <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-slate-300" />
            <h2 className="text-2xl font-extrabold text-slate-900 mb-2">
              No orders yet
            </h2>
            <p className="text-slate-600 mb-6">
              {isAdmin
                ? "No orders have been placed yet."
                : "Start shopping to see your orders here."}
            </p>

            {!isAdmin && (
              <Button
                onClick={() => navigate("/shop")}
                className="text-white"
                style={{ background: BRAND }}
              >
                Start Shopping
              </Button>
            )}
          </motion.div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order, index) => {
              const isOpen = expandedOrderId === order.id;
              const mapUrl = buildMapUrl(order.billingInfo);

              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(index * 0.05, 0.35) }}
                  className="rounded-lg p-6 shadow-xl border bg-[#fffdfb]"
                  style={{ borderColor: BORDER }}
                >
                  {/* Top row */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-extrabold text-slate-900">
                          Order #{String(order.id).slice(-8).toUpperCase()}
                        </h3>

                        <StatusBadge status={order.status} />
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
                        <span className="flex items-center gap-1">
                          <Calendar
                            className="w-4 h-4"
                            style={{ color: BRAND }}
                          />
                          {formatDate(order.createdAt)}
                        </span>

                        <span className="flex items-center gap-1">
                          <Package
                            className="w-4 h-4"
                            style={{ color: BRAND }}
                          />
                          {order.cart?.length || 0} item(s)
                        </span>

                        {isAdmin && (
                          <span
                            className="text-xs px-2 py-1 rounded-lg border bg-white text-slate-700"
                            style={{ borderColor: BORDER }}
                          >
                            {order.userId
                              ? `User: ${order.userId}`
                              : `Guest: ${String(order.guestUserId || "")}`}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                      <div className="text-right">
                        <p className="text-sm text-slate-600">Total</p>
                        <p
                          className="text-2xl font-extrabold bg-clip-text text-transparent"
                          style={{
                            backgroundImage: `linear-gradient(90deg, ${BRAND}, #b9a89a)`,
                          }}
                        >
                          {formatPrice(order.total)}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setExpandedOrderId(isOpen ? null : order.id)
                          }
                          className="bg-white"
                          style={{ borderColor: BORDER }}
                        >
                          <Eye
                            className="w-4 h-4 mr-2"
                            style={{ color: BRAND }}
                          />
                          {isOpen ? "Hide" : "View"}
                        </Button>

                        {isAdmin && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openEdit(order)}
                              className="bg-white"
                              style={{ borderColor: BORDER }}
                            >
                              <Edit3
                                className="w-4 h-4 mr-2"
                                style={{ color: BRAND }}
                              />
                              Edit
                            </Button>

                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(order.id)}
                              className="bg-white text-slate-900"
                              style={{ borderColor: BORDER }}
                            >
                              <Trash2
                                className="w-4 h-4 mr-2"
                                style={{ color: BRAND }}
                              />
                              Delete
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Details */}
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                        className="border-t pt-4 mt-4 space-y-4 overflow-hidden"
                        style={{ borderColor: BORDER }}
                      >
                        {/* Items */}
                        <div>
                          <div className="flex items-center justify-between gap-3 mb-3">
                            <h4 className="font-semibold text-slate-900">
                              Items Ordered
                            </h4>
                            <span
                              className="text-xs font-semibold px-2 py-1 rounded-lg border bg-white text-slate-700"
                              style={{ borderColor: BORDER }}
                            >
                              {order.cart?.length || 0} item(s)
                            </span>
                          </div>

                          <div className="space-y-3">
                            {(order.cart || []).map((item, idx) => {
                              const itemExtras = Array.isArray(
                                item.selectedExtras,
                              )
                                ? item.selectedExtras
                                : [];
                              const itemUnit =
                                item.selectedVariant?.price ?? item.price ?? 0;

                              return (
                                <div
                                  key={idx}
                                  className="p-3 rounded-2xl border bg-white"
                                  style={{ borderColor: BORDER }}
                                >
                                  <div className="flex gap-3">
                                    <div
                                      className="w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0 border bg-[#f6f3ef]"
                                      style={{ borderColor: BORDER }}
                                    >
                                      <img
                                        src={
                                          item.images?.[0] || "/placeholder.svg"
                                        }
                                        alt={item.name}
                                        className="w-full h-full object-cover"
                                        loading="lazy"
                                      />
                                    </div>

                                    <div className="flex-1">
                                      <div className="flex items-start justify-between gap-3">
                                        <div className="min-w-0">
                                          <h5 className="font-semibold text-sm text-slate-900 truncate">
                                            {item.name}
                                          </h5>

                                          {item.selectedVariant?.name && (
                                            <p className="text-xs text-slate-600 truncate">
                                              Variant:{" "}
                                              <span className="font-semibold text-slate-800">
                                                {item.selectedVariant.name}
                                              </span>
                                            </p>
                                          )}

                                          {item.sku && (
                                            <p className="text-[11px] text-slate-500">
                                              SKU: {item.sku}
                                            </p>
                                          )}
                                        </div>

                                        <div className="text-right shrink-0">
                                          <p className="text-xs text-slate-500">
                                            Qty: {item.quantity}
                                          </p>
                                          <p className="text-sm font-extrabold text-slate-900">
                                            {formatPrice(
                                              itemUnit * (item.quantity ?? 1),
                                            )}
                                          </p>
                                        </div>
                                      </div>

                                      {itemExtras.length > 0 && (
                                        <div
                                          className="mt-3 pt-3 border-t"
                                          style={{ borderColor: BORDER }}
                                        >
                                          <p className="text-xs font-semibold text-slate-700 mb-2">
                                            Extras for this pack
                                          </p>

                                          <div className="space-y-2">
                                            {itemExtras.map((ex, exIdx) => {
                                              const exQty =
                                                ex?.qty ?? ex?.quantity ?? 1;
                                              const exUnit =
                                                ex?.selectedVariant?.price ??
                                                ex?.price ??
                                                0;
                                              const extraText =
                                                ex?.textValue ??
                                                ex?.value ??
                                                ex?.reply ??
                                                ex?.text ??
                                                ex?.message ??
                                                "";

                                              return (
                                                <div
                                                  key={ex.id || exIdx}
                                                  className="flex items-start justify-between gap-3 rounded-xl border bg-[#fffdfb] px-3 py-2"
                                                  style={{
                                                    borderColor: BORDER,
                                                  }}
                                                >
                                                  <div className="min-w-0">
                                                    <p className="text-sm font-semibold text-slate-900">
                                                      {ex.name}
                                                    </p>

                                                    {ex.selectedVariant
                                                      ?.name && (
                                                      <p className="text-xs text-slate-600">
                                                        {
                                                          ex.selectedVariant
                                                            .name
                                                        }
                                                      </p>
                                                    )}

                                                    <p className="text-xs text-slate-500">
                                                      Qty: {exQty}
                                                    </p>

                                                    {String(
                                                      extraText,
                                                    ).trim() && (
                                                      <p className="text-xs text-slate-500 break-words">
                                                        Text: {extraText}
                                                      </p>
                                                    )}
                                                  </div>

                                                  <p className="text-sm font-extrabold text-slate-900">
                                                    {formatPrice(
                                                      exUnit * exQty,
                                                    )}
                                                  </p>
                                                </div>
                                              );
                                            })}
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Contact & Billing */}
                        <div className="grid md:grid-cols-2 gap-4">
                          <div
                            className="p-4 rounded-2xl border bg-white"
                            style={{ borderColor: BORDER }}
                          >
                            <h4 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                              <CreditCard
                                className="w-4 h-4"
                                style={{ color: BRAND }}
                              />
                              Contact Information
                            </h4>
                            <p className="text-sm text-slate-700">
                              {order.email}
                            </p>
                            <p className="text-sm text-slate-700">
                              {order.phone}
                            </p>
                            <h4 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                              <Truck
                                className="w-4 h-4"
                                style={{ color: BRAND }}
                              />
                              Delivery Info
                            </h4>

                            <div className="text-sm text-slate-700 space-y-1">
                              <p>
                                <span className="font-semibold">Status:</span>{" "}
                                {order.deliveryInfo?.status || "—"}
                              </p>
                              <p>
                                <span className="font-semibold">Courier:</span>{" "}
                                {order.deliveryInfo?.courier || "—"}
                              </p>
                              <p>
                                <span className="font-semibold">Tracking:</span>{" "}
                                {order.deliveryInfo?.trackingNumber || "—"}
                              </p>
                              {order.deliveryInfo?.notes && (
                                <p>
                                  <span className="font-semibold">Notes:</span>{" "}
                                  {order.deliveryInfo?.notes}
                                </p>
                              )}
                            </div>
                          </div>

                          <div
                            className="p-4 rounded-2xl border bg-white"
                            style={{ borderColor: BORDER }}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <h4 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                                <MapPin
                                  className="w-4 h-4"
                                  style={{ color: BRAND }}
                                />
                                Billing Address
                              </h4>

                              {order.billingInfo?.address && (
                                <a
                                  href={mapUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-xs font-semibold hover:underline"
                                  style={{ color: BRAND }}
                                >
                                  Open Map
                                </a>
                              )}
                            </div>

                            <p className="text-sm text-slate-700">
                              {order.billingInfo?.fullName}
                            </p>
                            <p className="text-sm text-slate-700">
                              {order.billingInfo?.address}
                            </p>
                            <p className="text-sm text-slate-700">
                              {order.billingInfo?.city}
                              {order.billingInfo?.state &&
                                `, ${order.billingInfo.state}`}{" "}
                              {order.billingInfo?.zipCode}
                            </p>
                            <p className="text-sm text-slate-700">
                              {order.billingInfo?.country}
                            </p>

                            <MapEmbed billingInfo={order.billingInfo} />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* ✅ Admin Edit Modal */}
        {isAdmin && editingOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div
              className="w-full max-w-2xl rounded-2xl border bg-white shadow-xl"
              style={{ borderColor: BORDER }}
            >
              <div
                className="flex items-center justify-between p-5 border-b"
                style={{ borderColor: BORDER }}
              >
                <h3 className="text-lg font-extrabold text-slate-900">
                  Edit Order #{String(editingOrder.id).slice(-8).toUpperCase()}
                </h3>

                <button
                  onClick={closeEdit}
                  className="p-2 rounded-xl border bg-white hover:bg-[#f6f3ef]"
                  style={{ borderColor: BORDER }}
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-5 space-y-4">
                {/* Status */}
                <div className="space-y-1">
                  <label className="text-xs tracking-[0.14em] uppercase text-slate-500">
                    Order Status
                  </label>
                  <select
                    value={editingOrder.status}
                    onChange={(e) =>
                      setEditingOrder((p) => ({ ...p, status: e.target.value }))
                    }
                    className="w-full h-11 rounded-2xl border bg-[#fffdfb] px-3 text-sm outline-none"
                    style={{ borderColor: BORDER }}
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Delivery info */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs tracking-[0.14em] uppercase text-slate-500">
                      Courier
                    </label>
                    <input
                      value={editingOrder.deliveryInfo?.courier || ""}
                      onChange={(e) =>
                        setEditingOrder((p) => ({
                          ...p,
                          deliveryInfo: {
                            ...(p.deliveryInfo || {}),
                            courier: e.target.value,
                          },
                        }))
                      }
                      className="w-full h-11 rounded-2xl border bg-[#fffdfb] px-3 text-sm outline-none"
                      style={{ borderColor: BORDER }}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs tracking-[0.14em] uppercase text-slate-500">
                      Tracking Number
                    </label>
                    <input
                      value={editingOrder.deliveryInfo?.trackingNumber || ""}
                      onChange={(e) =>
                        setEditingOrder((p) => ({
                          ...p,
                          deliveryInfo: {
                            ...(p.deliveryInfo || {}),
                            trackingNumber: e.target.value,
                          },
                        }))
                      }
                      className="w-full h-11 rounded-2xl border bg-[#fffdfb] px-3 text-sm outline-none"
                      style={{ borderColor: BORDER }}
                    />
                  </div>

                  <div className="md:col-span-2 space-y-1">
                    <label className="text-xs tracking-[0.14em] uppercase text-slate-500">
                      Notes
                    </label>
                    <textarea
                      rows={3}
                      value={editingOrder.deliveryInfo?.notes || ""}
                      onChange={(e) =>
                        setEditingOrder((p) => ({
                          ...p,
                          deliveryInfo: {
                            ...(p.deliveryInfo || {}),
                            notes: e.target.value,
                          },
                        }))
                      }
                      className="w-full rounded-2xl border bg-[#fffdfb] px-3 py-2 text-sm outline-none"
                      style={{ borderColor: BORDER }}
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-2 pt-2">
                  <Button
                    variant="outline"
                    onClick={closeEdit}
                    className="bg-white"
                    style={{ borderColor: BORDER }}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={saveEdit}
                    disabled={saving}
                    className="text-white"
                    style={{ background: BRAND }}
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
