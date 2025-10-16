import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useLandingAuth } from "@/components/landingauth/LandingAuthProvider";

export default function Page() {
  const navigate = useNavigate();
  const { id } = useParams(); // token in URL (e.g., /auth/:id)
  const { user, token, setToken, loading } = useLandingAuth();

  // 1️⃣ Handle new tokens from the URL dynamically
  useEffect(() => {
    if (id && id !== token) {
      // New token provided via URL
      console.log("🔑 Received new token:", id);
      setToken(id);
    }
  }, [id, token, setToken]);

  // 2️⃣ Handle routing logic based on user + token status
  useEffect(() => {
    if (loading) return; // wait until Firebase fetch finishes

    if (user) {
      console.log("✅ User authenticated — redirecting home");
      navigate("/", { replace: true });
    } else if (!token) {
      console.log("🚫 No token — redirecting to waitlist");
      navigate("/waitlist", { replace: true });
    } else {
      // Token exists but user not found (invalid token case)
      console.warn("⚠️ Invalid token — redirecting to waitlist");
      navigate("/waitlist", { replace: true });
    }
  }, [user, token, loading, navigate]);

  if (loading) return <p>Loading user...</p>;

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p>Landing...</p>
    </div>
  );
}
