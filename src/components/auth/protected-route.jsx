import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "@/components/auth/AuthProvider";
import { ClipLoader } from "react-spinners";
import { ShieldAlert } from "lucide-react";
import { motion } from "framer-motion";

export function ProtectedRoute({ children, requiredRole }) {
  const { user, loadingGetUserInformation } = useAuth();
  const navigate = useNavigate();

  // Not logged in and done loading → redirect to login
  if (!user && !loadingGetUserInformation) {
    return <Navigate to="/login" replace />;
  }

  // Still loading user info → show loading state
  if (!user && loadingGetUserInformation) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-6 bg-gradient-to-br from-gray-50 to-gray-100">
        <ClipLoader size={60} color="#3B82F6" />
        <div className="text-center">
          <p className="text-lg font-semibold text-gray-700">
            Loading your dashboard...
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Almost there, thank you for waiting 🙌
          </p>
        </div>
      </div>
    );
  }

  // Role hierarchy check
  const roleHierarchy = ["Sales Representative", "General Manager", "CEO"];
  const userLevel = roleHierarchy.indexOf(user?.role);
  const requiredLevel = roleHierarchy.indexOf(requiredRole);

  if (requiredRole && userLevel < requiredLevel) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-white p-6">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-lg mx-auto"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 15,
              delay: 0.2,
            }}
            className="w-20 h-20 mx-auto mb-6 flex items-center justify-center bg-red-100 text-red-500 rounded-full shadow-lg"
          >
            <ShieldAlert size={42} />
          </motion.div>

          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Access Denied
          </h2>
          <p className="text-gray-500 mb-6 text-lg">
            You don’t have permission to access this page. <br/> Please contact an
            administrator.
          </p>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/dashboard")}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition"
          >
            ⬅ Return to Dashboard
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return children;
}
