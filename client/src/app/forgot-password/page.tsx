"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import AuthLayout from "@/components/AuthLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Icon } from "@/components/Icon";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(false);
  const { requestPasswordReset, loading, error, clearError } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setSuccess(false);
    try {
      await requestPasswordReset({ email });
      setSuccess(true);
    } catch (err) {}
  };

  return (
    <AuthLayout
      title="FORGOTTEN PASSWORD?"
      subtitle="Enter your email to receive a reset code."
    >
      {success ? (
        <div className="space-y-3">
          <div className="flex">
            <Alert>
              <Icon name="success" className="h-5 w-5 fill-green-500" />
              <AlertTitle>Success! Check your email!</AlertTitle>
              <AlertDescription>
                We've sent a password reset code to <strong>{email}</strong>.
                Please check your email and use the code to reset your password.
              </AlertDescription>
            </Alert>
          </div>
          <div className="text-center flex flex-col items-center gap-2 text-md">
            <Link
              href="/reset-password"
              className="font-medium text-[hsl(var(--mc-accent))] hover:text-[hsl(var(--mc-background))] underline transition-all duration-300"
            >
              Go to password reset page
            </Link>

            <Link
              href="/login"
              className="font-medium text-[hsl(var(--mc-background))] hover:text-[hsl(var(--mc-accent))] underline transition-all duration-300"
            >
              Back to login
            </Link>
          </div>
        </div>
      ) : (
        <form className="space-y-6 w-full" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-700">{error}</div>
            </div>
          )}
          <Input
            id="email-address"
            name="email"
            type="email"
            autoComplete="email"
            required
            disabled={loading}
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button type="submit" disabled={loading}>
            {loading ? <span>Sending reset code...</span> : "SEND RESET CODE"}
          </Button>
          <div className="text-center mt-2">
            <Link
              href="/login"
              className="font-medium text-[hsl(var(--mc-background))] underline"
            >
              Back to login
            </Link>
          </div>
        </form>
      )}
    </AuthLayout>
  );
}
