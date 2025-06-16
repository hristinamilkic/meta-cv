import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import authService from "@/services/auth.service";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requirePremium?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requirePremium = false,
}) => {
  const { user, loading } = useAuth();
  const isAuthenticated = authService.isAuthenticated();
  const location = useLocation();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requirePremium && !user?.isPremium) {
    return <Navigate to="/upgrade" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
