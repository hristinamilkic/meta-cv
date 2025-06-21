"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import authService, {
  User,
  LoginData,
  RegisterData,
  PasswordResetData,
  PasswordChangeData,
  ChangePasswordData,
} from "@/services/auth.service";

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  requestPasswordReset: (data: PasswordResetData) => Promise<void>;
  resetPassword: (data: PasswordChangeData) => Promise<void>;
  changePassword: (data: ChangePasswordData) => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (authService.isAuthenticated()) {
          const userData = await authService.getCurrentUser();
          setUser(userData);
        }
      } catch (err: any) {
        console.error("Error checking authentication:", err);
        authService.removeToken();
        setUser(null);

        const protectedPaths = [
          "/dashboard",
          "/cv-builder",
          "/cv-preview",
          "/templates",
          "/profile",
          "/change-password",
        ];
        const isProtectedRoute = protectedPaths.some((path) =>
          pathname.startsWith(path)
        );

        if (isProtectedRoute) {
          router.push(`/login?from=${encodeURIComponent(pathname)}`);
        }
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [pathname, router]);

  const login = async (data: LoginData) => {
    try {
      setError(null);
      setLoading(true);

      const response = await authService.login(data);
      authService.setToken(response.token);
      setUser(response.user);

      // Redirect to original destination or dashboard
      const from = searchParams.get("from") || "/dashboard";
      router.push(from);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Failed to login";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    try {
      setError(null);
      setLoading(true);

      const response = await authService.register(data);
      authService.setToken(response.token);
      setUser(response.user);

      router.push("/dashboard");
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Failed to register";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (err) {
      console.error("Error during logout:", err);
    } finally {
      authService.removeToken();
      setUser(null);
      router.push("/login");
    }
  };

  const requestPasswordReset = async (data: PasswordResetData) => {
    try {
      setError(null);
      await authService.requestPasswordReset(data);
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Failed to request password reset";
      setError(errorMessage);
      throw err;
    }
  };

  const resetPassword = async (data: PasswordChangeData) => {
    try {
      setError(null);
      await authService.resetPassword(data);
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Failed to reset password";
      setError(errorMessage);
      throw err;
    }
  };

  const changePassword = async (data: ChangePasswordData) => {
    try {
      setError(null);
      await authService.changePassword(data);
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Failed to change password";
      setError(errorMessage);
      throw err;
    }
  };

  const updateProfile = async (data: Partial<User>) => {
    try {
      setError(null);
      const updatedUser = await authService.updateProfile(data);
      setUser(updatedUser);
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Failed to update profile";
      setError(errorMessage);
      throw err;
    }
  };

  const clearError = () => {
    setError(null);
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    requestPasswordReset,
    resetPassword,
    changePassword,
    updateProfile,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
