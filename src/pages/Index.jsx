import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth, db } from "../firebase";
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import useAuths from "../hooks/useAuths";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Mail, Phone, Car, AlertCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion, AnimatePresence } from "framer-motion";
import { sendAccountMail } from "@/lib/email-service";

export default function InvoiceLoginForm() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
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

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [userData, setUserData] = useState(null);

  const [validationErrors, setValidationErrors] = useState({});

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

    if (!signupData.firstName.trim()) {
      errors.firstName = "First name is required";
    }

    if (!signupData.lastName.trim()) {
      errors.lastName = "Last name is required";
    }

    if (!signupData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(signupData.email)) {
      errors.email = "Email is invalid";
    }

    if (!signupData.phone.trim()) {
      errors.phone = "Phone number is required";
    }

    if (!signupData.role.trim()) {
      errors.role = "Role is required";
    }

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSignupData({ ...signupData, [name]: value });
    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors({ ...validationErrors, [name]: "" });
    }
  };

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors({ ...validationErrors, [name]: "" });
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateLoginForm()) {
      return;
    }

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
      console.error(err.message);
      setError(err.message || "Something went wrong");
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateSignupForm()) {
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");
    // await sendAccountMail(signupData);
    setLoading(false);
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
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const roles = [
    "CEO",
    "General Manager",
    "Sales Representative",
    // "Accountant",
    // "Invoice Clerk",
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2,
      },
    },
  };

  const leftPanelVariants = {
    hidden: { x: -100, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  const rightPanelVariants = {
    hidden: { x: 100, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  const tabVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: { duration: 0.3 },
    },
  };

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

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen bg-gray-50 font-inter"
      style={{ fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif" }}
    >
      <div className="flex min-h-screen">
        {/* Left Panel - Image/Branding */}
        <motion.div
          variants={leftPanelVariants}
          className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-gray-900 via-gray-800 to-slate-900 relative overflow-hidden"
        >
          {/* Automotive Parts Background */}
          <div className="absolute inset-0 opacity-30">
            <div
              className="w-full h-full bg-cover bg-center"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 600'%3E%3Cdefs%3E%3Cpattern id='auto-parts' patternUnits='userSpaceOnUse' width='100' height='100'%3E%3Ccircle cx='20' cy='20' r='8' fill='%23ffffff' opacity='0.1'/%3E%3Crect x='40' y='10' width='15' height='20' fill='%23ffffff' opacity='0.08'/%3E%3Ccircle cx='70' cy='30' r='12' fill='%23ffffff' opacity='0.06'/%3E%3Cpath d='M10,60 L30,70 L30,80 L10,90 Z' fill='%23ffffff' opacity='0.07'/%3E%3Ccircle cx='80' cy='80' r='6' fill='%23ffffff' opacity='0.09'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23auto-parts)'/%3E%3C/svg%3E")`,
              }}
            />
          </div>

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-white" />

          <div className="relative z-10 flex flex-col justify-center items-center text-center px-12 text-white">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="mb-8"
            >
              {/* Company Logo */}
              <img
                src="/images/osondu-bg.png"
                className="w20 h-30 text-center items-center"
              />
            </motion.div>

            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="bg-gradient-to-br from-gray-700 via-gray-600 to-slate-700 rounded-2xl p-6 border border-slate-300/20 text-white"
            >
              <h3 className="text-xl font-semibold mb-3">
                Inventory Management System
              </h3>
              <p>
                Simplify and optimize your automotive parts operations with our
                all-in-one platform for seamless invoicing, billing, and
                inventory management.
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* Right Panel - Form */}
        <motion.div
          variants={rightPanelVariants}
          className="w-full lg:w-1/2 flex items-center justify-center px-6 py-8 bg-gradient-to-br from-gray-900/80 via-slate-900/60 to-gray-900/90"
        >
          <motion.div className="w-full max-w-md">
            {/* Mobile Logo */}
            <div className="lg:hidden text-center mb-8">
              <div className="w-20 h-20 mx-auto mb-8 rounded-xl  flex flex-col items-center justify-center p-2">
                <img
                  src="/images/osondu-logo.png"
                  className="w-25 h-30 text-center items-center"
                />
              </div>
              {/* <h1 className="text-2xl font-bold text-gray-900 mb-1">
                OSONDU NIGERIA
              </h1>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                ENTERPRISES
              </h2> */}
              <p className="text-black-600">Inventory Management System</p>

              {/* Mobile Brand Logos */}
            </div>

            <Card className="shadow-xl border-0 bg-white">
              <CardHeader className="text-center pb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Welcome Back
                </h3>
                <p className="text-gray-600">
                  Access your invoice management dashboard
                </p>
              </CardHeader>

              <CardContent className="px-6 pb-6">
                <Tabs
                  value={activeTab}
                  onValueChange={setActiveTab}
                  className="w-full"
                >
                  <TabsList className="grid w-full grid-cols-2 mb-6 bg-gray-100">
                    <TabsTrigger
                      value="login"
                      className="font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-slate-500 data-[state=active]:to-slate-600 data-[state=active]:text-white"
                    >
                      Sign In
                    </TabsTrigger>
                    <TabsTrigger
                      value="signup"
                      className="font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-slate-500 data-[state=active]:to-slate-600 data-[state=active]:text-white"
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
                            className="text-sm font-semibold text-gray-700"
                          >
                            Email Address
                          </Label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400 pointer-events-none" />

                            <Input
                              id="login-email"
                              name="email"
                              type="email"
                              value={loginData.email}
                              onChange={handleLoginChange}
                              className={`pl-10 h-12 border-2 transition-all duration-200 ${
                                validationErrors.email
                                  ? "border-red-300 focus:border-red-500"
                                  : "border-gray-200 focus:border-slate-500"
                              }`}
                              placeholder="Enter your email address"
                            />
                          </div>
                          <ErrorMessage message={validationErrors.email} />
                        </div>

                        <div className="space-y-2">
                          <Label
                            htmlFor="login-password"
                            className="text-sm font-semibold text-gray-700"
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
                                  : "border-gray-200 focus:border-slate-500"
                              }`}
                              placeholder="Enter your password"
                            />
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
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
                            className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg text-sm"
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
                            className="w-full h-12 font-semibold bg-gradient-to-r from-slate-500 to-slate-600 hover:from-slate-600 hover:to-slate-700 text-white shadow-lg transition-all duration-200"
                            disabled={loading}
                          >
                            {loading ? (
                              <div className="flex items-center justify-center space-x-2">
                                <motion.div
                                  animate={{ rotate: 360 }}
                                  transition={{
                                    duration: 1,
                                    repeat: Infinity,
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

                    <TabsContent value="signup">
                      <motion.form
                        key="signup-form"
                        variants={tabVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        onSubmit={handleSubmit}
                        className="space-y-4 max-h-96 overflow-y-auto pr-2"
                      >
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-2">
                            <Label
                              htmlFor="firstName"
                              className="text-sm font-semibold text-gray-700"
                            >
                              First Name
                            </Label>
                            <Input
                              name="firstName"
                              value={signupData.firstName}
                              onChange={handleChange}
                              className={`h-11 border-2 transition-all duration-200 ${
                                validationErrors.firstName
                                  ? "border-red-300 focus:border-red-500"
                                  : "border-gray-200 focus:border-slate-500"
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
                              className="text-sm font-semibold text-gray-700"
                            >
                              Last Name
                            </Label>
                            <Input
                              name="lastName"
                              value={signupData.lastName}
                              onChange={handleChange}
                              className={`h-11 border-2 transition-all duration-200 ${
                                validationErrors.lastName
                                  ? "border-red-300 focus:border-red-500"
                                  : "border-gray-200 focus:border-slate-500"
                              }`}
                              placeholder="Last name"
                            />
                            <ErrorMessage message={validationErrors.lastName} />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label
                            htmlFor="signup-email"
                            className="text-sm font-semibold text-gray-700"
                          >
                            Email Address
                          </Label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400 pointer-events-none" />

                            <Input
                              name="email"
                              type="email"
                              value={signupData.email}
                              onChange={handleChange}
                              className={`pl-10 h-11 border-2 transition-all duration-200 ${
                                validationErrors.email
                                  ? "border-red-300 focus:border-red-500"
                                  : "border-gray-200 focus:border-slate-500"
                              }`}
                              placeholder="Enter your email"
                            />
                          </div>
                          <ErrorMessage message={validationErrors.email} />
                        </div>

                        <div className="space-y-2">
                          <Label
                            htmlFor="phone"
                            className="text-sm font-semibold text-gray-700"
                          >
                            Phone Number
                          </Label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                              name="phone"
                              type="tel"
                              value={signupData.phone}
                              onChange={handleChange}
                              className={`pl-10 h-11 border-2 transition-all duration-200 ${
                                validationErrors.phone
                                  ? "border-red-300 focus:border-red-500"
                                  : "border-gray-200 focus:border-slate-500"
                              }`}
                              placeholder="Phone number"
                            />
                          </div>
                          <ErrorMessage message={validationErrors.phone} />
                        </div>

                        <div className="space-y-2">
                          <Label
                            htmlFor="role"
                            className="text-sm font-semibold text-gray-700"
                          >
                            Role
                          </Label>
                          <select
                            name="role"
                            value={signupData.role}
                            onChange={handleChange}
                            className={`w-full h-11 px-3 border-2 rounded-md text-sm transition-all duration-200 bg-white ${
                              validationErrors.role
                                ? "border-red-300 focus:border-red-500"
                                : "border-gray-200 focus:border-blue-500"
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
                            className="text-sm font-semibold text-gray-700"
                          >
                            Password
                          </Label>
                          <div className="relative">
                            <Input
                              name="password"
                              type={showPassword ? "text" : "password"}
                              value={signupData.password}
                              onChange={handleChange}
                              className={`pr-10 h-11 border-2 transition-all duration-200 ${
                                validationErrors.password
                                  ? "border-red-300 focus:border-red-500"
                                  : "border-gray-200 focus:border-slate-500"
                              }`}
                              placeholder="Create password"
                            />
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
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
                            className="text-sm font-semibold text-gray-700"
                          >
                            Confirm Password
                          </Label>
                          <Input
                            name="confirmPassword"
                            type={showPassword ? "text" : "password"}
                            value={signupData.confirmPassword}
                            onChange={handleChange}
                            className={`h-11 border-2 transition-all duration-200 ${
                              validationErrors.confirmPassword
                                ? "border-red-300 focus:border-red-500"
                                : "border-gray-200 focus:border-blue-500"
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
                            className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg text-sm"
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
                            className="w-full h-12 font-semibold bg-gradient-to-r from-slate-500 to-slate-600 hover:from-slate-600 hover:to-slate-700 text-white shadow-lg transition-all duration-200"
                            disabled={loading}
                          >
                            {loading ? (
                              <div className="flex items-center justify-center space-x-2">
                                <motion.div
                                  animate={{ rotate: 360 }}
                                  transition={{
                                    duration: 1,
                                    repeat: Infinity,
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

          {/* Footer */}
        </motion.div>

        <style jsx>{`
          .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #888;
            border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #555;
          }
        `}</style>
        {/* <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-center text-white/60 text-sm mt-6"
          >
            © 2025 Osondu Autos Nigeria. All rights reserved.
          </motion.p> */}
      </div>
    </motion.div>
  );
}
