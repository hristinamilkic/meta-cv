"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AuthLayout from "@/components/AuthLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";

export default function ResetPasswordPage() {
  const [formData, setFormData] = useState({
    code: "",
    "new-password": "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);
  const [otpStep, setOtpStep] = useState(true);
  const [otpLoading, setOtpLoading] = useState(false);
  const { resetPassword, loading, error, clearError, verifyResetCode } =
    useAuth();
  const router = useRouter();

  const handleOTPChange = (value: string) => {
    setFormData((prev) => ({ ...prev, code: value }));
    if (errors.code) setErrors((prev) => ({ ...prev, code: "" }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setOtpLoading(true);
    setErrors({});
    if (!formData.code || formData.code.length !== 6) {
      setErrors({ code: "Please enter the 6-digit code." });
      setOtpLoading(false);
      return;
    }
    try {
      const result = await verifyResetCode(formData.code);
      if (result && result.valid) {
        setOtpStep(false);
      } else {
        setErrors({ code: "Invalid or expired code." });
      }
    } catch (err: any) {
      setErrors({ code: err?.message || "Invalid or expired code." });
    } finally {
      setOtpLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData["new-password"])
      newErrors["new-password"] = "New password is required";
    else if (formData["new-password"].length < 6)
      newErrors["new-password"] = "Password must be at least 6 characters";
    if (!formData.confirmPassword)
      newErrors.confirmPassword = "Please confirm your password";
    else if (formData["new-password"] !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    if (!validateForm()) return;
    try {
      await resetPassword({
        code: formData.code,
        "new-password": formData["new-password"],
      });
      setSuccess(true);
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch (err) {}
  };

  return (
    <AuthLayout
      title="RESET PASSWORD"
      subtitle={
        otpStep ? "Enter the code from your email." : "Set your new password."
      }
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
                  Password reset successful
                </h3>
                <div className="mt-2 text-sm text-green-700">
                  <p>
                    Your password has been successfully reset. You will be
                    redirected to the login page shortly.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="text-center">
            <Link
              href="/login"
              className="font-medium text-[#f7a18e] underline"
            >
              Go to login page now
            </Link>
          </div>
        </div>
      ) : otpStep ? (
        <form className="space-y-5 w-full" onSubmit={handleVerifyOTP}>
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-700">{error}</div>
            </div>
          )}
          <div>
            <InputOTP
              maxLength={6}
              value={formData.code}
              onChange={handleOTPChange}
            >
              <InputOTPGroup className="text-white">
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
              </InputOTPGroup>
              <InputOTPSeparator className="text-white" />
              <InputOTPGroup className="text-white">
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
            {errors.code && (
              <p className="mt-1 text-sm text-red-500">{errors.code}</p>
            )}
          </div>
          <Button type="submit" disabled={otpLoading}>
            {otpLoading ? <span>Verifying...</span> : "VERIFY CODE"}
          </Button>
          <div className="text-center mt-2">
            <Link
              href="/forgot-password"
              className="font-medium text-[hsl(var(--mc-background))] hover:text-[hsl(var(--mc-accent))] underline transition-all duration-300"
            >
              Request new code
            </Link>
          </div>
          <div className="text-center mt-2">
            <Link
              href="/login"
              className="font-medium text-[hsl(var(--mc-background))] hover:text-[hsl(var(--mc-accent))] underline transition-all duration-300"
            >
              Back to login
            </Link>
          </div>
        </form>
      ) : (
        <form className="space-y-6 w-full" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-700">{error}</div>
            </div>
          )}
          <div>
            <Input
              id="new-password"
              name="new-password"
              type="password"
              autoComplete="new-password"
              required
              disabled={loading}
              placeholder="New password"
              value={formData["new-password"]}
              onChange={handleChange}
            />
            {errors["new-password"] && (
              <p className="mt-1 text-sm text-red-500">
                {errors["new-password"]}
              </p>
            )}
          </div>
          <div>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              disabled={loading}
              placeholder="Confirm new password"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-500">
                {errors.confirmPassword}
              </p>
            )}
          </div>
          <Button
            type="submit"
            disabled={loading}
            className="w-full text-lg font-semibold bg-[#f7a18e] hover:bg-[#e78a7a] text-white py-3 rounded-xl shadow-md transition"
          >
            {loading ? <span>Resetting password...</span> : "Reset password"}
          </Button>
          <div className="text-center mt-2">
            <Link
              href="/forgot-password"
              className="font-medium text-[#fff3e6] underline"
            >
              Request new code
            </Link>
          </div>
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
