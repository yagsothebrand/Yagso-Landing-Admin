"use client";

import { useAuth } from "@/components/auth/AuthProvider";
import { DashboardHome } from "@/pages/DashboardHome";
import { UserDashboard } from "@/pages/UserDashboard";
import React from "react";
import Layout from "./Layout";
import { DashboardSkeleton } from "@/pages/DashboardSkeleton";

export default function AdminDashboard() {
  const { user } = useAuth();

  // Show loading state while user data is being fetched
  // if (!user) {
  //   return (
  //     <Layout>
  //       <div className="flex items-center justify-center min-h-screen">
  //         <DashboardSkeleton> </DashboardSkeleton>
  //       </div>
  //     </Layout>
  //   );
  // }

  // Render appropriate dashboard based on user role
  if (user?.role != "Sales Representative") {
    return (
      <Layout>
        <DashboardHome />
      </Layout>
    );
  }

  // Default dashboard for all other roles
  return (
    <Layout>
      <UserDashboard />
    </Layout>
  );
}
