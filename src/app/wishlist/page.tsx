"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Heart, Trash2, ShoppingBag } from "lucide-react";

interface WishlistItem {
  _id: string;
  title: string;
  price: number;
  imageCover: string;
  category?: { name: string };
}

export default function WishlistPage() {
  const { token, isAuthenticated } = useAuth();
  const router = useRouter();

  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated && !loading) {
      toast.error("Please login to view your wishlist");
      router.push("/login");
    }
  }, [isAuthenticated, loading, router]);

  const fetchWishlist = async () => {
    if (!token) {
      setItems([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const res = await fetch("https://ecommerce.routemisr.com/api/v1/wishlist", {
        method: "GET",
        headers: { 
          'token': token,
          'Content-Type': 'application/json'
        },
      });
      
      if (!res.ok) {
        throw new Error(`Failed to fetch wishlist: ${res.status}`);
      }
      
      const data = await res.json();
      setItems(data?.data || []);
    } catch (err: any) {
      console.error('Error fetching wishlist:', err);
      setError(err.message || 'Failed to load wishlist');
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchWishlist();
    }
    
    const handleWishlistUpdate = () => {
      if (token) {
        fetchWishlist();
      }
    };
    
    window.addEventListener("wishlistUpdated", handleWishlistUpdate);
    return () => window.removeEventListener("wishlistUpdated", handleWishlistUpdate);
  }, [token]);

  const removeItem = async (id: string) => {
    if (!token) return;

    try {
      const res = await fetch(`https://ecommerce.routemisr.com/api/v1/wishlist/${id}`, {
        method: "DELETE",
        headers: { 
          'token': token,
          'Content-Type': 'application/json'
        },
      });
      
      const data = await res.json();
      
      if (data?.status === "success") {
        toast.success("Removed from Wishlist");
        fetchWishlist();
        window.dispatchEvent(new Event("wishlistUpdated"));
      } else {
        toast.error(data?.message || "Failed to remove");
      }
    } catch (error) {
      console.error('Error removing item:', error);
      toast.error("Failed to remove");
    }
  };

  const addToCart = async (item: WishlistItem) => {
    if (!token) return;

    try {
      const res = await fetch("https://ecommerce.routemisr.com/api/v1/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'token': token,
        },
        body: JSON.stringify({ productId: item._id }),
      });
      
      const data = await res.json();
      
      if (data?.status === "success") {
        toast.success("Added to Cart");
        window.dispatchEvent(new Event("cartUpdated"));
      } else {
        toast.error(data?.message || "Failed to add to cart");
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error("Failed to add to cart");
    }
  };

  // Show loading while checking auth
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading your wishlist...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; 
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <Heart size={64} className="mx-auto text-gray-300 mb-4" />
        <p className="text-red-500 text-lg mb-2">Error loading wishlist</p>
        <p className="text-gray-400 mb-6">{error}</p>
        <button
          onClick={fetchWishlist}
          className="px-6 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 hover:scale-105 transition-all duration-300"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-20">
        <Heart size={64} className="mx-auto text-gray-300 mb-4" />
        <p className="text-gray-500 text-lg">Your wishlist is empty.</p>
        <p className="text-gray-400 mb-6">Add items to your wishlist and they will appear here</p>
        <button
          onClick={() => router.push("/")}
          className="mt-4 px-6 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 hover:scale-105 transition-all duration-300 shadow-md hover:shadow-lg"
        >
          Browse Products
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8">My Wishlist ({items.length} items)</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {items.map((item) => (
          <div
            key={item._id}
            className="group bg-white rounded-2xl border border-gray-200 p-4 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer flex flex-col"
          >
            <div
              className="relative w-full h-48 flex items-center justify-center overflow-hidden rounded-lg bg-gray-50 mb-3"
              onClick={() => router.push(`/products/${item._id}`)}
            >
              <img
                src={item.imageCover}
                alt={item.title}
                className="h-full object-contain transition-transform duration-500 group-hover:scale-110"
              />
              
              <div className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-md group-hover:shadow-lg transition-all duration-300">
                <Heart size={18} className="text-red-500 fill-red-500" />
              </div>
            </div>

            <div className="flex flex-col flex-grow">
              <span className="text-sm text-gray-500 mb-1">{item.category?.name}</span>
              <h3 
                className="font-semibold text-gray-800 line-clamp-1 group-hover:text-green-600 transition-colors duration-300"
                onClick={() => router.push(`/products/${item._id}`)}
              >
                {item.title}
              </h3>

              <div className="flex items-center justify-between mt-3">
                <span className="text-green-600 font-bold text-lg">{item.price} EGP</span>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart(item);
                  }}
                  className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-600 hover:text-white hover:scale-110 transition-all duration-300"
                  title="Add to Cart"
                >
                  <ShoppingBag size={18} />
                </button>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeItem(item._id);
                }}
                className="mt-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 group/remove"
              >
                <Trash2 size={18} className="group-hover/remove:rotate-12 transition-transform duration-300" />
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}