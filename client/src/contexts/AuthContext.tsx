"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import Cookies from "js-cookie";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  isPremium?: boolean;
  isAdmin?: boolean;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }) => Promise<void>;
  logout: () => void;
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
    const token = Cookies.get("token");
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      const fetchUser = async () => {
        try {
          const response = await axios.get("/api/auth/me");
          setUser(response.data);
        } catch (err) {
          console.error("Error fetching user:", err);
          Cookies.remove("token");
          delete axios.defaults.headers.common["Authorization"];
        } finally {
          setLoading(false);
        }
      };

      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      const response = await axios.post("/api/auth/login", { email, password });
      const { token, user } = response.data;

      Cookies.set("token", token, { expires: 7 }); // Token expires in 7 days
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setUser(user);

      // redirect to the original destination or dashboard
      const from = searchParams.get("from") || "/dashboard";
      router.push(from);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to login");
      throw err;
    }
  };

  const register = async (userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }) => {
    try {
      setError(null);
      await axios.post("/api/auth/register", userData);
      router.push("/login");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to register");
      throw err;
    }
  };

  const logout = () => {
    Cookies.remove("token");
    delete axios.defaults.headers.common["Authorization"];
    setUser(null);
    router.push("/login");
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
