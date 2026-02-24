"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Heart, User, ShoppingCart } from "lucide-react";
import { toast } from "sonner";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const [cartCount, setCartCount] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  //Check login state
  const checkLogin = useCallback(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  useEffect(() => {
    checkLogin();
    window.addEventListener("storage", checkLogin);
    return () => window.removeEventListener("storage", checkLogin);
  }, [checkLogin]);

  //Fetch cart count
  const fetchCartCount = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setCartCount(0);
      return;
    }

    try {
      const res = await fetch("https://ecommerce.routemisr.com/api/v1/cart", {
        headers: { token },
        cache: "no-store",
      });
      const data = await res.json();
      setCartCount(data.numOfCartItems || 0);
    } catch (err) {
      console.log(err);
    }
  }, []);

  // Poll cart count every 2 seconds
  useEffect(() => {
    fetchCartCount();
    const interval = setInterval(fetchCartCount, 2000);
    return () => clearInterval(interval);
  }, [fetchCartCount]);

  // Update cart immediately when localStorage changes (like add/remove from product page)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "cartUpdated") fetchCartCount();
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [fetchCartCount]);

  //Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setIsLoggedIn(false);
    toast.success("Logged out successfully");
    router.replace("/login");
  };

  const linkClass = (path: string) =>
    pathname === path
      ? "text-yellow-300 font-semibold"
      : "hover:text-yellow-200 transition duration-200";

  return (
    <nav className="bg-green-500 py-5 px-10 flex justify-between items-center">

      {/* LEFT SIDE */}
      <ul className="flex gap-6 text-white text-lg items-center">

        <li>
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-xl hover:text-yellow-300 transition"
          >
            <ShoppingCart size={22} />
            freshCart
          </Link>
        </li>

        <li>
          <Link href="/" className={linkClass("/")}>
            Home
          </Link>
        </li>

        <li>
          <Link href="/products" className={linkClass("/products")}>
            Products
          </Link>
        </li>

        <li>
          <Link href="/categories" className={linkClass("/categories")}>
            Categories
          </Link>
        </li>

        <li>
          <Link href="/brands" className={linkClass("/brands")}>
            Brands
          </Link>
        </li>

        {/* Cart */}
        <li>
          <Link
            href="/cart"
            className="flex items-center gap-1 hover:text-yellow-200 transition duration-200 relative"
          >
            <ShoppingCart size={22} />
            Cart
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-4 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                {cartCount}
              </span>
            )}
          </Link>
        </li>

        {/* Wishlist */}
        <li>
          <Link href="/wishlist">
            <Heart
              size={24}
              className="hover:text-pink-300 transition duration-200"
            />
          </Link>
        </li>
      </ul>

      {/* RIGHT SIDE */}
      <ul className="flex gap-4 text-white items-center">

        {/* Social Media */}
        <li>
          <i className="fa-brands fa-facebook hover:text-blue-200 transition"></i>
        </li>
        <li>
          <i className="fa-brands fa-twitter hover:text-blue-200 transition"></i>
        </li>
        <li>
          <i className="fa-brands fa-instagram hover:text-pink-200 transition"></i>
        </li>
        <li>
          <i className="fa-brands fa-linkedin hover:text-blue-200 transition"></i>
        </li>

        {!isLoggedIn ? (
          <>
            <li>
              <Link href="/register" className={linkClass("/register")}>
                Register
              </Link>
            </li>

            <li>
              <Link href="/login" className={linkClass("/login")}>
                Login
              </Link>
            </li>
          </>
        ) : (
          <li className="relative group">

            {/* USER ICON */}
            <div className="cursor-pointer hover:text-yellow-300 transition duration-200">
              <User size={26} />
            </div>

            {/* DROPDOWN */}
            <div className="absolute right-0 mt-3 bg-white text-black rounded-lg shadow-lg w-48 
                            opacity-0 invisible translate-y-2
                            group-hover:visible group-hover:opacity-100 group-hover:translate-y-0
                            transition-all duration-200">

              <Link
                href="/profile"
                className="block px-4 py-2 hover:bg-gray-100 rounded-t-lg transition"
              >
                My Profile
              </Link>

              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 hover:bg-red-100 text-red-600 rounded-b-lg transition"
              >
                Sign Out
              </button>

            </div>

          </li>
        )}
      </ul>
    </nav>
  );
}