"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Heart, Star, ShoppingCart } from "lucide-react";
import { useAuth } from "../../../../context/AuthContext";

interface ProductCardProps {
  product: {
    _id: string;
    title: string;
    price: number;
    imageCover: string;
    ratingsAverage?: number;
    category?: { name: string };
  };
  initialInWishlist?: boolean;
  onToggleWishlist?: (id: string, add: boolean) => Promise<void>;
  onAddToCart?: (product: any) => Promise<void>;
}

export default function ProductCard({ 
  product, 
  initialInWishlist = false,
  onToggleWishlist,
  onAddToCart 
}: ProductCardProps) {
  const router = useRouter();
  const { token } = useAuth();

  const [wishlisted, setWishlisted] = useState(initialInWishlist);
  const [loadingCart, setLoadingCart] = useState(false);
  const [loadingWishlist, setLoadingWishlist] = useState(false);

  const goToDetails = () => router.push(`/products/${product._id}`);

  // Add to cart
  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!token) {
      toast.error("Please login first");
      return;
    }

    setLoadingCart(true);
    try {
      if (onAddToCart) {
        await onAddToCart(product);
      } else {
        // Fallback if no prop provided
        const res = await fetch("https://ecommerce.routemisr.com/api/v1/cart", {
          method: "POST",
          headers: { 
            "Content-Type": "application/json", 
            token 
          },
          body: JSON.stringify({ productId: product._id }),
        });
        
        const data = await res.json();
        if (res.ok) {
          toast.success("Added to Cart");
          window.dispatchEvent(new Event("cartUpdated"));
        } else {
          toast.error(data.message || "Failed to add");
        }
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error("Error adding to cart");
    } finally {
      setLoadingCart(false);
    }
  };

  // Wishlist toggle
  const handleWishlist = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!token) {
      toast.error("Please login first");
      return;
    }

    setLoadingWishlist(true);
    const newWishlistState = !wishlisted;

    try {
      if (onToggleWishlist) {
        await onToggleWishlist(product._id, newWishlistState);
        setWishlisted(newWishlistState);
      } else {
        // Fallback if no prop provided
        if (wishlisted) {
          const res = await fetch(`https://ecommerce.routemisr.com/api/v1/wishlist/${product._id}`, {
            method: "DELETE",
            headers: { token },
          });
          
          if (res.ok) {
            setWishlisted(false);
            toast.success("Removed from Wishlist");
            window.dispatchEvent(new Event("wishlistUpdated"));
          }
        } else {
          const res = await fetch("https://ecommerce.routemisr.com/api/v1/wishlist", {
            method: "POST",
            headers: { 
              "Content-Type": "application/json", 
              token 
            },
            body: JSON.stringify({ productId: product._id }),
          });
          
          if (res.ok) {
            setWishlisted(true);
            toast.success("Added to Wishlist");
            window.dispatchEvent(new Event("wishlistUpdated"));
          }
        }
      }
    } catch (error) {
      console.error('Error updating wishlist:', error);
      toast.error("Failed to update wishlist");
    } finally {
      setLoadingWishlist(false);
    }
  };

  return (
    <div
      onClick={goToDetails}
      className="group bg-white rounded-2xl border border-gray-200 p-5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col cursor-pointer"
    >
      {/* IMAGE */}
      <div className="relative w-full h-48 flex items-center justify-center overflow-hidden">
        <img
          src={product.imageCover}
          alt={product.title}
          className="h-full object-contain transition-transform duration-300 group-hover:scale-105"
          onClick={(e) => e.stopPropagation()}
        />

        {/* WISHLIST BUTTON */}
        <button
          onClick={handleWishlist}
          disabled={loadingWishlist}
          className="absolute top-2 right-2 bg-white rounded-full p-2 shadow hover:scale-110 transition disabled:opacity-50 z-10"
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart
            size={18}
            className={wishlisted ? "text-red-500 fill-red-500" : "text-gray-400"}
          />
        </button>
      </div>

      {/* PRODUCT DETAILS */}
      <div className="mt-4 flex flex-col flex-grow">
        <span className="text-sm text-gray-500">{product.category?.name}</span>

        <h3 className="font-semibold text-gray-800 mt-1 line-clamp-1 group-hover:text-green-600 transition">
          {product.title}
        </h3>

        {/* RATING */}
        <div className="flex items-center gap-1 mt-1 justify-end">
          <Star size={16} className="text-yellow-400 fill-yellow-400" />
          <span className="text-sm text-gray-600">{product.ratingsAverage || 4.5}</span>
        </div>

        <span className="text-green-600 font-bold text-lg mt-2">{product.price} EGP</span>

        {/* ADD TO CART BUTTON */}
        <button
          onClick={handleAddToCart}
          disabled={loadingCart}
          className="mt-4 flex items-center justify-center gap-2 bg-green-600 text-white py-2.5 rounded-xl hover:bg-green-700 transition disabled:opacity-50"
        >
          <ShoppingCart size={18} />
          {loadingCart ? "Adding..." : "Add To Cart"}
        </button>
      </div>
    </div>
  );
}