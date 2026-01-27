import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/components/auth/AuthProvider";
import { Mail, Lock, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

const BRAND = "#948179";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, refreshUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);

    try {
      await login(email, password);
      
      // ✅ CRITICAL FIX: Wait for user state to be refreshed
      await refreshUser();
      
      toast.success("Welcome back!");
      navigate("/profile");
    } catch (error) {
      console.error("Login error:", error);
      if (error.code === "auth/user-not-found") {
        toast.error("No account found with this email");
      } else if (error.code === "auth/wrong-password") {
        toast.error("Incorrect password");
      } else if (error.code === "auth/invalid-credential") {
        toast.error("Invalid email or password");
      } else {
        toast.error("Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 bg-[#fbfaf8]">
      {/* Top navigation bar */}
     

      {/* Main content */}
      <div className="max-w-md mx-auto px-4">
        {/* Header */}
        <div className="">
          <p className="text-[12px] tracking-[0.18em] uppercase" style={{ color: BRAND }}>
            Account Access
          </p>
          <h1 className="text-3xl font-extrabold text-slate-900 mt-2">Welcome Back</h1>
          <p className="text-slate-600 mt-2">Log in to your YAGSO account</p>
        </div>

        {/* Login Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white/80 backdrop-blur border border-slate-200 rounded-none overflow-hidden"
        >
          {/* Card Header */}
          <div className="px-6 py-4 border-b border-slate-200 bg-white/70">
            <div className="flex items-center justify-between">
              <p className="text-sm tracking-[0.18em] uppercase font-bold text-slate-700">
                Login
              </p>
              <span className="text-[11px] tracking-[0.18em] uppercase text-slate-400">
                Secure Access
              </span>
            </div>
          </div>

          {/* Card Body */}
          <div className="p-6">
            <form onSubmit={handleLogin} className="space-y-5">
              {/* Email Field */}
              <div>
                <Label 
                  htmlFor="email"
                  className="text-slate-700 text-xs tracking-wide uppercase"
                >
                  Email Address <span className="text-red-500">*</span>
                </Label>
                <div className="relative mt-1.5">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="pl-10 h-11 rounded-none border-slate-200 bg-white placeholder:text-slate-300 focus-visible:ring-0 focus-visible:border-slate-400"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <Label 
                  htmlFor="password"
                  className="text-slate-700 text-xs tracking-wide uppercase"
                >
                  Password <span className="text-red-500">*</span>
                </Label>
                <div className="relative mt-1.5">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="pl-10 pr-10 h-11 rounded-none border-slate-200 bg-white placeholder:text-slate-300 focus-visible:ring-0 focus-visible:border-slate-400"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Forgot Password */}
              <div className="flex items-center justify-end">
                <Link
                  to="/forgot-password"
                  className="text-sm font-semibold hover:underline"
                  style={{ color: BRAND }}
                >
                  Forgot password?
                </Link>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-11 rounded-none text-white font-semibold tracking-wide hover:opacity-90 disabled:opacity-60"
                style={{ backgroundColor: BRAND }}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Logging in...
                  </span>
                ) : (
                  "Log In"
                )}
              </Button>
            </form>
          </div>
        </motion.div>

        {/* Sign Up Link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-slate-600">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="font-bold hover:underline"
              style={{ color: BRAND }}
            >
              Sign up
            </Link>
          </p>
        </div>

       
      </div>
    </div>
  );
}