"use client";

import React, { useState } from "react";
import { toast } from "sonner";

interface AddToCartProps {
  productId: string;
  quantity?: number;
}

export default function AddToCart({ productId, quantity = 1 }: AddToCartProps) {
  const [loading, setLoading] = useState(false);

  const handleAddToCart = async () => {
    try {
      setLoading(true);

      //Read token from localStorage
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("You must be logged in first!");
        setLoading(false);
        return;
      }

      const res = await fetch("https://ecommerce.routemisr.com/api/v2/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, 
        },
        body: JSON.stringify({ productId, count: quantity }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to add to cart");
      }

      //Success toast
      toast.success("Product added to cart successfully!");

    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleAddToCart}
      disabled={loading}
      className="w-full py-3 mt-2 rounded-lg bg-green-500 text-white font-semibold text-lg hover:bg-green-600 transition disabled:opacity-50"
    >
      {loading ? "Adding..." : "Add to Cart"}
    </button>
  );
}