"use client";

import { usePathname } from "next/navigation";
import UserProfile from "@/components/UserProfile";

export default function Header() {
  const pathname = usePathname();

  const getPageTitle = () => {
    switch (pathname) {
      case "/templates":
        return "Templates";
      case "/dashboard":
        return "Dashboard";
      case "/admin":
        return "Admin Panel";
      case "/cv-builder":
        return "CV Builder";
      case "/cv-preview":
        return "CV Preview";
      case "/login":
        return "Login";
      case "/register":
        return "Register";
      case "/forgot-password":
        return "Forgot Password";
      case "/reset-password":
        return "Reset Password";
      default:
        return "© 2025 All rights reserved";
    }
  };

  const isHomePage = pathname === "/";

  return (
    <header className="absolute top-0 left-0 z-50 w-full bg-transparent shadow-none border-none flex justify-between items-center px-4 sm:px-8 py-2 sm:py-4">
      <span
        className={`${isHomePage ? "text-gray-300 font-thin text-sm" : "text-white font-normal text-2xl"}`}
      >
        {getPageTitle()}
      </span>

      {/* Centered UserProfile */}
      <div className="absolute left-1/2 mt-4 transform -translate-x-1/2">
        <UserProfile />
      </div>

      <div className="text-right text-xs text-gray-300">
        <div className="font-thin text-sm">
          Designed & Developed by
          <br />
          Hristina Milkić
        </div>
      </div>
    </header>
  );
}
