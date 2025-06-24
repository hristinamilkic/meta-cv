"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import AuthLayout from "@/components/AuthLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, loading, error, clearError } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "/dashboard";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    try {
      await login({ email, password });
    } catch (err) {}
  };

  return (
    <AuthLayout title="LOGIN" subtitle="META CV application">
      <form className="space-y-6 w-full" onSubmit={handleSubmit}>
        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="text-sm text-red-500">{error}</div>
          </div>
        )}
        <div className="space-y-4">
          <Input
            id="email-address"
            name="email"
            type="email"
            autoComplete="email"
            required
            disabled={loading}
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            disabled={loading}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <Button type="submit" disabled={loading}>
          {loading ? <span>Signing in...</span> : "LOGIN"}
        </Button>
        <div className="text-sm flex flex-col items-center gap-1 mt-2">
          <div className="text-[hsl(var(--mc-background))] tracking-wide font-light">
            Forgotten password?{" "}
            <Link
              href="/forgot-password"
              className="underline hover:text-[hsl(var(--mc-accent))] transition-all duration-300"
            >
              Reset password
            </Link>
          </div>
          <div className="text-[hsl(var(--mc-background))] tracking-wide font-light">
            Don't have an account?{" "}
            <Link
              href="/register"
              className="underline hover:text-[hsl(var(--mc-accent))] transition-all duration-300"
            >
              Register now!
            </Link>
          </div>
        </div>
      </form>
    </AuthLayout>
  );
}
