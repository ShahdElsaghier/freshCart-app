"use client";

import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";

interface DecodedToken {
  name: string;
  email: string;
  id: string;
}

export default function WelcomeUser() {
  const [username, setUsername] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      const decoded: DecodedToken = jwtDecode(token);
      setUsername(decoded.name);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token"); 
    setUsername(null); 
    router.refresh(); 
  };

  if (!username) return null;

  return (
    <div className="container mx-auto mt-6">
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-5 rounded-2xl shadow-lg flex justify-between items-center">
        <h2 className="text-xl font-semibold">
          Welcome back, {username} 👋
        </h2>
      </div>
    </div>
  );
}