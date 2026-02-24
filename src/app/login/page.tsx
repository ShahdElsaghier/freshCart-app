"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";

const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();

  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [step, setStep] = useState<"email" | "code" | "reset">("email");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  // ================= LOGIN =================
  const onSubmit = async (values: LoginFormValues) => {
    try {
      const res = await fetch(
        "https://ecommerce.routemisr.com/api/v1/auth/signin",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.user?._id);

      toast.success("Logged in successfully!");
      router.push("/");

    } catch (err: any) {
      toast.error(err.message);
    }
  };

  // ================= SEND EMAIL =================
  const handleForgotPassword = async () => {
    try {
      const res = await fetch(
        "https://ecommerce.routemisr.com/api/v1/auth/forgotPasswords",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: forgotEmail }),
        }
      );

      if (!res.ok) throw new Error("Failed to send reset email");

      toast.success("Reset code sent to your email");
      setStep("code");

    } catch (err: any) {
      toast.error(err.message);
    }
  };

  // ================= VERIFY CODE =================
  const handleVerifyCode = async () => {
    try {
      const res = await fetch(
        "https://ecommerce.routemisr.com/api/v1/auth/verifyResetCode",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ resetCode }),
        }
      );

      if (!res.ok) throw new Error("Invalid reset code");

      toast.success("Code verified");
      setStep("reset");

    } catch (err: any) {
      toast.error(err.message);
    }
  };

  // ================= RESET PASSWORD =================
  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const res = await fetch(
        "https://ecommerce.routemisr.com/api/v1/auth/resetPassword",
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: forgotEmail,
            newPassword,
          }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      toast.success("Password reset successfully!");
      localStorage.setItem("token", data.token);
      router.push("/");

    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">

        <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>

        {/* LOGIN FORM */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <input
              type="email"
              placeholder="Email"
              {...register("email")}
              className="w-full border px-3 py-2 rounded"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>

          <div>
            <input
              type="password"
              placeholder="Password"
              {...register("password")}
              className="w-full border px-3 py-2 rounded"
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-green-500 text-white py-2 rounded"
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* FORGOT PASSWORD LINK */}
        <div className="mt-4 text-center">
          <button
            onClick={() => setShowForgot(!showForgot)}
            className="text-blue-500 hover:underline text-sm"
          >
            Forgot Password?
          </button>
        </div>

        {/* FORGOT PASSWORD SECTION */}
        {showForgot && (
          <div className="mt-4 border-t pt-4 space-y-3">

            {step === "email" && (
              <>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  className="w-full border px-3 py-2 rounded"
                />
                <button
                  onClick={handleForgotPassword}
                  className="w-full bg-blue-500 text-white py-2 rounded"
                >
                  Send Code
                </button>
              </>
            )}

            {step === "code" && (
              <>
                <input
                  type="text"
                  placeholder="Enter Reset Code"
                  value={resetCode}
                  onChange={(e) => setResetCode(e.target.value)}
                  className="w-full border px-3 py-2 rounded"
                />
                <button
                  onClick={handleVerifyCode}
                  className="w-full bg-green-500 text-white py-2 rounded"
                >
                  Verify Code
                </button>
              </>
            )}

            {step === "reset" && (
              <>
                <input
                  type="password"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full border px-3 py-2 rounded"
                />
                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full border px-3 py-2 rounded"
                />
                <button
                  onClick={handleResetPassword}
                  className="w-full bg-green-600 text-white py-2 rounded"
                >
                  Reset Password
                </button>
              </>
            )}
          </div>
        )}

        <p className="mt-6 text-center text-sm">
          Don’t have an account?{" "}
          <Link href="/register" className="text-green-500 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}