import { useEffect, useMemo, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Shield,
  Search,
  MapPin,
} from "lucide-react";

import {
  collection,
  getDocs,
  query,
  orderBy,
  limit,
  startAfter,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "./firebase";
import { useAuth } from "./auth/AuthProvider";
import Header from "@/layout/Header";
import Footer from "@/layout/Footer";

function safeStr(v) {
  return v == null ? "" : String(v);
}

export default function UsersPage() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  // ✅ page access = any logged-in user
  // ✅ editing actions = admin only
  const canEditAdmins = Boolean(user?.isAdmin);

  const PAGE_SIZE = 30;

  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [users, setUsers] = useState([]);
  const [qText, setQText] = useState("");

  const [lastDoc, setLastDoc] = useState(null);
  const [hasMore, setHasMore] = useState(false);

  const [busyId, setBusyId] = useState(null); // for toggle/delete

  const fetchFirstPage = useCallback(async () => {
    setLoading(true);
    try {
      const ref = collection(db, "users");
      // createdAt is best. If some docs don't have it yet, see note below.
      const q = query(ref, orderBy("createdAt", "desc"), limit(PAGE_SIZE));
      const snap = await getDocs(q);

      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setUsers(list);

      const last = snap.docs[snap.docs.length - 1] || null;
      setLastDoc(last);
      setHasMore(snap.docs.length === PAGE_SIZE);
    } catch (e) {
      console.error("Fetch users failed:", e);
      toast.error(e?.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMore = useCallback(async () => {
    if (!lastDoc || loadingMore) return;

    setLoadingMore(true);
    try {
      const ref = collection(db, "users");
      const q = query(
        ref,
        orderBy("createdAt", "desc"),
        startAfter(lastDoc),
        limit(PAGE_SIZE),
      );
      const snap = await getDocs(q);

      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setUsers((prev) => [...prev, ...list]);

      const last = snap.docs[snap.docs.length - 1] || null;
      setLastDoc(last);
      setHasMore(snap.docs.length === PAGE_SIZE);
    } catch (e) {
      console.error("Fetch more users failed:", e);
      toast.error(e?.message || "Failed to load more users");
    } finally {
      setLoadingMore(false);
    }
  }, [lastDoc, loadingMore]);

  const refresh = useCallback(() => {
    setUsers([]);
    setLastDoc(null);
    setHasMore(false);
    fetchFirstPage();
  }, [fetchFirstPage]);

  const filtered = useMemo(() => {
    const t = qText.trim().toLowerCase();
    if (!t) return users;

    return users.filter((u) => {
      const fullName = safeStr(u.fullName).toLowerCase();
      const email = safeStr(u.email).toLowerCase();
      const phone = safeStr(u.phone).toLowerCase();
      const bill0 = Array.isArray(u.billingInfo)
        ? u.billingInfo[0]
        : u.billingInfo;
      const city = safeStr(bill0?.city).toLowerCase();
      const state = safeStr(bill0?.state).toLowerCase();

      return (
        fullName.includes(t) ||
        email.includes(t) ||
        phone.includes(t) ||
        city.includes(t) ||
        state.includes(t)
      );
    });
  }, [users, qText]);

  const toggleAdmin = useCallback(
    async (targetUser) => {
      if (!canEditAdmins) {
        toast.error("Only admins can change admin status");
        return;
      }

      if (targetUser.id === user?.uid) {
        toast.error("You can’t change your own admin status here");
        return;
      }

      setBusyId(targetUser.id);
      try {
        const next = !Boolean(targetUser.isAdmin);
        await updateDoc(doc(db, "users", targetUser.id), { isAdmin: next });

        setUsers((prev) =>
          prev.map((u) =>
            u.id === targetUser.id ? { ...u, isAdmin: next } : u,
          ),
        );

        toast.success(next ? "User is now an admin" : "Admin removed");
      } catch (e) {
        console.error("Update admin failed:", e);
        toast.error(e?.message || "Failed to update admin status");
      } finally {
        setBusyId(null);
      }
    },
    [canEditAdmins, user?.uid],
  );

  const deleteUserDoc = useCallback(
    async (targetUser) => {
      if (!canEditAdmins) {
        toast.error("Only admins can delete users");
        return;
      }

      if (targetUser.id === user?.uid) {
        toast.error("You can’t delete your own record here");
        return;
      }

      const name = targetUser.fullName || targetUser.email || "this user";
    //   const ok = window.confirm(
    //     `Delete ${name}?\n\nThis removes their Firestore record (users/${targetUser.id}).`,
    //   );
    //   if (!ok) return;

      setBusyId(targetUser.id);
      try {
        await deleteDoc(doc(db, "users", targetUser.id));
        setUsers((prev) => prev.filter((u) => u.id !== targetUser.id));
        toast.success("User record deleted");
      } catch (e) {
        console.error("Delete user failed:", e);
        toast.error(e?.message || "Failed to delete user");
      } finally {
        setBusyId(null);
      }
    },
    [canEditAdmins, user?.uid],
  );

  useEffect(() => {
    if (authLoading) return;
    if (!user) navigate("/login");
  }, [authLoading, user, navigate]);

  useEffect(() => {
    if (authLoading) return;
    if (!user) return;
    fetchFirstPage();
  }, [authLoading, user, fetchFirstPage]);

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div>Loading...</div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <>
      <Header />
      <div className="relative min-h-screen pt-20 pb-16 overflow-hidden bg-[#fbfcff]">
        {/* premium background */}
        <div className="pointer-events-none absolute -top-40 -left-40 h-[520px] w-[520px] rounded-full bg-[#2b6f99]/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-44 -right-40 h-[520px] w-[520px] rounded-full bg-[#fc7182]/12 blur-3xl" />
        <div className="pointer-events-none absolute top-1/3 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-purple-500/8 blur-3xl" />

        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(to right, #0f172a 1px, transparent 1px), linear-gradient(to bottom, #0f172a 1px, transparent 1px)",
            backgroundSize: "72px 72px",
          }}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/40 via-transparent to-white/70" />

        <div className="relative z-10">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-4 py-2 text-slate-700 shadow-sm backdrop-blur hover:bg-white hover:shadow transition mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-6">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-3 py-1 text-xs text-slate-600 shadow-sm backdrop-blur">
                  <Shield className="w-3.5 h-3.5 text-[#2b6f99]" />
                  User directory
                  {!canEditAdmins && (
                    <span className="ml-1 text-slate-400">
                      (admin editing disabled)
                    </span>
                  )}
                </div>

                <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
                  <span className="bg-gradient-to-r from-[#2b6f99] via-slate-900 to-[#fc7182] bg-clip-text text-transparent">
                    Users
                  </span>
                </h1>

                <p className="text-slate-600 text-sm">
                  Search and manage customer accounts.
                </p>
              </div>

              <div className="w-full sm:w-[380px]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    value={qText}
                    onChange={(e) => setQText(e.target.value)}
                    placeholder="Search name, email, phone, city..."
                    className="pl-10 bg-white/80 backdrop-blur border-slate-200 rounded-full shadow-sm focus-visible:ring-2 focus-visible:ring-[#2b6f99]/30"
                  />
                </div>
              </div>
            </div>

            {/* Loading skeleton */}
            {loading ? (
              <div className="grid md:grid-cols-2 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="rounded-3xl border border-slate-200/70 bg-white/70 p-6 shadow-sm backdrop-blur"
                  >
                    <div className="h-4 w-40 bg-slate-200/70 rounded animate-pulse" />
                    <div className="mt-2 h-3 w-24 bg-slate-200/60 rounded animate-pulse" />
                    <div className="mt-6 space-y-3">
                      <div className="h-3 w-64 bg-slate-200/60 rounded animate-pulse" />
                      <div className="h-3 w-40 bg-slate-200/60 rounded animate-pulse" />
                      <div className="h-10 w-44 bg-slate-200/60 rounded-full animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/75 backdrop-blur rounded-3xl border border-slate-200/70 p-10 shadow-lg text-center"
              >
                <User className="w-14 h-14 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-800 font-semibold">No users found</p>
                <p className="text-slate-500 text-sm mt-1">
                  Try changing your search.
                </p>
              </motion.div>
            ) : (
              <>
                <div className="grid md:grid-cols-2 gap-4">
                  {filtered.map((u, idx) => {
                    const bill0 = Array.isArray(u.billingInfo)
                      ? u.billingInfo[0]
                      : u.billingInfo;

                    const isBusy = busyId === u.id;

                    return (
                      <motion.div
                        key={u.id}
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: Math.min(idx * 0.04, 0.35) }}
                        className="group relative overflow-hidden rounded-3xl border border-slate-200/70 bg-white/75 p-6 shadow-[0_10px_30px_-20px_rgba(15,23,42,0.35)] backdrop-blur transition hover:-translate-y-0.5 hover:shadow-[0_18px_50px_-25px_rgba(15,23,42,0.45)]"
                      >
                        {/* shine */}
                        <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition">
                          <div className="absolute -top-24 -right-24 h-56 w-56 rounded-full bg-[#2b6f99]/10 blur-2xl" />
                          <div className="absolute -bottom-24 -left-24 h-56 w-56 rounded-full bg-[#fc7182]/10 blur-2xl" />
                        </div>

                        <div className="relative z-10">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <p className="font-extrabold text-slate-900 truncate">
                                {u.fullName || "Unnamed User"}
                              </p>
                              <p className="text-xs text-slate-500 mt-1">
                                ID: {String(u.id)}
                              </p>
                            </div>

                            <span className="text-xs px-2 py-1 rounded-lg bg-slate-100 text-slate-700">
                              {u.isAdmin ? "Admin" : "User"}
                            </span>
                          </div>

                          <div className="mt-4 space-y-2 text-sm">
                            <div className="flex items-center gap-2 text-slate-700">
                              <Mail className="w-4 h-4 text-[#fc7182]" />
                              <span className="truncate">{u.email || "—"}</span>
                            </div>

                            <div className="flex items-center gap-2 text-slate-700">
                              <Phone className="w-4 h-4 text-[#fc7182]" />
                              <span>{u.phone || "—"}</span>
                            </div>

                            {bill0?.address && (
                              <div className="flex items-start gap-2 text-slate-700">
                                <MapPin className="w-4 h-4 text-[#fc7182] mt-0.5" />
                                <div className="text-sm">
                                  <p className="text-slate-700">
                                    {bill0.address}
                                  </p>
                                  <p className="text-slate-500 text-xs">
                                    {bill0.city}
                                    {bill0.state ? `, ${bill0.state}` : ""}{" "}
                                    {bill0.zipCode || ""}
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* actions */}
                          <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-3 py-1 text-xs text-slate-600">
                              Admin access:
                              <span
                                className={`font-semibold ${u.isAdmin ? "text-[#2b6f99]" : "text-slate-700"}`}
                              >
                                {u.isAdmin ? "Yes" : "No"}
                              </span>
                            </div>

                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                variant={u.isAdmin ? "outline" : "default"}
                                onClick={() => toggleAdmin(u)}
                                disabled={
                                  !canEditAdmins || isBusy || u.id === user?.uid
                                }
                                className="rounded-full shadow-sm"
                                title={
                                  !canEditAdmins
                                    ? "Admins only"
                                    : u.id === user?.uid
                                      ? "Cannot change your own admin status here"
                                      : ""
                                }
                              >
                                {isBusy
                                  ? "Updating..."
                                  : u.isAdmin
                                    ? "Remove Admin"
                                    : "Make Admin"}
                              </Button>

                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => deleteUserDoc(u)}
                                disabled={
                                  !canEditAdmins || isBusy || u.id === user?.uid
                                }
                                className="rounded-full"
                                title={
                                  !canEditAdmins
                                    ? "Admins only"
                                    : u.id === user?.uid
                                      ? "Cannot delete yourself here"
                                      : ""
                                }
                              >
                                {isBusy ? "..." : "Delete"}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                <div className="mt-6 flex items-center gap-2">
                  {hasMore && (
                    <Button
                      variant="outline"
                      onClick={fetchMore}
                      disabled={loadingMore}
                      className="rounded-full bg-white/70 backdrop-blur border-slate-200"
                    >
                      {loadingMore ? "Loading..." : "Load more"}
                    </Button>
                  )}

                  <Button
                    variant="outline"
                    onClick={refresh}
                    className="rounded-full bg-white/70 backdrop-blur border-slate-200"
                  >
                    Refresh
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
