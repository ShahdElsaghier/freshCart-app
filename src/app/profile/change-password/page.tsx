"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "../../../../context/AuthContext";

export default function ChangePasswordPage() {
  const { token, login } = useAuth(); // Changed from setToken to login
  const router = useRouter();

  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async (e: any) => {
    e.preventDefault();

    if (!token) {
      toast.error("Please login first");
      router.push("/login");
      return;
    }

    if (password !== rePassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        "https://ecommerce.routemisr.com/api/v1/users/changeMyPassword",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            token: token,
          },
          body: JSON.stringify({
            currentPassword,
            password,
            rePassword,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to change password");
      }

      // API returns new token after password change
      if (data.token) {
        // Get userId from localStorage or from data if available
        const userId = localStorage.getItem("userId") || "";
        
        // Update token in context and localStorage using login function
        login(data.token, userId);
      }

      toast.success("Password changed successfully");
      router.push("/profile");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50">
      <form
        onSubmit={handleChangePassword}
        className="bg-white shadow-md rounded p-6 w-96 flex flex-col gap-4"
      >
        <h2 className="text-xl font-semibold text-center">
          Change Password
        </h2>

        <input
          type="password"
          placeholder="Current Password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          className="border p-2 rounded"
          required
        />

        <input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 rounded"
          required
        />

        <input
          type="password"
          placeholder="Confirm New Password"
          value={rePassword}
          onChange={(e) => setRePassword(e.target.value)}
          className="border p-2 rounded"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
        >
          {loading ? "Updating..." : "Update Password"}
        </button>
      </form>
    </div>
  );
}