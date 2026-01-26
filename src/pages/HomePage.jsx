"use client";

import RedirectIfNoAccess from "./components/guards/RedirectIfNoAccess";

export default function HomePage() {
  return (
    <RedirectIfNoAccess>
      <div className="min-h-screen bg-stone-950 text-white flex items-center justify-center">
        <div className="max-w-xl text-center px-6">
          <h1 className="text-4xl font-semibold">Welcome to YAGSO</h1>
          <p className="mt-3 text-white/70">
            You already have access on this device.
          </p>
        </div>
      </div>
    </RedirectIfNoAccess>
  );
}
