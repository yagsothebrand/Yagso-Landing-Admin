"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth, db } from "../../firebase";
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import {
  Eye,
  EyeOff,
  Mail,
  Phone,
  AlertCircle,
  Sparkles,
  Lock,
  ShoppingBag,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useAuths from "@/hooks/useAuths";
import { useNavigate } from "react-router-dom";
import { sendAccountMail } from "@/lib/email-service";

export default function YagsoLoginForm() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("login");
  const [showPassword, setShowPassword] = useState(false);

  const [validationErrors, setValidationErrors] = useState({});

  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [signupData, setSignupData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    role: "",
    department: "Admin",
    password: "",
    confirmPassword: "",
  });
  const { loading, error, success, setLoading, setError, setSuccess } =
    useAuths();

  const [userData, setUserData] = useState(null);

  const validateLoginForm = () => {
    const errors = {};
    if (!loginData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(loginData.email)) {
      errors.email = "Email is invalid";
    }
    if (!loginData.password.trim()) {
      errors.password = "Password is required";
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateSignupForm = () => {
    const errors = {};
    if (!signupData.firstName.trim())
      errors.firstName = "First name is required";
    if (!signupData.lastName.trim()) errors.lastName = "Last name is required";
    if (!signupData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(signupData.email)) {
      errors.email = "Email is invalid";
    }
    if (!signupData.phone.trim()) errors.phone = "Phone number is required";
    if (!signupData.role.trim()) errors.role = "Role is required";
    if (!signupData.password.trim()) {
      errors.password = "Password is required";
    } else if (signupData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }
    if (!signupData.confirmPassword.trim()) {
      errors.confirmPassword = "Please confirm your password";
    } else if (signupData.password !== signupData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
    if (validationErrors[name]) {
      setValidationErrors({ ...validationErrors, [name]: "" });
    }
  };

  const handleSignupChange = (e) => {
    const { name, value } = e.target;
    setSignupData({ ...signupData, [name]: value });
    if (validationErrors[name]) {
      setValidationErrors({ ...validationErrors, [name]: "" });
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateLoginForm()) return;
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        loginData.email,
        loginData.password
      );

      const user = userCredential.user;
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const userDat = docSnap.data();
        if (userDat.status === "inactive") {
          await signOut(auth);
          setError("Your account is inactive. Contact admin.");
          setLoading(false);
        } else {
          // Update last login timestamp
          await updateDoc(docRef, {
            lastLogin: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });

          // Get updated user data with new lastLogin
          const updatedDocSnap = await getDoc(docRef);
          const updatedUserData = updatedDocSnap.data();

          setUserData(updatedUserData);
          setLoading(false);
          setSuccess("Login successful! Redirecting to dashboard...");
          navigate("/dashboard", { state: { user: updatedUserData } });
        }
      } else {
        setError("No profile found for this user");
        setLoading(false);
      }
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!validateSignupForm()) return;
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        signupData.email,
        signupData.password
      );
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        authId: user.uid,
        firstName: signupData.firstName,
        lastName: signupData.lastName,
        email: signupData.email,
        phone: signupData.phone,
        role: signupData.role,
        department: signupData.department,
        status: "inactive",
        profileImage: "",
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      // ✅ Send notification email
      await sendAccountMail(signupData);

      setSuccess("Account created successfully! You can now log in.");

      setSignupData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        role: "",
        department: "",
        password: "",
        confirmPassword: "",
      });
      setTimeout(() => {
        setActiveTab("login");
        setSuccess("");
      }, 2000);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const roles = ["CEO", "General Manager", "Sales Representative"];

  const ErrorMessage = ({ message }) => {
    if (!message) return null;
    return (
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
        exit={{ opacity: 0, height: 0 }}
        className="flex items-center gap-2 text-red-600 text-sm mt-1"
      >
        <AlertCircle className="w-4 h-4" />
        <span>{message}</span>
      </motion.div>
    );
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.8, staggerChildren: 0.2 },
    },
  };

  const leftPanelVariants = {
    hidden: { x: -100, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  const rightPanelVariants = {
    hidden: { x: 100, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  const tabVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
  };

  const features = [
    {
      icon: Sparkles,
      title: "Premium Inventory",
      desc: "Manage your jewelry collection with elegance",
    },
    {
      icon: ShoppingBag,
      title: "Multi-Currency Sales",
      desc: "Accept payments in multiple currencies via Paystack",
    },
    {
      icon: Globe,
      title: "Global Reach",
      desc: "Connect with customers worldwide",
    },
    {
      icon: Lock,
      title: "Secure Dashboard",
      desc: "Enterprise-grade security for your data",
    },
  ];

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen bg-gradient-to-br from-green-50 via-amber-50 to-green-50"
    >
      <div className="flex min-h-screen">
        {/* Left Panel */}
        <motion.div
          variants={leftPanelVariants}
          className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-white-800 via-green-800 to-slate-700 relative overflow-hidden"
        >
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-20 left-20 w-72 h-72 bg-amber-300 rounded-full blur-3xl" />
            <div className="absolute bottom-20 right-20 w-96 h-96 bg-green-300 rounded-full blur-3xl" />
            <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-amber-200 rounded-full blur-3xl opacity-50" />
          </div>

          <div className="relative z-10 flex flex-col justify-center items-center text-center px-12">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
              className=""
            >
              <img
                src="/logo.png"
                alt="Yagso"
                className="w-48 h-auto drop-shadow-lg"
              />
            </motion.div>

            <motion.div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                <p className="text-amber-200 text-lg font-semibold">
                  Admin Dashboard
                </p>
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="text-base text-green-100 leading-relaxed max-w-md"
              >
                Manage your premium jewelry collection, track inventory, process
                orders, and grow your business with confidence.
              </motion.p>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="grid grid-cols-2 gap-4 pt-8"
              >
                {features.map((feature, i) => {
                  const Icon = feature.icon;
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 + i * 0.1, duration: 0.5 }}
                      className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 hover:border-amber-300/50 transition-all duration-300"
                    >
                      <Icon className="w-6 h-6 text-amber-300 mb-2 mx-auto" />
                      <p className="font-semibold text-white text-sm">
                        {feature.title}
                      </p>
                      <p className="text-xs text-green-100 mt-1">
                        {feature.desc}
                      </p>
                    </motion.div>
                  );
                })}
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 0.6 }}
                className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10 mt-3"
              >
                <h3 className="text-white font-bold mb-3 text-sm">
                  Platform Features
                </h3>
                <ul className="space-y-2 text-xs text-green-100">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-amber-300 rounded-full" />
                    Product catalog with advanced filtering
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-amber-300 rounded-full" />
                    Secure multi-currency checkout
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-amber-300 rounded-full" />
                    Order management & tracking
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-amber-300 rounded-full" />
                    WhatsApp integration for support
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-amber-300 rounded-full" />
                    Email notifications & analytics
                  </li>
                </ul>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        {/* Right Panel */}
        <motion.div
          variants={rightPanelVariants}
          className="w-full lg:w-1/2 flex items-center justify-center px-6 py-8 relative overflow-hidden"
        >
          <video
            autoPlay
            muted
            loop
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src="/moo.mp4" type="video/mp4" />
          </video>

          <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/40 to-black/50" />

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="w-full max-w-md relative z-10"
          >
            <div className="lg:hidden text-center mb-8">
              <div className="w-20 h-20 mx-auto mb-4">
                <img
                  src="/logo.png"
                  alt="Yagso"
                  className="w-full h-full object-contain drop-shadow-lg"
                />
              </div>
              <p className="text-white font-bold text-lg">Yagso Admin</p>
              <p className="text-amber-200 text-sm">
                Jewelry Management Platform
              </p>
            </div>

            <Card className="shadow-2xl border-0 bg-white">
              <CardHeader className="text-center pb-6 border-b border-green-100">
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                >
                  <h3 className="text-3xl font-bold text-green-900 mb-2">
                    {activeTab === "login" ? "Welcome Back" : "Join Us"}
                  </h3>
                  <p className="text-green-800 text-sm">
                    Access your jewelry inventory dashboard
                  </p>
                </motion.div>
              </CardHeader>

              <CardContent className="px-6 pb-6">
                <Tabs
                  value={activeTab}
                  onValueChange={setActiveTab}
                  className="w-full"
                >
                  <TabsList className="grid w-full grid-cols-2 mb-6 bg-gradient-to-r from-green-50 to-amber-50 p-1">
                    <TabsTrigger
                      value="login"
                      className="font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-600 data-[state=active]:to-green-800 data-[state=active]:text-white data-[state=active]:shadow-md"
                    >
                      Sign In
                    </TabsTrigger>
                    <TabsTrigger
                      value="signup"
                      className="font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-600 data-[state=active]:to-green-800 data-[state=active]:text-white data-[state=active]:shadow-md"
                    >
                      Create Account
                    </TabsTrigger>
                  </TabsList>

                  <AnimatePresence mode="wait">
                    <TabsContent value="login" className="space-y-4">
                      <motion.form
                        key="login-form"
                        variants={tabVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        onSubmit={handleLogin}
                        className="space-y-4"
                      >
                        <div className="space-y-2">
                          <Label
                            htmlFor="login-email"
                            className="text-sm font-semibold text-green-900"
                          >
                            Email Address
                          </Label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-3 h-5 w-5 text-green-700 pointer-events-none" />
                            <Input
                              id="login-email"
                              name="email"
                              type="email"
                              value={loginData.email}
                              onChange={handleLoginChange}
                              className={`pl-10 h-12 border-2 transition-all duration-200 ${
                                validationErrors.email
                                  ? "border-red-300 focus:border-red-500"
                                  : "border-green-300 focus:border-green-600"
                              }`}
                              placeholder="Enter your email"
                            />
                          </div>
                          <ErrorMessage message={validationErrors.email} />
                        </div>

                        <div className="space-y-2">
                          <Label
                            htmlFor="login-password"
                            className="text-sm font-semibold text-green-900"
                          >
                            Password
                          </Label>
                          <div className="relative">
                            <Input
                              id="login-password"
                              name="password"
                              type={showPassword ? "text" : "password"}
                              value={loginData.password}
                              onChange={handleLoginChange}
                              className={`pr-10 h-12 border-2 transition-all duration-200 ${
                                validationErrors.password
                                  ? "border-red-300 focus:border-red-500"
                                  : "border-green-300 focus:border-green-600"
                              }`}
                              placeholder="Enter your password"
                            />
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-3 text-green-700 hover:text-green-900"
                            >
                              {showPassword ? (
                                <EyeOff className="h-5 w-5" />
                              ) : (
                                <Eye className="h-5 w-5" />
                              )}
                            </motion.button>
                          </div>
                          <ErrorMessage message={validationErrors.password} />
                        </div>

                        {error && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm"
                          >
                            {error}
                          </motion.div>
                        )}

                        {success && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-green-50 border border-green-300 text-green-800 px-4 py-3 rounded-lg text-sm"
                          >
                            {success}
                          </motion.div>
                        )}

                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Button
                            type="submit"
                            className="w-full h-12 font-semibold bg-gradient-to-r from-green-600 to-green-800 hover:from-green-700 hover:to-green-900 text-white shadow-lg transition-all duration-200"
                            disabled={loading}
                          >
                            {loading ? (
                              <div className="flex items-center justify-center space-x-2">
                                <motion.div
                                  animate={{ rotate: 360 }}
                                  transition={{
                                    duration: 1,
                                    repeat: 1000,
                                    ease: "linear",
                                  }}
                                  className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                                />
                                <span>Signing In...</span>
                              </div>
                            ) : (
                              "Sign In"
                            )}
                          </Button>
                        </motion.div>
                      </motion.form>
                    </TabsContent>

                    <TabsContent value="signup" className="space-y-4">
                      <motion.form
                        key="signup-form"
                        variants={tabVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        onSubmit={handleSignup}
                        className="space-y-4 max-h-96 overflow-y-auto pr-2"
                      >
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-2">
                            <Label
                              htmlFor="firstName"
                              className="text-sm font-semibold text-green-900"
                            >
                              First Name
                            </Label>
                            <Input
                              name="firstName"
                              value={signupData.firstName}
                              onChange={handleSignupChange}
                              className={`h-11 border-2 transition-all duration-200 ${
                                validationErrors.firstName
                                  ? "border-red-300 focus:border-red-500"
                                  : "border-green-300 focus:border-green-600"
                              }`}
                              placeholder="First name"
                            />
                            <ErrorMessage
                              message={validationErrors.firstName}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label
                              htmlFor="lastName"
                              className="text-sm font-semibold text-green-900"
                            >
                              Last Name
                            </Label>
                            <Input
                              name="lastName"
                              value={signupData.lastName}
                              onChange={handleSignupChange}
                              className={`h-11 border-2 transition-all duration-200 ${
                                validationErrors.lastName
                                  ? "border-red-300 focus:border-red-500"
                                  : "border-green-300 focus:border-green-600"
                              }`}
                              placeholder="Last name"
                            />
                            <ErrorMessage message={validationErrors.lastName} />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label
                            htmlFor="signup-email"
                            className="text-sm font-semibold text-green-900"
                          >
                            Email Address
                          </Label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-3 h-5 w-5 text-green-700 pointer-events-none" />
                            <Input
                              name="email"
                              type="email"
                              value={signupData.email}
                              onChange={handleSignupChange}
                              className={`pl-10 h-11 border-2 transition-all duration-200 ${
                                validationErrors.email
                                  ? "border-red-300 focus:border-red-500"
                                  : "border-green-300 focus:border-green-600"
                              }`}
                              placeholder="Enter your email"
                            />
                          </div>
                          <ErrorMessage message={validationErrors.email} />
                        </div>

                        <div className="space-y-2">
                          <Label
                            htmlFor="phone"
                            className="text-sm font-semibold text-green-900"
                          >
                            Phone Number
                          </Label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-3 h-4 w-4 text-green-700" />
                            <Input
                              name="phone"
                              type="tel"
                              value={signupData.phone}
                              onChange={handleSignupChange}
                              className={`pl-10 h-11 border-2 transition-all duration-200 ${
                                validationErrors.phone
                                  ? "border-red-300 focus:border-red-500"
                                  : "border-green-300 focus:border-green-600"
                              }`}
                              placeholder="Phone number"
                            />
                          </div>
                          <ErrorMessage message={validationErrors.phone} />
                        </div>

                        <div className="space-y-2">
                          <Label
                            htmlFor="role"
                            className="text-sm font-semibold text-green-900"
                          >
                            Role
                          </Label>
                          <select
                            name="role"
                            value={signupData.role}
                            onChange={handleSignupChange}
                            className={`w-full h-11 px-3 border-2 rounded-md text-sm transition-all duration-200 bg-white ${
                              validationErrors.role
                                ? "border-red-300 focus:border-red-500"
                                : "border-green-300 focus:border-green-600"
                            }`}
                          >
                            <option value="">Select your role</option>
                            {roles.map((role) => (
                              <option key={role} value={role}>
                                {role}
                              </option>
                            ))}
                          </select>
                          <ErrorMessage message={validationErrors.role} />
                        </div>

                        <div className="space-y-2">
                          <Label
                            htmlFor="signup-password"
                            className="text-sm font-semibold text-green-900"
                          >
                            Password
                          </Label>
                          <div className="relative">
                            <Input
                              name="password"
                              type={showPassword ? "text" : "password"}
                              value={signupData.password}
                              onChange={handleSignupChange}
                              className={`pr-10 h-11 border-2 transition-all duration-200 ${
                                validationErrors.password
                                  ? "border-red-300 focus:border-red-500"
                                  : "border-green-300 focus:border-green-600"
                              }`}
                              placeholder="Create password"
                            />
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-3 text-green-700 hover:text-green-900"
                            >
                              {showPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </motion.button>
                          </div>
                          <ErrorMessage message={validationErrors.password} />
                        </div>

                        <div className="space-y-2">
                          <Label
                            htmlFor="confirmPassword"
                            className="text-sm font-semibold text-green-900"
                          >
                            Confirm Password
                          </Label>
                          <Input
                            name="confirmPassword"
                            type={showPassword ? "text" : "password"}
                            value={signupData.confirmPassword}
                            onChange={handleSignupChange}
                            className={`h-11 border-2 transition-all duration-200 ${
                              validationErrors.confirmPassword
                                ? "border-red-300 focus:border-red-500"
                                : "border-green-300 focus:border-green-600"
                            }`}
                            placeholder="Confirm password"
                          />
                          <ErrorMessage
                            message={validationErrors.confirmPassword}
                          />
                        </div>

                        {error && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm"
                          >
                            {error}
                          </motion.div>
                        )}

                        {success && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-green-50 border border-green-300 text-green-800 px-4 py-3 rounded-lg text-sm"
                          >
                            {success}
                          </motion.div>
                        )}

                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Button
                            type="submit"
                            className="w-full h-12 font-semibold bg-gradient-to-r from-green-600 to-green-800 hover:from-green-700 hover:to-green-900 text-white shadow-lg transition-all duration-200"
                            disabled={loading}
                          >
                            {loading ? (
                              <div className="flex items-center justify-center space-x-2">
                                <motion.div
                                  animate={{ rotate: 360 }}
                                  transition={{
                                    duration: 1,
                                    repeat: 1000,
                                    ease: "linear",
                                  }}
                                  className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                                />
                                <span>Creating Account...</span>
                              </div>
                            ) : (
                              "Create Account"
                            )}
                          </Button>
                        </motion.div>
                      </motion.form>
                    </TabsContent>
                  </AnimatePresence>
                </Tabs>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}
