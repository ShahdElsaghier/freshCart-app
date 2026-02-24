"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Trash2, ShoppingCart, Minus, Plus, ArrowRight } from "lucide-react";

interface CartItem {
  count: number;
  price: number;
  product: {
    _id: string;
    title: string;
    imageCover: string;
    category?: { name: string };
  };
}

export default function CartPage() {
  const { token, isAuthenticated } = useAuth();
  const router = useRouter();

  const [items, setItems] = useState<CartItem[]>([]);
  const [cartId, setCartId] = useState<string>("");
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated && !loading) {
      toast.error("Please login to view your cart");
      router.push("/login");
    }
  }, [isAuthenticated, loading, router]);

  const fetchCart = async () => {
    if (!token) {
      setItems([]);
      setTotal(0);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const res = await fetch("https://ecommerce.routemisr.com/api/v1/cart", {
        method: "GET",
        headers: { 
          'token': token,
          'Content-Type': 'application/json'
        },
      });
      
      if (!res.ok) {
        throw new Error(`Failed to fetch cart: ${res.status}`);
      }
      
      const data = await res.json();
      
      if (data?.status === "success") {
        if (data?.data?._id) {
          localStorage.setItem("cartId", data.data._id);
          setCartId(data.data._id);
        }
        
        setItems(data?.data?.products || []);
        setTotal(data?.data?.totalCartPrice || 0);
      } else {
        setItems([]);
        setTotal(0);
        localStorage.removeItem("cartId");
      }
    } catch (err: any) {
      console.error('Error fetching cart:', err);
      setError(err.message || 'Failed to load cart');
      setItems([]);
      setTotal(0);
      localStorage.removeItem("cartId");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchCart();
    }
    
    const handleCartUpdate = () => {
      if (token) {
        fetchCart();
      }
    };
    
    window.addEventListener("cartUpdated", handleCartUpdate);
    return () => window.removeEventListener("cartUpdated", handleCartUpdate);
  }, [token]);

  const updateCount = async (id: string, count: number) => {
    if (!token) return;

    try {
      const res = await fetch(`https://ecommerce.routemisr.com/api/v1/cart/${id}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json", 
          "token": token 
        },
        body: JSON.stringify({ count }),
      });
      
      const data = await res.json();
      
      if (data?.status === "success") {
        fetchCart();
        toast.success("Cart updated");
      } else {
        toast.error(data?.message || "Failed to update");
      }
    } catch (error) {
      console.error('Error updating cart:', error);
      toast.error("Failed to update");
    }
  };

  const removeItem = async (id: string) => {
    if (!token) return;

    try {
      const res = await fetch(`https://ecommerce.routemisr.com/api/v1/cart/${id}`, {
        method: "DELETE",
        headers: { 
          "token": token,
          "Content-Type": "application/json"
        },
      });
      
      const data = await res.json();
      
      if (data?.status === "success") {
        toast.success("Removed from cart");
        fetchCart();
        window.dispatchEvent(new Event("cartUpdated"));
      } else {
        toast.error(data?.message || "Failed to remove");
      }
    } catch (error) {
      console.error('Error removing item:', error);
      toast.error("Failed to remove");
    }
  };

  const handleClearCart = async () => {
    if (!token) return;

    try {
      const res = await fetch("https://ecommerce.routemisr.com/api/v1/cart", {
        method: "DELETE",
        headers: { 
          "token": token,
          "Content-Type": "application/json"
        },
      });
      
      const data = await res.json();
      
      if (data?.status === "success") {
        toast.success("Cart cleared");
        localStorage.removeItem("cartId");
        fetchCart();
        window.dispatchEvent(new Event("cartUpdated"));
      } else {
        toast.error(data?.message || "Failed to clear");
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
      toast.error("Failed to clear");
    }
  };

  const handleCheckout = () => {
    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    
    if (cartId) {
      localStorage.setItem("cartId", cartId);
    }
    
    router.push("/checkout/address");
  };

  // Show loading while checking auth
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading your cart...</p>
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
        <ShoppingCart size={64} className="mx-auto text-gray-300 mb-4" />
        <p className="text-red-500 text-lg mb-2">Error loading cart</p>
        <p className="text-gray-400 mb-6">{error}</p>
        <button
          onClick={fetchCart}
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
        <ShoppingCart size={64} className="mx-auto text-gray-300 mb-4" />
        <p className="text-gray-500 text-lg">Your cart is empty.</p>
        <button
          onClick={() => router.push("/")}
          className="mt-4 px-6 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 hover:scale-105 transition-all duration-300 shadow-md hover:shadow-lg"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart ({items.length} items)</h1>
      
      <div className="grid md:grid-cols-3 gap-10">
        {/* LEFT: Items */}
        <div className="md:col-span-2 space-y-6">
          {items.map((item) => (
            <div
              key={item.product._id}
              className="group bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
            >
              <div className="flex gap-6 items-center">
                <div 
                  className="w-24 h-24 flex items-center justify-center overflow-hidden rounded-lg bg-gray-50"
                  onClick={() => router.push(`/products/${item.product._id}`)}
                >
                  <img
                    src={item.product.imageCover}
                    alt={item.product.title}
                    className="h-full object-contain transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-gray-500">{item.product.category?.name}</p>
                      <h2 
                        className="font-semibold text-lg group-hover:text-green-600 transition-colors duration-300"
                        onClick={() => router.push(`/products/${item.product._id}`)}
                      >
                        {item.product.title}
                      </h2>
                    </div>
                    <div className="font-bold text-lg text-green-600">
                      {item.price * item.count} EGP
                    </div>
                  </div>

                  <p className="text-gray-600 mt-1">{item.price} EGP each</p>

                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          updateCount(item.product._id, item.count - 1);
                        }}
                        className="w-8 h-8 border rounded-lg hover:bg-gray-100 hover:border-green-500 transition-all duration-300 flex items-center justify-center disabled:opacity-50"
                        disabled={item.count <= 1}
                      >
                        <Minus size={16} />
                      </button>
                      <span className="font-medium w-8 text-center">{item.count}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          updateCount(item.product._id, item.count + 1);
                        }}
                        className="w-8 h-8 border rounded-lg hover:bg-gray-100 hover:border-green-500 transition-all duration-300 flex items-center justify-center"
                      >
                        <Plus size={16} />
                      </button>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeItem(item.product._id);
                      }}
                      className="text-red-500 hover:text-red-700 transition-colors duration-300 flex items-center gap-1 group/remove"
                    >
                      <Trash2 size={16} className="group-hover/remove:scale-110 transition-transform duration-300" />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {items.length > 0 && (
            <button
              onClick={handleClearCart}
              className="mt-4 py-2 px-4 bg-red-500 text-white rounded-xl hover:bg-red-600 hover:scale-105 transition-all duration-300 flex items-center gap-2 shadow-md hover:shadow-lg"
            >
              <Trash2 size={18} /> Clear All
            </button>
          )}
        </div>

        {/* RIGHT: Summary */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-xl transition-all duration-300 sticky top-24">
            <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
            
            <div className="space-y-3">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span className="font-medium">{total} EGP</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className="text-green-600 font-medium">Free</span>
              </div>
              <div className="border-t pt-3 mt-3">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-green-600">{total} EGP</span>
                </div>
              </div>
            </div>
            
            <button
              onClick={handleCheckout}
              className="w-full bg-green-600 text-white py-3 rounded-xl hover:bg-green-700 hover:scale-105 transition-all duration-300 mt-6 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
            >
              Proceed to Checkout <ArrowRight size={18} />
            </button>
            
            <button
              onClick={() => router.push("/")}
              className="w-full bg-gray-100 text-gray-800 py-3 rounded-xl hover:bg-gray-200 hover:scale-105 transition-all duration-300 mt-3"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}