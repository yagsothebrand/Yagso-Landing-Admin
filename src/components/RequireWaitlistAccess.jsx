import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useLandingAuth } from "@/components/auth/LandingAuthProvider";

const BRAND = "#948179";

export default function RequireWaitlistAccess() {
  const { accessGranted, loading } = useLandingAuth();
  const location = useLocation();

  // Clean loading state matching profile design
  if (loading) {
    return (
      <div className="min-h-screen bg-[#fbfaf8]/40 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Loading spinner */}
          <div className="flex justify-center mb-6">
            <div
              className="w-16 h-16 border-4 border-slate-200 border-t-transparent rounded-full animate-spin"
              style={{ borderTopColor: BRAND }}
            />
          </div>

          {/* Loading card */}
          <div className="bg-white/50 backdrop-blur border border-slate-200 rounded-none overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 bg-white/70">
              <div className="flex items-center justify-between">
                <p className="text-sm tracking-[0.18em] uppercase font-bold text-slate-700">
                  Loading
                </p>
                <span className="text-[11px] tracking-[0.18em] uppercase text-slate-400">
                  Please Wait
                </span>
              </div>
            </div>

            <div className="p-6 text-center">
              <p className="text-slate-600 font-medium">
                Preparing your access...
              </p>
              <p className="text-sm text-slate-400 mt-2">
                This will only take a moment
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Allow public pages (waitlist + token links)
  if (location.pathname === "/waitlist") return <Outlet />;
  if (/^\/[^/]+$/.test(location.pathname)) return <Outlet />; 
  // ^ this allows "/:tokenId" (one path segment) to stay public

  // Protect everything else
  if (!accessGranted) return <Navigate to="/waitlist" replace />;

  return <Outlet />;
}