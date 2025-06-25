"use client";

import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import ProfileEditDialog from "./ProfileEditDialog";
import { Icon } from "./Icon";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLinkItem,
} from "@/components/ui/dropdown-menu";

export default function UserProfile() {
  const { user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);
  const dropdownRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    await logout();
    setIsDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const openProfileDialog = () => {
    setIsProfileDialogOpen(true);
    setIsDropdownOpen(false);
  };

  if (!user) {
    return (
      <div className="flex gap-2 sm:gap-4">
        <Link href="/login">
          <Button className="uppercase border border-white rounded-xl px-4 sm:px-6 py-2 text-white text-base sm:text-lg font-medium hover:bg-white/10 bg-transparent transition">
            Login
          </Button>
        </Link>
        <Link href="/register">
          <Button className="uppercase border border-white rounded-xl px-4 sm:px-6 py-2 text-white text-base sm:text-lg font-medium hover:bg-white/10 bg-transparent transition">
            Register
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <>
      <DropdownMenu onOpenChange={setIsDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <button
            ref={dropdownRef}
            className="flex items-center space-x-5 bg-[hsl(var(--mc-background))] rounded-3xl px-3 sm:px-3 py-1 text-[hsl(var(--mc-secondary))] text-base sm:text-md font-medium hover:bg-white transition-all duration-300"
          >
            <div className="w-10 h-10 border-2 border-[hsl(var(--mc-secondary))] rounded-full flex items-center justify-center">
              <span className="text-[hsl(var(--mc-secondary))] font-semibold text-sm">
                {user.firstName?.charAt(0) || ""}
                {user.lastName?.charAt(0) || ""}
              </span>
            </div>
            <div className="flex flex-col items-start">
              <span className="sm:block">
                {user.firstName + " " + user.lastName || "User"}
              </span>
              <span className="sm:block">{user.email || "User"}</span>
            </div>
            <Icon
              name="cheveron"
              className={`w-4 h-4 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
            />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          style={{ width: dropdownRef.current?.offsetWidth }}
        >
          <DropdownMenuLinkItem disabled>
            <div className="flex flex-col">
              <span className="font-medium">
                {user.firstName} {user.lastName}
              </span>
              <span className="text-sm">{user.email}</span>
              <span className="text-xs">
                {user.isAdmin ? "Admin" : user.isPremium ? "Premium" : "Free"}{" "}
                Account
              </span>
            </div>
          </DropdownMenuLinkItem>
          <DropdownMenuSeparator />

          <DropdownMenuLinkItem href={user.isAdmin ? "/admin" : "/dashboard"}>
            <Icon name="dashboard" className="mr-2" />
            {user.isAdmin ? "Admin Panel" : "Dashboard"}
          </DropdownMenuLinkItem>

          <DropdownMenuLinkItem onClick={openProfileDialog}>
            <Icon name="edit-profile" className="mr-2" />
            Edit Profile
          </DropdownMenuLinkItem>

          <DropdownMenuLinkItem href="/cv-builder">
            <Icon name="cv" className="mr-2" />
            CV Builder
          </DropdownMenuLinkItem>

          <DropdownMenuLinkItem href="/templates">
            <Icon name="template" className="mr-2" />
            Templates
          </DropdownMenuLinkItem>

          <DropdownMenuSeparator />

          <DropdownMenuLinkItem onClick={handleLogout}>
            <Icon name="logout" className="mr-2" />
            Logout
          </DropdownMenuLinkItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ProfileEditDialog
        isOpen={isProfileDialogOpen}
        onClose={() => setIsProfileDialogOpen(false)}
      />
    </>
  );
}
