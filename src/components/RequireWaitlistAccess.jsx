import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useLandingAuth } from "@/components/auth/LandingAuthProvider";

export default function RequireWaitlistAccess() {
  const { accessGranted, loading } = useLandingAuth();
  const location = useLocation();

  // ✅ show a loader instead of blank page
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="rounded-2xl border border-white/15 bg-white/10 backdrop-blur-md px-6 py-4 text-white">
          <p className="font-semibold">Loading…</p>
          <p className="text-sm text-white/75 mt-1">Preparing your access.</p>
        </div>
      </div>
    );
  }

  // ✅ allow public pages (waitlist + token links)
  if (location.pathname === "/waitlist") return <Outlet />;
  if (/^\/[^/]+$/.test(location.pathname)) return <Outlet />; 
  // ^ this allows "/:tokenId" (one path segment) to stay public

  // ✅ protect everything else
  if (!accessGranted) return <Navigate to="/waitlist" replace />;

  return <Outlet />;
}
