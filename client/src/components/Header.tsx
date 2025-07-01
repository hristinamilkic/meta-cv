"use client";

import { usePathname } from "next/navigation";
import UserProfile from "@/components/UserProfile";
import { useState, useEffect } from "react";
import { Icon } from "@/components/Icon";
import authService from "@/services/auth.service";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

function decodeJwtPayload(token: string): any {
  try {
    const payload = token.split(".")[1];
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

export default function Header({
  selectedTab,
  onTabChange,
}: {
  selectedTab?: "cvs" | "analytics";
  onTabChange?: (tab: "cvs" | "analytics") => void;
}) {
  const pathname = usePathname();
  const [search, setSearch] = useState("");
  const [elapsed, setElapsed] = useState("0m 0s");

  useEffect(() => {
    const token = authService.getToken();
    if (!token) {
      setElapsed("0s");
      return;
    }
    const payload = decodeJwtPayload(token);
    if (!payload || typeof payload.iat !== "number") {
      setElapsed("0s");
      return;
    }
    const sessionStart = new Date(payload.iat * 1000).getTime();
    const interval = setInterval(() => {
      const now = Date.now();
      const diff = Math.floor((now - sessionStart) / 1000); // seconds
      const hours = Math.floor(diff / 3600);
      const minutes = Math.floor((diff % 3600) / 60);
      const seconds = diff % 60;
      setElapsed(
        (hours > 0 ? `${hours}h ` : "") +
          (minutes > 0 ? `${minutes}m ` : "") +
          `${seconds}s`
      );
    }, 1000);
    return () => clearInterval(interval);
  }, []);

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
          <div className="flex-1 flex items-center gap-10">
            <span className="hidden sm:block text-[hsl(var(--mc-background))] font-normal text-2xl sm:text-3xl tracking-wide mr-6">
              Dashboard
            </span>
            <Tabs
              value={selectedTab}
              onValueChange={(value) =>
                onTabChange?.(value as "cvs" | "analytics")
              }
              className="bg-transparent"
            >
              <TabsList className="bg-transparent py-6 gap-0 flex items-center border border-[hsl(var(--mc-background))] rounded-full">
                <TabsTrigger
                  value="cvs"
                  className={`rounded-full px-4 py-2 mx-0 group`}
                >
                  <Icon
                    name="cv"
                    className={`w-6 h-6 transition-colors duration-200 ${selectedTab === "cvs" ? "text-[hsl(var(--mc-secondary))]" : "text-[hsl(var(--mc-background))]"}`}
                  />
                </TabsTrigger>
                <div className="w-px h-6 bg-[hsl(var(--mc-background))] mx-2" />
                <TabsTrigger
                  value="analytics"
                  className={`rounded-full px-4 py-2 mx-0 group`}
                >
                  <Icon
                    name="dashboard"
                    className={`w-6 h-6 transition-colors duration-200 ${selectedTab === "analytics" ? "text-[hsl(var(--mc-secondary))]" : "text-[hsl(var(--mc-background))]"}`}
                  />
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          <div className="flex-1 flex justify-center">
            <UserProfile />
          </div>
          <div className="flex-1 flex flex-row gap-2 items-end">
            <div className="text-[hsl(var(--mc-background))] border border-white/80 rounded-full px-2 py-1 font-normal text-base sm:text-lg flex items-center gap-2">
              <span>Time tracker:</span>
              <span>{elapsed}</span>
              <Icon name="clock" className="w-5 h-5" />
            </div>
            <div className="hidden text-end sm:block text-gray-300 font-thin text-xs sm:text-sm mt-1">
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
