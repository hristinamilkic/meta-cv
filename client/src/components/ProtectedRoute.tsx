"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Icon from "@/components/Icon";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  requirePremium?: boolean;
}

export default function ProtectedRoute({
  children,
  requireAdmin = false,
  requirePremium = false,
}: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push(
          `/login?from=${encodeURIComponent(window.location.pathname)}`
        );
        return;
      }

      if (requireAdmin && !user.isAdmin) {
        router.push("/dashboard");
        return;
      }

      if (requirePremium && !user.isPremium) {
        router.push("/dashboard");
        return;
      }
    }
  }, [user, loading, requireAdmin, requirePremium, router]);
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin border-pink-500 flex items-center space-x-2"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (requireAdmin && !user.isAdmin) {
    return null;
  }

  if (requirePremium && !user.isPremium) {
    return null;
  }

  return <>{children}</>;
}
