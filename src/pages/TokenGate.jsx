import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getWaitlistByToken, markWaitlistLogin } from "../utils/waitlistApi";
import { useLandingAuth } from "@/components/auth/LandingAuthProvider";

const BRAND = "#948179";

export default function TokenGate() {
  const { tokenId } = useParams();
  const navigate = useNavigate();
  const { setToken, setAccessGranted } = useLandingAuth();

  const [status, setStatus] = useState("loading"); // loading | error
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        if (!tokenId) throw new Error("Missing token.");

        const record = await getWaitlistByToken(tokenId);
        if (!record?.id) throw new Error("Invalid or expired link.");

        await markWaitlistLogin(tokenId);

        // ✅ grant access locally
        setToken(tokenId);
        setAccessGranted(true);

        // ✅ small delay helps guards see updated state before redirect
        await new Promise((r) => setTimeout(r, 150));

        if (!alive) return;
        navigate("/", { replace: true });
      } catch (e) {
        if (!alive) return;
        setError(e?.message || "Invalid link.");
        setStatus("error");
      }
    })();

    return () => {
      alive = false;
    };
  }, [tokenId, navigate, setToken, setAccessGranted]);

  if (status === "error") {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-md rounded-2xl border border-white/15 bg-white/10 backdrop-blur-md p-6 text-white">
          <p className="text-lg font-semibold">This link can’t be verified</p>
          <p className="mt-2 text-sm text-white/80">{error}</p>

          <div className="mt-5 flex gap-3">
            <button
              onClick={() => navigate("/waitlist", { replace: true })}
              className="px-4 py-2 rounded-full text-sm font-semibold bg-white/10 hover:bg-white/15 border border-white/15 transition"
            >
              Back to Waitlist
            </button>

            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 rounded-full text-sm font-semibold text-white"
              style={{ backgroundColor: BRAND }}
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // loading UI
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl border border-white/15 bg-white/10 backdrop-blur-md p-6 text-white">
        <div className="flex items-center gap-3">
          <div
            className="h-10 w-10 rounded-full border border-white/20 flex items-center justify-center"
            style={{ background: "rgba(255,255,255,0.06)" }}
          >
            <div
              className="h-3 w-3 rounded-full animate-pulse"
              style={{ backgroundColor: BRAND }}
            />
          </div>

          <div>
            <p className="text-lg font-semibold">Verifying access…</p>
            <p className="text-sm text-white/75">
              Please wait a moment. You’ll be redirected automatically.
            </p>
          </div>
        </div>

        <div className="mt-5 h-1 w-full bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full w-1/2 rounded-full animate-pulse"
            style={{ backgroundColor: BRAND }}
          />
        </div>
      </div>
    </div>
  );
}
