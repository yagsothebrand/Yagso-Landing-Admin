import React, { useState } from "react";
import SidebarWrapper from "./SidebarWrapper";
import { Header } from "./Header";
import { useAuth } from "../auth/AuthProvider";
import { DashboardSkeleton } from "@/pages/DashboardSkeleton";
import { StockMonitor } from "../stock-monitor";

export default function Layout({ children }) {
  const { user } = useAuth();
  const [isProfileDrawerOpen, setIsProfileDrawerOpen] = useState(
    !user?.profileImage ? true : false
  );

  const handleProfileClick = () => {
    setIsProfileDrawerOpen(true);
  };
  return (
    <div
      className="flex h-screen overflow-hidden bg-gray-50 "
      style={{ fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif" }}
    >
      {user ? (
        <>
          <StockMonitor />
          {/* Sidebar - Fixed on desktop, drawer on mobile */}
          <SidebarWrapper
            isProfileDrawerOpen={isProfileDrawerOpen}
            setIsProfileDrawerOpen={setIsProfileDrawerOpen}
            onProfileClick={handleProfileClick}
          />

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
            {/* Header - Not sticky, just part of the layout */}
            <Header
              isProfileDrawerOpen={isProfileDrawerOpen}
              setIsProfileDrawerOpen={setIsProfileDrawerOpen}
              onProfileClick={handleProfileClick}
            />

            {/* Scrollable Content */}
            <main className="flex-1 overflow-y-auto">
              <div className="p-4 lg:p-6">{children} </div>
            </main>
          </div>
        </>
      ) : (
        <main className="flex-1 overflow-auto">{children}</main>
      )}
    </div>
  );
}
