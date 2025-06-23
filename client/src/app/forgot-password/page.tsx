"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import AuthLayout from "@/components/AuthLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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
      title="Forgot Password"
      subtitle="Enter your email to receive a reset code."
    >
      {success ? (
        <div className="space-y-6">
          <div className="rounded-md bg-green-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-green-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">
                  Check your email
                </h3>
                <div className="mt-2 text-sm text-green-700">
                  <p>
                    We've sent a password reset code to <strong>{email}</strong>
                    . Please check your email and use the code to reset your
                    password.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="text-center">
            <Link
              href="/reset-password"
              className="font-medium text-[#f7a18e] underline"
            >
              Go to password reset page
            </Link>
          </div>
          <div className="text-center">
            <Link
              href="/login"
              className="font-medium text-[#fff3e6] underline"
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
          <Button
            type="submit"
            disabled={loading}
            className="w-full text-lg font-semibold bg-[#f7a18e] hover:bg-[#e78a7a] text-white py-3 rounded-xl shadow-md transition"
          >
            {loading ? <span>Sending reset code...</span> : "Send reset code"}
          </Button>
          <div className="text-center mt-2">
            <Link
              href="/login"
              className="font-medium text-[#fff3e6] underline"
            >
              Back to login
            </Link>
          </div>
        </form>
      )}
    </AuthLayout>
  );
}
