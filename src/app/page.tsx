"use client";

import React, { useEffect, useState } from "react";
import HomeSlider from "./_components/HomeSlider/HomeSlider";
import CategorySlider from "./_components/CategorySlider/CategorySlider";
import ProductCard from "./_components/ProductCard/ProductCard";
import WelcomeUser from "./_components/welcomeUser/welcomeUser";
import { toast } from "sonner";
import { useAuth } from "../../context/AuthContext";

interface Product {
  _id: string;
  title: string;
  price: number;
  imageCover: string;
  ratingsAverage?: number;
  category?: { name: string };
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  // Fetch products and wishlist
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch products
        const productsRes = await fetch("https://ecommerce.routemisr.com/api/v1/products");
        const productsData = await productsRes.json();
        setProducts(productsData.data || []);
        
        // Fetch wishlist only if user is logged in
        if (token) {
          const wishlistRes = await fetch("https://ecommerce.routemisr.com/api/v1/wishlist", {
            headers: { token },
          });
          const wishlistData = await wishlistRes.json();
          setWishlist(wishlistData.data?.map((item: any) => item._id) || []);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
        toast.error("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  // Wishlist Toggle Function
  const handleToggleWishlist = async (id: string, add: boolean) => {
    if (!token) {
      toast.error("Please login first");
      return;
    }

    try {
      if (add) {
        const res = await fetch("https://ecommerce.routemisr.com/api/v1/wishlist", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            token,
          },
          body: JSON.stringify({ productId: id }),
        });
        
        const data = await res.json();
        if (data?.status === "success") {
          setWishlist(prev => [...prev, id]);
          toast.success("Added to wishlist");
          window.dispatchEvent(new Event("wishlistUpdated"));
        }
      } else {
        const res = await fetch(`https://ecommerce.routemisr.com/api/v1/wishlist/${id}`, {
          method: "DELETE",
          headers: { token },
        });
        
        const data = await res.json();
        if (data?.status === "success") {
          setWishlist(prev => prev.filter(pid => pid !== id));
          toast.success("Removed from wishlist");
          window.dispatchEvent(new Event("wishlistUpdated"));
        }
      }
    } catch (error) {
      console.error("Wishlist error:", error);
      toast.error("Failed to update wishlist");
    }
  };

  // Add to Cart Function
  const handleAddToCart = async (product: Product) => {
    if (!token) {
      toast.error("Please login first");
      return;
    }

    try {
      const res = await fetch("https://ecommerce.routemisr.com/api/v1/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token,
        },
        body: JSON.stringify({ productId: product._id }),
      });
      
      const data = await res.json();
      if (data?.status === "success") {
        toast.success("Added to Cart");
        window.dispatchEvent(new Event("cartUpdated"));
      } else {
        toast.error(data?.message || "Failed to add to cart");
      }
    } catch (error) {
      console.error("Cart error:", error);
      toast.error("Error adding to cart");
    }
  };

  return (
    <>
      <WelcomeUser />
      <HomeSlider />

      {/* Categories Section */}
      <section className="mt-10">
        <div className="container w-[90%] mx-auto">
          <h2 className="text-2xl font-bold mb-5">Shop by Category</h2>
          <CategorySlider /> {/* Removed autoplay prop */}
        </div>
      </section>

      {/* Products Section */}
      <section className="bg-gray-50 py-12 mt-12">
        <div className="container w-[90%] mx-auto">
          <h2 className="text-2xl font-bold mb-8">Our Products</h2>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">No products found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8">
              {products.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  initialInWishlist={wishlist.includes(product._id)}
                  onToggleWishlist={handleToggleWishlist}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}