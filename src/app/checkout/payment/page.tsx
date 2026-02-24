"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "../../../../context/AuthContext";
import { CreditCard, Wallet, CheckCircle, ArrowLeft, Lock } from "lucide-react";

export default function PaymentPage() {
  const router = useRouter();
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "online">("cash");
  const [shippingAddress, setShippingAddress] = useState<any>(null);
  const [cartId, setCartId] = useState<string | null>(null);

  // Read shipping address and cartId from localStorage
  useEffect(() => {
    const savedAddress = localStorage.getItem("shippingAddress");
    const savedCartId = localStorage.getItem("cartId");
    
    if (savedAddress) {
      setShippingAddress(JSON.parse(savedAddress));
    } else {
      toast.error("Please enter shipping address first");
      router.push("/checkout/address");
      return;
    }
    
    if (!savedCartId) {
      toast.error("Cart is empty");
      router.push("/cart");
      return;
    }
    
    setCartId(savedCartId);
  }, [router]);

  if (!token) {
    router.push("/login");
    return null;
  }

  if (!shippingAddress || !cartId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  // PAY CASH
  const payCash = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `https://ecommerce.routemisr.com/api/v1/orders/${cartId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            token,
          },
          body: JSON.stringify({
            shippingAddress,
          }),
        }
      );

      const data = await res.json();
      console.log('Cash payment response:', data);

      if (!res.ok) throw new Error(data?.message || "Cash payment failed");

      // Clear cart and address after successful order
      localStorage.removeItem("shippingAddress");
      localStorage.removeItem("cartId");
      
      // Dispatch cart update event
      window.dispatchEvent(new Event("cartUpdated"));
      
      toast.success("Order placed successfully!");
      
      // Go to order confirmed page
      router.push("/order-confirmed");
    } catch (err: any) {
      console.error('Cash payment error:', err);
      toast.error(err.message || "Payment failed");
    } finally {
      setLoading(false);
    }
  };

  // PAY ONLINE (Stripe)
  const payOnline = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `https://ecommerce.routemisr.com/api/v1/orders/checkout-session/${cartId}?url=${window.location.origin}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            token,
          },
          body: JSON.stringify({ shippingAddress }),
        }
      );

      const data = await res.json();
      console.log('Online payment response:', data);

      if (!res.ok) throw new Error(data?.message || "Stripe checkout failed");

      // Redirect to Stripe checkout
      if (data.session && data.session.url) {
        window.location.href = data.session.url;
      } else {
        throw new Error("Invalid Stripe session");
      }
    } catch (err: any) {
      console.error('Online payment error:', err);
      toast.error(err.message || "Payment failed");
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = () => {
    if (paymentMethod === "cash") {
      payCash();
    } else {
      payOnline();
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center py-10 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="bg-white shadow-lg hover:shadow-2xl transition-all duration-500 rounded-2xl p-8 w-full max-w-md flex flex-col gap-6 border border-gray-100">
        {/* Header */}
        <div className="text-center mb-2">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Payment Method</h2>
          <p className="text-gray-500">Choose how you want to pay</p>
        </div>

        {/* Shipping Address Summary */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100 hover:border-green-300 transition-all duration-300">
          <h3 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
            <CheckCircle size={16} className="text-green-600" />
            Shipping to:
          </h3>
          <p className="text-gray-600 text-sm">{shippingAddress.details}</p>
          <p className="text-gray-600 text-sm">{shippingAddress.city}</p>
          <p className="text-gray-600 text-sm">Phone: {shippingAddress.phone}</p>
        </div>

        {/* Payment Methods */}
        <div className="space-y-3">
          {/* Cash on Delivery */}
          <div
            onClick={() => setPaymentMethod("cash")}
            className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 hover:scale-[1.02] ${
              paymentMethod === "cash" 
                ? "border-green-600 bg-green-50 shadow-md" 
                : "border-gray-200 hover:border-green-300 hover:bg-gray-50"
            }`}
          >
            <div className={`p-2 rounded-full transition-all duration-300 ${
              paymentMethod === "cash" 
                ? "bg-green-600 text-white scale-110" 
                : "bg-gray-100 text-gray-600"
            }`}>
              <Wallet size={24} />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">Cash on Delivery</h3>
              <p className="text-sm text-gray-500">Pay when you receive your order</p>
            </div>
            {paymentMethod === "cash" && (
              <CheckCircle className="text-green-600 animate-pulse" size={24} />
            )}
          </div>

          {/* Online Payment */}
          <div
            onClick={() => setPaymentMethod("online")}
            className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 hover:scale-[1.02] ${
              paymentMethod === "online" 
                ? "border-green-600 bg-green-50 shadow-md" 
                : "border-gray-200 hover:border-green-300 hover:bg-gray-50"
            }`}
          >
            <div className={`p-2 rounded-full transition-all duration-300 ${
              paymentMethod === "online" 
                ? "bg-green-600 text-white scale-110" 
                : "bg-gray-100 text-gray-600"
            }`}>
              <CreditCard size={24} />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">Pay Online</h3>
              <p className="text-sm text-gray-500">Credit card via Stripe</p>
            </div>
            {paymentMethod === "online" && (
              <CheckCircle className="text-green-600 animate-pulse" size={24} />
            )}
          </div>
        </div>

        {/* Security Note */}
        <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 p-2 rounded-lg">
          <Lock size={14} className="text-green-600" />
          <span>Your payment information is secure and encrypted</span>
        </div>

        {/* Payment Button */}
        <button
          onClick={handlePayment}
          disabled={loading}
          className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-xl hover:from-green-600 hover:to-green-700 hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2 shadow-md hover:shadow-lg mt-2"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Processing...
            </>
          ) : (
            <>
              {paymentMethod === "cash" ? "Place Order (Cash)" : "Proceed to Online Payment"}
            </>
          )}
        </button>

        {/* Back to Address Link */}
        <button
          onClick={() => router.push("/checkout/address")}
          className="text-gray-500 hover:text-green-600 transition-colors duration-300 text-sm flex items-center justify-center gap-1 mt-2"
        >
          <ArrowLeft size={16} />
          Back to Address
        </button>
      </div>
    </div>
  );
}