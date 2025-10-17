"use client";

import { useState } from "react";
import SidebarWrapper from "./SidebarWrapper";
import { Header } from "./Header";

import { useAuth } from "../auth/AuthProvider";
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
      className="flex h-screen overflow-hidden  relative"
      style={{ fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif" }}
    >
      <video
        autoPlay
        muted
        loop
        className="absolute inset-0 w-full h-full object-cover -z-10"
        style={{
          filter: "blur(6px)",
          opacity: 0.4,
        }}
      >
        <source src="/moo.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.7) 0%, rgba(248,248,248,0.8) 100%)",
        }}
      />

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
              <div className="p-4 lg:p-6">{children}</div>
            </main>
          </div>
        </>
      ) : (
        <main className="flex-1 overflow-auto w-full">{children}</main>
      )}
    </div>
  );
}
