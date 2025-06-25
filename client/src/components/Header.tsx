"use client";

import { usePathname } from "next/navigation";
import UserProfile from "@/components/UserProfile";
import { useState } from "react";
import { Icon } from "@/components/Icon";

export default function Header() {
  const pathname = usePathname();
  const [search, setSearch] = useState("");
  // Dummy time tracker value
  const timeTracker = "1h 12min";

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
      {pathname === "/dashboard" ? (
        <>
          {/* Dashboard: Search left, profile center, time tracker right */}
          <div className="flex-1 flex items-center">
            <span className="hidden sm:block text-[hsl(var(--mc-background))] font-normal text-2xl sm:text-3xl tracking-wide mr-6">
              Dashboard
            </span>
            <div className="flex items-center bg-transparent border border-[hsl(var(--mc-background))] rounded-full px-4 py-1 w-full max-w-xs">
              <Icon
                name="search"
                className="w-5 h-5 text-[hsl(var(--mc-background))] mr-2"
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search here"
                className="bg-transparent outline-none border-none w-full text-[hsl(var(--mc-background))] placeholder-[hsl(var(--mc-background))]"
              />
            </div>
          </div>
          <div className="flex-1 flex justify-center">
            <UserProfile />
          </div>
          <div className="flex-1 flex flex-col items-end">
            <div className="text-[hsl(var(--mc-background))] font-normal text-base sm:text-lg flex items-center gap-2">
              <span>Time tracker:</span>
              <span>{timeTracker}</span>
              <Icon name="dashboard" className="w-5 h-5" />
            </div>
            <div className="hidden sm:block text-gray-300 font-thin text-xs sm:text-sm mt-1">
              Designed & Developed by
              <br />
              Hristina Milkić
            </div>
          </div>
        </>
      ) : (
        <>
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
        </>
      )}
    </header>
  );
}
