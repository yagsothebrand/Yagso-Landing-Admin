import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/components/auth/AuthProvider";
import { useProducts } from "@/components/auth/ProductsProvider";
import {
  User,
  Mail,
  Phone,
  MapPin,
  LogOut,
  ArrowLeft,
  ShoppingBag,
  Edit2,
  Save,
  X,
  Trash2,
  ShieldCheck,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";

const BRAND = "#948179";
const cx = (...c) => c.filter(Boolean).join(" ");

export default function ProfilePage() {
  const navigate = useNavigate();

  const {
    user,
    logout,
    getBillingInfo,
    loading: authLoading,
    refreshUser,
    isAdmin,
  } = useAuth();

  const { clearGuestCart } = useProducts();

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingIndex, setDeletingIndex] = useState(null);

  const [formData, setFormData] = useState({
    phone: "",
    fullName: "",
  });

  // design tokens (match checkout)
  const pageBg = "min-h-screen bg-[#fbfaf8]";
  const shell = "max-w-6xl mx-auto px-4";

  const card =
    "bg-white/80 backdrop-blur border border-slate-200 rounded-none overflow-hidden";
  const cardHeader = "px-6 py-4 border-b border-slate-200 bg-white/70";
  const cardTitle =
    "text-sm tracking-[0.18em] uppercase font-bold text-slate-700";

  const input =
    "h-11 rounded-none border-slate-200 bg-white placeholder:text-slate-300 focus-visible:ring-0 focus-visible:border-slate-400";
  const iconInput =
    "pl-10 h-11 rounded-none border-slate-200 bg-white placeholder:text-slate-300 focus-visible:ring-0 focus-visible:border-slate-400";

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      toast.error("Please login to access your profile");
      navigate("/login", { replace: true });
      return;
    }

    setFormData({
      phone: user.phone || "",
      fullName: user.fullName || "",
    });
  }, [user, authLoading, navigate]);

  const handleLogout = async () => {
    try {
      await logout(clearGuestCart);
      toast.success("Logged out successfully");
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to log out");
    }
  };

  const handleSaveProfile = async () => {
    if (!user?.uid) return;

    setSaving(true);
    try {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        phone: formData.phone,
        fullName: formData.fullName,
      });

      await refreshUser?.();

      toast.success("Profile updated successfully!");
      setEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(error?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const savedBilling = getBillingInfo?.() || [];

  const handleDeleteBilling = async (idx) => {
    if (!user?.uid) return;

    const address = savedBilling[idx];
    if (!address) return;

    const ok = window.confirm("Delete this saved address?");
    if (!ok) return;

    setDeletingIndex(idx);
    try {
      const userRef = doc(db, "users", user.uid);
      const nextBilling = savedBilling.filter((_, i) => i !== idx);

      await updateDoc(userRef, { billingInfo: nextBilling });
      await refreshUser?.();

      toast.success("Address deleted");
    } catch (error) {
      console.error("Delete billing error:", error);
      toast.error(error?.message || "Failed to delete address");
    } finally {
      setDeletingIndex(null);
    }
  };

  if (authLoading) {
    return (
      <div className={cx(pageBg, "flex items-center justify-center")}>
        <div className="text-center">
          <div
            className="w-14 h-14 border-4 border-slate-200 border-t-transparent rounded-full animate-spin mx-auto mb-4"
            style={{ borderTopColor: BRAND }}
          />
          <p className="text-slate-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className={cx(pageBg, "pb-20")}>
      {/* sticky top strip (same vibe as checkout) */}
      <div className="sticky top-0 z-20 bg-white/80 backdrop-blur border-b border-slate-200">
        <div className={cx(shell, "py-3 flex items-center justify-between gap-3")}>
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-slate-900"
          >
            <ArrowLeft className="w-4 h-4" style={{ color: BRAND }} />
            Back
          </button>

          {/* <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500">
            <User className="w-4 h-4" style={{ color: BRAND }} />
            Account
          </div> */}
        </div>
      </div>

      <div className={cx(shell, "py-6")}>
        <div className="mb-5">
          <p className="text-[12px] tracking-[0.18em] uppercase" style={{ color: BRAND }}>
            Your Account
          </p>
          <h1 className="text-3xl font-extrabold text-slate-900 mt-2">Profile</h1>
        </div>

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Left / Sidebar */}
          <div className="lg:col-span-2 space-y-5">
            <div className={card}>
              <div className={cardHeader}>
                <div className="flex items-center justify-between">
                  <p className={cardTitle}>Account</p>
                  <span className="text-[11px] tracking-[0.18em] uppercase text-slate-400">
                    Overview
                  </span>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-start gap-4">
                  <div
                    className="w-12 h-12 border bg-white rounded-none flex items-center justify-center shrink-0"
                    style={{ borderColor: `${BRAND}26` }}
                  >
                    <User className="w-5 h-5" style={{ color: BRAND }} />
                  </div>

                  <div className="min-w-0">
                    <p className="text-lg font-bold text-slate-900 truncate">
                      {formData.fullName || "Your Name"}
                    </p>
                    <p className="text-sm text-slate-500 truncate">{user.email}</p>
                  </div>
                </div>

                <div className="mt-6 space-y-2">
                  <Button
                    variant="ghost"
                    className="w-full justify-start rounded-none text-slate-700 hover:text-slate-900"
                    onClick={() => navigate("/orders")}
                  >
                    <ShoppingBag className="w-4 h-4 mr-2" style={{ color: BRAND }} />
                    My Orders
                  </Button>

                  {isAdmin && (
                    <Button
                      variant="ghost"
                      className="w-full justify-start rounded-none text-slate-700 hover:text-slate-900"
                      onClick={() => navigate("/users")}
                    >
                      <ShieldCheck className="w-4 h-4 mr-2" style={{ color: BRAND }} />
                      Manage Users
                    </Button>
                  )}

                  <Button
                    variant="ghost"
                    className="w-full justify-start rounded-none text-red-600 hover:text-red-700"
                    onClick={handleLogout}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Log Out
                  </Button>
                </div>
              </div>
            </div>

            <div className={card}>
              <div className={cardHeader}>
                <div className="flex items-center justify-between">
                  <p className={cardTitle}>Quick Actions</p>
                  <span className="text-[11px] tracking-[0.18em] uppercase text-slate-400">
                    Links
                  </span>
                </div>
              </div>

              <div className="p-6 grid grid-cols-2 gap-3">
                <Button
                  onClick={() => navigate("/shop")}
                  className="h-11 rounded-none text-white font-semibold tracking-wide hover:opacity-90"
                  style={{ backgroundColor: BRAND }}
                >
                  Continue Shopping
                </Button>

                <Button
                  onClick={() => navigate("/orders")}
                  variant="outline"
                  className="h-11 rounded-none border-slate-200 bg-white hover:border-slate-300"
                >
                  View Orders
                </Button>
              </div>
            </div>
          </div>

          {/* Right / Main */}
          <div className="lg:col-span-3 space-y-5">
            {/* Personal info */}
            <div className={card}>
              <div className={cardHeader}>
                <div className="flex items-center justify-between">
                  <p className={cardTitle}>Personal Information</p>
                  <span className="text-[11px] tracking-[0.18em] uppercase text-slate-400">
                    Step 1
                  </span>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center justify-between mb-5">
                  <p className="text-sm text-slate-500">
                    Update your basic details.
                  </p>

                  {!editing ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditing(true)}
                      className="h-10 rounded-none border-slate-200 bg-white hover:border-slate-300"
                    >
                      <Edit2 className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditing(false);
                          setFormData({
                            phone: user.phone || "",
                            fullName: user.fullName || "",
                          });
                        }}
                        className="h-10 rounded-none border-slate-200 bg-white hover:border-slate-300"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </Button>

                      <Button
                        size="sm"
                        onClick={handleSaveProfile}
                        disabled={saving}
                        className="h-10 rounded-none text-white font-semibold tracking-wide hover:opacity-90"
                        style={{ backgroundColor: BRAND, opacity: saving ? 0.85 : 1 }}
                      >
                        {saving ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4 mr-2" />
                            Save
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <Label className="text-slate-700 text-xs tracking-wide uppercase">
                      Email
                    </Label>
                    <div className="relative mt-1.5">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input value={user.email} disabled className={iconInput} />
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      Email cannot be changed
                    </p>
                  </div>

                  <div>
                    <Label className="text-slate-700 text-xs tracking-wide uppercase">
                      Full Name
                    </Label>
                    <div className="relative mt-1.5">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input
                        value={formData.fullName}
                        onChange={(e) =>
                          setFormData({ ...formData, fullName: e.target.value })
                        }
                        placeholder="Your full name"
                        className={iconInput}
                        disabled={!editing}
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-slate-700 text-xs tracking-wide uppercase">
                      Phone
                    </Label>
                    <div className="relative mt-1.5">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        placeholder="+234 800 000 0000"
                        className={iconInput}
                        disabled={!editing}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Billing addresses */}
            <div className={card}>
              <div className={cardHeader}>
                <div className="flex items-center justify-between">
                  <p className={cardTitle}>Saved Addresses</p>
                  <span className="text-[11px] tracking-[0.18em] uppercase text-slate-400">
                    Step 2
                  </span>
                </div>
              </div>

              <div className="p-6">
                {savedBilling.length > 0 ? (
                  <div className="space-y-3">
                    {savedBilling.map((address, idx) => (
                      <div
                        key={`${address?.address || "addr"}_${idx}`}
                        className="p-4 border bg-white rounded-none flex items-start justify-between gap-3"
                        style={{ borderColor: `${BRAND}26` }}
                      >
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-900">
                            {address.fullName}
                          </p>
                          <p className="text-sm text-slate-500 mt-1">
                            {address.address}
                          </p>
                          <p className="text-sm text-slate-500">
                            {address.city}
                            {address.state && `, ${address.state}`}{" "}
                            {address.zipCode}
                          </p>
                          <p className="text-sm text-slate-500">
                            {address.country}
                          </p>
                        </div>

                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleDeleteBilling(idx)}
                          disabled={deletingIndex === idx}
                          className="h-10 w-10 rounded-none border-slate-200 bg-white hover:border-slate-300 shrink-0"
                          title="Delete address"
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10 border bg-white rounded-none" style={{ borderColor: `${BRAND}26` }}>
                    <MapPin className="w-10 h-10 mx-auto mb-3" style={{ color: BRAND }} />
                    <p className="text-slate-700 font-semibold">No saved addresses yet</p>
                    <p className="text-sm text-slate-500 mt-1">
                      Addresses will be saved when you make a purchase
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="h-6" />
      </div>
    </div>
  );
}
