import api from "./api";

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  isPremium: boolean;
  isAdmin: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface PasswordResetData {
  email: string;
}

export interface PasswordChangeData {
  code: string;
  "new-password": string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

class AuthService {
  async login(data: LoginData): Promise<{ user: User; token: string }> {
    const response = await api.post("/api/users/login", data);
    return response.data;
  }

  async register(data: RegisterData): Promise<{ user: User; token: string }> {
    const response = await api.post("/api/users/register", data);
    return response.data;
  }

  async logout(): Promise<void> {
    await api.post("/api/users/logout");
  }

  async getCurrentUser(): Promise<User> {
    const response = await api.get("/api/users/me");
    return response.data;
  }
  async requestPasswordReset(
    data: PasswordResetData
  ): Promise<{ message: string }> {
    const response = await api.post("/api/users/forgot-password", data);
    return response.data;
  }
  async resetPassword(data: PasswordChangeData): Promise<{ message: string }> {
    const response = await api.post("/api/users/reset-password", data);
    return response.data;
  }
  async changePassword(data: ChangePasswordData): Promise<{ message: string }> {
    const response = await api.post("/api/users/password", data);
    return response.data;
  }
  async updateProfile(data: Partial<User>): Promise<User> {
    const response = await fetch("/api/users/profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update profile");
    }

    return response.json();
  }

  isAuthenticated(): boolean {
    if (typeof window === "undefined") return false;
    return document.cookie.includes("token=");
  }

  getToken(): string | null {
    if (typeof window === "undefined") return null;
    const tokenCookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="));
    return tokenCookie ? tokenCookie.split("=")[1] : null;
  }

  setToken(token: string): void {
    if (typeof window === "undefined") return;
    document.cookie = `token=${token}; path=/; max-age=${7 * 24 * 60 * 60}; secure; samesite=strict`;
  }

  removeToken(): void {
    if (typeof window === "undefined") return;
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  }

  async verifyResetCode(
    code: string
  ): Promise<{ valid: boolean; message?: string }> {
    const response = await api.post("/api/users/verify-reset-code", { code });
    return response.data;
  }
}

export const authService = new AuthService();
export default authService;
