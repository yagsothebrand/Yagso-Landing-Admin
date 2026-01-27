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

const BRAND = "#948179";
const CREAM = "#fbfaf8";

export default function UsersPage() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  const canEditAdmins = Boolean(user?.isAdmin);
  const PAGE_SIZE = 30;

  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [users, setUsers] = useState([]);
  const [qText, setQText] = useState("");
  const [lastDoc, setLastDoc] = useState(null);
  const [hasMore, setHasMore] = useState(false);
  const [busyId, setBusyId] = useState(null);

  const fetchFirstPage = useCallback(async () => {
    setLoading(true);
    try {
      const ref = collection(db, "users");
      const q = query(ref, orderBy("createdAt", "desc"), limit(PAGE_SIZE));
      const snap = await getDocs(q);

      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setUsers(list);

      const last = snap.docs[snap.docs.length - 1] || null;
      setLastDoc(last);
      setHasMore(snap.docs.length === PAGE_SIZE);
    } catch (e) {
      console.error(e);
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
      console.error(e);
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
      const bill0 = Array.isArray(u.billingInfo) ? u.billingInfo[0] : u.billingInfo;
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
      if (!canEditAdmins) return toast.error("Only admins can change admin status");
      if (targetUser.id === user?.uid) return toast.error("You cannot change your own admin status");

      setBusyId(targetUser.id);
      try {
        const next = !Boolean(targetUser.isAdmin);
        await updateDoc(doc(db, "users", targetUser.id), { isAdmin: next });
        setUsers((prev) =>
          prev.map((u) => (u.id === targetUser.id ? { ...u, isAdmin: next } : u)),
        );
        toast.success(next ? "User is now an admin" : "Admin removed");
      } catch (e) {
        console.error(e);
        toast.error(e?.message || "Failed to update admin status");
      } finally {
        setBusyId(null);
      }
    },
    [canEditAdmins, user?.uid],
  );

  const deleteUserDoc = useCallback(
    async (targetUser) => {
      if (!canEditAdmins) return toast.error("Only admins can delete users");
      if (targetUser.id === user?.uid) return toast.error("You cannot delete yourself");

      setBusyId(targetUser.id);
      try {
        await deleteDoc(doc(db, "users", targetUser.id));
        setUsers((prev) => prev.filter((u) => u.id !== targetUser.id));
        toast.success("User record deleted");
      } catch (e) {
        console.error(e);
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
    if (authLoading || !user) return;
    fetchFirstPage();
  }, [authLoading, user, fetchFirstPage]);

  if (authLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }
  if (!user) return null;

  return (
    <>
      <Header />

      {/* YAGSO BACKDROP */}
      <div
        className="relative min-h-screen pb-16 overflow-hidden"
        style={{ backgroundColor: CREAM }}
      >
        {/* soft editorial glows */}
        <div
          className="pointer-events-none absolute -top-40 -left-40 h-[520px] w-[520px] rounded-full blur-3xl opacity-60"
          style={{ backgroundColor: `${BRAND}14` }}
        />
        <div
          className="pointer-events-none absolute -bottom-48 -right-40 h-[560px] w-[560px] rounded-full blur-3xl opacity-60"
          style={{ backgroundColor: `${BRAND}10` }}
        />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-[110px]">
          {/* back */}
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 rounded-full border bg-white/70 px-4 py-2 text-slate-700 shadow-sm backdrop-blur hover:bg-white transition mb-8"
            style={{ borderColor: `${BRAND}26` }}
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          {/* header */}
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between mb-8">
            <div className="space-y-2">
              <div
                className="inline-flex items-center gap-2 rounded-full border bg-white/70 px-3 py-1 text-xs shadow-sm backdrop-blur"
                style={{ borderColor: `${BRAND}26`, color: `${BRAND}` }}
              >
                <Shield className="w-3.5 h-3.5" style={{ color: BRAND }} />
                Customer directory
                {!canEditAdmins && (
                  <span className="ml-1 text-slate-400">(admin editing disabled)</span>
                )}
              </div>

              <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900">
                Users
              </h1>
              <p className="text-slate-600 text-sm">
                Search and manage customer accounts in a clean, Yagso-style view.
              </p>
            </div>

            <div className="w-full sm:w-[420px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  value={qText}
                  onChange={(e) => setQText(e.target.value)}
                  placeholder="Search name, email, phone, city..."
                  className="pl-10 bg-white/80 backdrop-blur rounded-full shadow-sm focus-visible:ring-2"
                  style={{
                    borderColor: `${BRAND}26`,
                    boxShadow: "0 10px 30px rgba(0,0,0,0.04)",
                  }}
                />
              </div>
            </div>
          </div>

          {/* content */}
          {loading ? (
            <div className="grid md:grid-cols-2 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-3xl border bg-white/70 p-6 shadow-sm backdrop-blur animate-pulse"
                  style={{ borderColor: `${BRAND}1f` }}
                />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/75 backdrop-blur rounded-3xl border p-10 shadow-lg text-center"
              style={{ borderColor: `${BRAND}1f` }}
            >
              <User className="w-14 h-14 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-900 font-semibold">No users found</p>
              <p className="text-slate-500 text-sm mt-1">Try changing your search.</p>
            </motion.div>
          ) : (
            <>
              <div className="grid md:grid-cols-2 gap-4">
                {filtered.map((u, idx) => {
                  const bill0 = Array.isArray(u.billingInfo) ? u.billingInfo[0] : u.billingInfo;
                  const isBusy = busyId === u.id;

                  return (
                    <motion.div
                      key={u.id}
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: Math.min(idx * 0.03, 0.25) }}
                      className="group relative overflow-hidden rounded-3xl border bg-white/75 p-6 backdrop-blur transition hover:-translate-y-0.5"
                      style={{
                        borderColor: `${BRAND}1f`,
                        boxShadow: "0 18px 50px -35px rgba(15,23,42,0.55)",
                      }}
                    >
                      {/* soft hover glow */}
                      <div
                        className="pointer-events-none absolute -top-24 -right-24 h-56 w-56 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition"
                        style={{ backgroundColor: `${BRAND}14` }}
                      />

                      <div className="relative z-10">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="font-semibold text-slate-900 truncate">
                              {u.fullName || "Unnamed User"}
                            </p>
                            <p className="text-xs text-slate-500 mt-1">ID: {String(u.id)}</p>
                          </div>

                          <span
                            className="text-[11px] px-2.5 py-1 rounded-full border bg-white/70"
                            style={{
                              borderColor: `${BRAND}26`,
                              color: u.isAdmin ? "#0f172a" : BRAND,
                            }}
                          >
                            {u.isAdmin ? "Admin" : "User"}
                          </span>
                        </div>

                        <div className="mt-4 space-y-2 text-sm">
                          <div className="flex items-center gap-2 text-slate-700">
                            <Mail className="w-4 h-4" style={{ color: BRAND }} />
                            <span className="truncate">{u.email || "—"}</span>
                          </div>

                          <div className="flex items-center gap-2 text-slate-700">
                            <Phone className="w-4 h-4" style={{ color: BRAND }} />
                            <span>{u.phone || "—"}</span>
                          </div>

                          {bill0?.address && (
                            <div className="flex items-start gap-2 text-slate-700">
                              <MapPin className="w-4 h-4 mt-0.5" style={{ color: BRAND }} />
                              <div className="text-sm">
                                <p>{bill0.address}</p>
                                <p className="text-slate-500 text-xs">
                                  {bill0.city}
                                  {bill0.state ? `, ${bill0.state}` : ""}{" "}
                                  {bill0.zipCode || ""}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                          <div
                            className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs border bg-white/60"
                            style={{ borderColor: `${BRAND}26`, color: BRAND }}
                          >
                            Admin: {u.isAdmin ? "Yes" : "No"}
                          </div>

                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => toggleAdmin(u)}
                              disabled={!canEditAdmins || isBusy || u.id === user?.uid}
                              className="rounded-full bg-white/70 backdrop-blur"
                              style={{ borderColor: `${BRAND}40` }}
                            >
                              {isBusy ? "Updating..." : u.isAdmin ? "Remove Admin" : "Make Admin"}
                            </Button>

                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => deleteUserDoc(u)}
                              disabled={!canEditAdmins || isBusy || u.id === user?.uid}
                              className="rounded-full"
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

              <div className="mt-7 flex items-center gap-2">
                {hasMore && (
                  <Button
                    variant="outline"
                    onClick={fetchMore}
                    disabled={loadingMore}
                    className="rounded-full bg-white/70 backdrop-blur"
                    style={{ borderColor: `${BRAND}40` }}
                  >
                    {loadingMore ? "Loading..." : "Load more"}
                  </Button>
                )}

                <Button
                  variant="outline"
                  onClick={refresh}
                  className="rounded-full bg-white/70 backdrop-blur"
                  style={{ borderColor: `${BRAND}40` }}
                >
                  Refresh
                </Button>
              </div>
            </>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}
