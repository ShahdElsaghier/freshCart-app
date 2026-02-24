"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import ProductCard from "../_components/ProductCard/ProductCard";

export default function HomePage() {
  const [products, setProducts] = useState<any[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("token")
      : null;

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch(
          "https://ecommerce.routemisr.com/api/v1/products"
        );
        const data = await res.json();
        setProducts(data.data || []);
      } catch {
        toast.error("Failed to load products");
      }
    }

    async function fetchWishlist() {
      if (!token) return;

      try {
        const res = await fetch(
          "https://ecommerce.routemisr.com/api/v1/wishlist",
          {
            headers: { token },
          }
        );

        const data = await res.json();

        setWishlist(
          data.data?.map((item: any) => item._id) || []
        );
      } catch {
        console.log("Wishlist not loaded");
      }
    }

    fetchProducts();
    fetchWishlist();
  }, [token]);

  //Wishlist Toggle
  const handleToggleWishlist = async (id: string, add: boolean) => {
    if (!token) {
      toast.error("Login first");
      return;
    }

    try {
      if (add) {
        await fetch(
          "https://ecommerce.routemisr.com/api/v1/wishlist",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              token,
            },
            body: JSON.stringify({ productId: id }),
          }
        );

        setWishlist(prev => [...prev, id]);
        toast.success("Added to wishlist");
      } else {
        await fetch(
          `https://ecommerce.routemisr.com/api/v1/wishlist/${id}`,
          {
            method: "DELETE",
            headers: { token },
          }
        );

        setWishlist(prev => prev.filter(pid => pid !== id));
        toast.success("Removed from wishlist");
      }
    } catch {
      toast.error("Wishlist error");
    }
  };

  //Cart Add
  const handleAddToCart = async (product: any) => {
    if (!token) {
      toast.error("Login first");
      return;
    }

    try {
      await fetch("https://ecommerce.routemisr.com/api/v1/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token,
        },
        body: JSON.stringify({ productId: product._id }),
      });

      toast.success("Added to Cart");
      window.dispatchEvent(new Event("cartUpdated"));
    } catch {
      toast.error("Error adding to cart");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Featured Products
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map(product => (
          <ProductCard
            key={product._id}
            product={product}
            initialInWishlist={wishlist.includes(product._id)}
            onToggleWishlist={handleToggleWishlist}
            onAddToCart={handleAddToCart}
          />
        ))}
      </div>
    </div>
  );
}