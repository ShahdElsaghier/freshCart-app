"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const router = useRouter();

  const handleSend = async () => {
    try {
      const res = await fetch(
        "https://ecommerce.routemisr.com/api/v1/auth/forgotPasswords",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      if (!res.ok) throw new Error("Failed to send reset code");

      toast.success("Code sent to your email");
      localStorage.setItem("resetEmail", email);

      router.push("/verify-code");

    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <div className="center-page">
      <div className="card">
        <h2>Forgot Password</h2>
        <input
          type="email"
          placeholder="Enter your email"
          onChange={(e) => setEmail(e.target.value)}
          className="input"
        />
        <button onClick={handleSend} className="btn-blue">
          Send Code
        </button>
      </div>
    </div>
  );
}