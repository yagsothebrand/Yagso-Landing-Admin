import React from "react";
import { NavLink } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="h-screen w-full flex flex-col justify-center items-center bg-primary-light">
      <h1 className="text-9xl font-extrabold text-white tracking-widest">
        404
      </h1>
      <div className="bg-[#FF6A3D] px-2 text-sm rounded rotate-12 absolute">
        Page Not Found
      </div>
      <div className="mt-5">
        <div className="relative inline-block text-sm font-medium text-[#FF6A3D] group active:text-orange-500 focus:outline-none focus:ring">
          <NavLink to="/">
            <span className="absolute inset-0 cursor-pointer bg-[#FF6A3D]">
              Go Home
            </span>
          </NavLink>
        </div>
      </div>
    </div>
  );
}
