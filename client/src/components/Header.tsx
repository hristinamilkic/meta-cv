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

  const authPages = [
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
  ];
  const isAuthPage = authPages.includes(pathname);

  return (
    <header className="absolute top-0 left-0 z-50 w-full bg-transparent shadow-none border-none flex flex-wrap justify-between items-center px-2 sm:px-8 py-2 sm:py-4 gap-y-2">
      <span
        className={`${isHomePage ? "text-gray-300 font-thin text-xs sm:text-sm" : "text-[hsl(var(--mc-background))] font-normal text-2xl sm:text-3xl tracking-wide"}`}
      >
        {getPageTitle()}
      </span>

      {!isAuthPage && (
        <div className="relative top-10 sm:top-2 sm:absolute sm:left-1/2 sm:mt-4 sm:transform sm:-translate-x-1/2 w-full sm:w-auto flex justify-center order-3 sm:order-none">
          <UserProfile />
        </div>
      )}

      <div className="text-right text-gray-300 font-thin text-xs sm:text-sm">
        <div className="font-thin text-xs sm:text-sm">
          Designed & Developed by
          <br />
          Hristina Milkić
        </div>
      </div>
    </header>
  );
}
