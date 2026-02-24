"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { MapPin, Phone, Building, ArrowRight, Save } from "lucide-react";

export default function AddressPage() {
  const router = useRouter();

  const [details, setDetails] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSaveAddress = () => {
    if (!details || !phone || !city) {
      return toast.error("Please fill all fields");
    }

    setLoading(true);

    try {
      // Save the shipping address in localStorage
      const shippingAddress = { details, phone, city };
      localStorage.setItem("shippingAddress", JSON.stringify(shippingAddress));

      toast.success("Address saved successfully!");

      // Redirect directly to payment page
      router.push("/checkout/payment");
    } catch (err: any) {
      toast.error("Failed to save address");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center py-10 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="bg-white shadow-lg hover:shadow-2xl transition-all duration-500 rounded-2xl p-8 w-full max-w-md flex flex-col gap-6 border border-gray-100 hover:border-green-200">
        {/* Header */}
        <div className="text-center mb-2">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Shipping Address</h2>
          <p className="text-gray-500">Enter your delivery details</p>
        </div>

        {/* Address Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <MapPin size={16} className="text-green-600" />
            Address Details
          </label>
          <input
            type="text"
            placeholder="Street, building, apartment number"
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 hover:border-green-400"
          />
        </div>

        {/* Phone Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <Phone size={16} className="text-green-600" />
            Phone Number
          </label>
          <input
            type="tel"
            placeholder="Enter your phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 hover:border-green-400"
          />
        </div>

        {/* City Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <Building size={16} className="text-green-600" />
            City
          </label>
          <input
            type="text"
            placeholder="Enter your city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 hover:border-green-400"
          />
        </div>

        {/* Save Button */}
        <button
          disabled={loading}
          onClick={handleSaveAddress}
          className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-xl hover:from-green-600 hover:to-green-700 hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2 shadow-md hover:shadow-lg mt-4"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Saving...
            </>
          ) : (
            <>
              <Save size={18} />
              Save & Continue to Payment
              <ArrowRight size={18} />
            </>
          )}
        </button>

        {/* Back to Cart Link */}
        <button
          onClick={() => router.push("/cart")}
          className="text-gray-500 hover:text-green-600 transition-colors duration-300 text-sm mt-2"
        >
          ← Back to Cart
        </button>
      </div>
    </div>
  );
}