"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "../../../context/AuthContext";

interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
}

export default function ProfilePage() {
  const { token } = useAuth();
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      toast.error("Please login first");
      router.push("/login");
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await fetch(
          "https://ecommerce.routemisr.com/api/v1/users/getMe",
          {
            method: "GET",
            headers: {
              token: token,
            },
          }
        );

        if (!res.ok) throw new Error("Failed to fetch user");

        const data = await res.json();
        setUser(data.data);
      } catch (error: any) {
        toast.error("Session expired, please login again");
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [token, router]);

  if (loading)
    return <p className="text-center mt-10">Loading profile...</p>;

  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col items-center py-10 bg-gray-50">
      <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-md flex flex-col items-center gap-4">

        {/* User Logo */}
        <div className="w-24 h-24 rounded-full bg-green-500 flex items-center justify-center text-4xl font-bold text-white">
          {user.name.charAt(0).toUpperCase()}
        </div>

        {/* User Info */}
        <h2 className="text-2xl font-semibold">{user.name}</h2>
        <p className="text-gray-500">{user.email}</p>

        {/* Change Password Button */}
        <button
          onClick={() => router.push("/profile/change-password")}
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
        >
          Change Password
        </button>
      </div>
    </div>
  );
}