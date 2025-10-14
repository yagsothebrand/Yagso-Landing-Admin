"use client";
import { useEffect, useState } from "react";
import { Header } from "@/components/layout/Header";
import SidebarWrapper from "@/components/layout/SidebarWrapper.jsx";
import { useLocation } from "react-router-dom";
import { UserDashboard } from "./UserDashboard";
import { DashboardHome } from "./DashboardHome";
import { NotificationPopup } from "@/components/layout/NotificationsPopup";
import { AdministrationPage } from "./AdministrationPage";
import { InventoryPage } from "./InventoryPage";
import { BrandsPage } from "./BrandsPage";
import { CategoryPage } from "./CategoryPage";
import { AnalyticsDashboard } from "./AnalyticsDashboard";
import InvoicesPage from "./InvoicesPage";

export function AdminDashboard() {
  const [currentPage, setCurrentPage] = useState(() => {
    return localStorage.getItem("currentPage") || "dashboard";
  });

  const location = useLocation();
  const user = location.state?.user; // 👈 data passed from login

  const canAccessPage = (page) => {
    if (!user) return false;
    console.log(user.role);
    const roleHierarchy = ["Sales Representative", "General Manager", "CEO"];
    const userLevel = roleHierarchy.indexOf(user.role);

    switch (page) {
      case "administration":
        return userLevel >= 1; // Manager and above
      case "analytics":
        return userLevel >= 1; // Manager and above
      case "inventory":
        return userLevel >= 0; // All roles
      case "invoices":
        return userLevel >= 0; // All roles
      default:
        return true;
    }
  };

  useEffect(() => {
    localStorage.setItem("currentPage", currentPage);
  }, [currentPage]);

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return user?.role === "Sales Representative" ? (
          <UserDashboard />
        ) : (
          <DashboardHome />
        );
      case "invoices":
        return canAccessPage("invoices") ? (
          <InvoicesPage />
        ) : (
          <div className="text-center py-8 text-gray-500">Access Denied</div>
        );
      case "inventory":
        return canAccessPage("inventory") ? (
          <InventoryPage />
        ) : (
          <div className="text-center py-8 text-gray-500">Access Denied</div>
        );
      case "brands":
        return canAccessPage("brands") ? (
          <BrandsPage />
        ) : (
          <div className="text-center py-8 text-gray-500">Access Denied</div>
        );
      case "categories":
        return canAccessPage("Categories") ? (
          <CategoryPage />
        ) : (
          <div className="text-center py-8 text-gray-500">Access Denied</div>
        );
      case "administration":
        return canAccessPage("administration") ? (
          <AdministrationPage />
        ) : (
          <div className="text-center py-8 text-gray-500">Access Denied</div>
        );
      case "analytics":
        return canAccessPage("analytics") ? (
          <AnalyticsDashboard />
        ) : (
          <div className="text-center py-8 text-gray-500">Access Denied</div>
        );
      default:
        return <div className="text-2xl font-semibold">Page Coming Soon</div>;
    }
  };

  // return (
  //   <div className="flex h-screen bg-gray-50">
  //     <SidebarWrapper
  //       currentPage={currentPage}
  //       onPageChange={setCurrentPage}
  //       user={user}
  //     />

  //     <div className="flex-1 flex flex-col overflow-hidden">
  //       <Header user={user} />
  //       <main className="flex-1 overflow-auto p-6">{renderPage()}</main>
  //     </div>
  //     <NotificationPopup />
  //   </div>
  // );
}
