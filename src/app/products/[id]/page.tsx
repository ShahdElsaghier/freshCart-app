"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Star, Heart } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation, Autoplay } from "swiper/modules";

interface Review {
  _id: string;
  review: string;
  rating: number;
  user: { _id: string; name: string };
}

export default function ProductDetails() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [wishlist, setWishlist] = useState<boolean>(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newReview, setNewReview] = useState("");
  const [newRating, setNewRating] = useState(5);

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId"); 

  useEffect(() => {
    if (!id) return;

    async function getProduct() {
      try {
        const res = await fetch(
          `https://ecommerce.routemisr.com/api/v1/products/${id}`
        );
        if (!res.ok) throw new Error();
        const data = await res.json();
        setProduct(data.data);
        setReviews(data.data.reviews || []);
      } catch {
        toast.error("Error while getting product");
      }
    }

    getProduct();
  }, [id]);

  const handleAddToCart = async () => {
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
        body: JSON.stringify({ productId: product._id, quantity: 1 }),
      });

      if (!res.ok) throw new Error();

      toast.success("Added to cart 🛒");
    } catch {
      toast.error("Failed to add to cart");
    }
  };

  const toggleWishlist = () => {
    setWishlist(!wishlist);
    toast.success(
      wishlist ? "Removed from wishlist" : "Added to wishlist ❤️"
    );
  };

  // Add Review
  const handleAddReview = async () => {
    if (!token) {
      toast.error("Please login first");
      return;
    }
    if (!newReview) {
      toast.error("Please enter a review");
      return;
    }

    try {
      const res = await fetch(
        `https://ecommerce.routemisr.com/api/v1/products/${id}/reviews`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            token,
          },
          body: JSON.stringify({ review: newReview, rating: newRating }),
        }
      );
      if (!res.ok) throw new Error("Failed to add review");

    
      setReviews([
        ...reviews,
        { _id: Math.random().toString(), review: newReview, rating: newRating, user: { _id: userId || "me", name: "You" } },
      ]);
      setNewReview("");
      setNewRating(5);
      toast.success("Review added!");
    } catch (err) {
      console.error(err);
      toast.error("Could not add review");
    }
  };

  //Delete Review - FIXED
  const handleDeleteReview = async (reviewId: string) => {
    if (!token) {
      toast.error("You must be logged in to delete a review");
      return;
    }

    try {
      const res = await fetch(`https://ecommerce.routemisr.com/api/v1/reviews/${reviewId}`, {
        method: "DELETE",
        headers: { 
          token: token // Now token is guaranteed to be string, not null
        },
      });
      if (!res.ok) throw new Error("Failed to delete review");

      setReviews(reviews.filter((r) => r._id !== reviewId));
      toast.success("Review deleted");
    } catch (err) {
      console.error(err);
      toast.error("Could not delete review");
    }
  };

  if (!product) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="bg-gray-100 min-h-screen py-10">
      <div className="container mx-auto w-[90%]">
        {/* Back */}
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-2 text-gray-600 mb-10 hover:underline"
        >
          ← Back To Home
        </button>

        <div className="flex flex-col lg:flex-row items-center gap-20">
          {/* Left Image Swiper */}
          <div className="flex-1 flex justify-center relative group">
            <Swiper
              modules={[Navigation, Autoplay]}
              navigation
              loop
              autoplay={{ delay: 3000, disableOnInteraction: false }}
              className="w-80 h-80"
            >
              {product.images?.length ? product.images.map((img: string, idx: number) => (
                <SwiperSlide key={idx}>
                  <img
                    src={img}
                    className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                  />
                </SwiperSlide>
              )) : (
                <SwiperSlide>
                  <img
                    src={product.imageCover}
                    className="w-full h-full object-contain"
                  />
                </SwiperSlide>
              )}
            </Swiper>

            {/* Wishlist Heart */}
            <div
              onClick={toggleWishlist}
              className="absolute top-2 right-2 text-2xl cursor-pointer hover:scale-110 transition-transform"
            >
              <Heart
                className={wishlist ? "text-red-500 fill-red-500" : "text-gray-600"}
              />
            </div>
          </div>

          {/* Right Content */}
          <div className="flex-1 relative">
            {/* Category */}
            <p className="text-gray-400 text-sm mb-2">
              {product.category?.name}
            </p>

            {/* Title */}
            <h1 className="text-3xl font-semibold mb-4">
              {product.title}
            </h1>

            {/* Description */}
            <p className="text-gray-500 mb-4">
              {product.description}
            </p>

            {/* Price */}
            <p className="text-lg font-semibold mb-6">
              {product.price} EGP
            </p>

            {/* Add to Cart */}
            <button
              onClick={handleAddToCart}
              className="w-full bg-black text-white py-3 rounded-lg hover:opacity-90 transition flex items-center justify-center gap-2"
            >
              🛒 Add To Cart
            </button>

            {/* Rating */}
            <div className="flex items-center gap-2 mt-6">
              <span>{product.ratingsAverage}</span>
              <Star size={18} className="text-yellow-400 fill-yellow-400" />
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-4">Reviews</h2>

          {/* Add Review Form */}
          {token && (
            <div className="mb-6 p-4 border rounded-md">
              <textarea
                placeholder="Write your review..."
                value={newReview}
                onChange={(e) => setNewReview(e.target.value)}
                className="w-full p-2 border rounded-md mb-2 focus:outline-none focus:border-black"
              />
              <input
                type="number"
                min={1}
                max={5}
                value={newRating}
                onChange={(e) => setNewRating(Number(e.target.value))}
                className="w-16 p-2 border rounded-md mr-2"
              />
              <button
                onClick={handleAddReview}
                className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition"
              >
                Add Review
              </button>
            </div>
          )}

          {/* List of Reviews */}
          <div className="space-y-4">
            {reviews.length === 0 && <p>No reviews yet</p>}
            {reviews.map((r) => (
              <div key={r._id} className="p-4 border rounded-md flex justify-between items-center">
                <div>
                  <p className="font-semibold">{r.user.name}</p>
                  <p>{r.review}</p>
                  <p>Rating: {r.rating}/5</p>
                </div>
                {r.user._id === userId && (
                  <button
                    onClick={() => handleDeleteReview(r._id)}
                    className="text-red-500 hover:underline"
                  >
                    Delete
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}