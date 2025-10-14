import React, { useState } from "react";

export default function useAuths() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const success = await login(loginData.email, loginData.password);
      if (!success) {
        setError("Invalid credentials");
      }
    } catch (err) {
      setError("Login failed. Please try again.");
    }
    setLoading(false);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (signupData.password !== signupData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (signupData.password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    try {
      const userData = {
        firstName: signupData.firstName,
        lastName: signupData.lastName,
        email: signupData.email,
        phone: signupData.phone,
        department: "Admin",
       
        role: signupData.role,
        createdAt: new Date().toISOString(),
        status: "active",
      };

      await signup(signupData.email, signupData.password, userData);
      setSuccess("Account created successfully!");

      // Reset form
      setSignupData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        address: "",
        company: "",
        role: "",
        password: "",
        confirmPassword: "",
      });
    } catch (err) {
      setError("Signup failed. Please try again.");
    }
    setLoading(false);
  };

  return {
    handleLogin,
    loading,
    handleSignup,
    error,
    success,
    setError,
    setLoading,
    setSuccess,
  };
}
