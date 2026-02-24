"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, ShoppingBag, Home } from "lucide-react";

export default function OrderConfirmedPage() {
  const router = useRouter();

  useEffect(() => {
    // Scroll to top when page loads
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-10 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl border border-gray-200 p-8 shadow-sm hover:shadow-xl transition-all duration-300 text-center">
        <div className="flex justify-center mb-6">
          <div className="bg-green-100 rounded-full p-4 animate-bounce">
            <CheckCircle size={64} className="text-green-600" />
          </div>
        </div>
        
        <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
        <p className="text-gray-500 mb-6">
          Thank you for your purchase. Your order has been placed successfully.
        </p>
        
        <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left">
          <p className="text-sm text-gray-600 mb-2">What happens next?</p>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-center gap-2">
              <div className="w-1 h-1 bg-green-600 rounded-full"></div>
              You will receive an order confirmation email
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1 h-1 bg-green-600 rounded-full"></div>
              We'll notify you when your order ships
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1 h-1 bg-green-600 rounded-full"></div>
              You can track your order in the orders page
            </li>
          </ul>
        </div>
        
        <div className="flex gap-4">
          <button
            onClick={() => router.push("/orders")}
            className="flex-1 bg-green-600 text-white py-3 rounded-xl hover:bg-green-700 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
          >
            <ShoppingBag size={18} />
            View Orders
          </button>
          
          <button
            onClick={() => router.push("/")}
            className="flex-1 bg-gray-100 text-gray-800 py-3 rounded-xl hover:bg-gray-200 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
          >
            <Home size={18} />
            Home
          </button>
        </div>
      </div>
    </div>
  );
}