"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ProductCard from "../../_components/ProductCard/ProductCard";

interface BrandProduct {
  id: string;
  title: string;
  price: number;
  images: string[];
  ratingsAverage: number;
  ratingsQuantity: number;
  sold?: number;
}

interface BrandData {
  _id: string;
  name: string;
  products?: BrandProduct[]; 
}

export default function BrandPage() {
  const params = useParams();
  const { id } = params; 
  const [brand, setBrand] = useState<BrandData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBrand() {
      setLoading(true);
      try {
        const res = await fetch(
          `https://ecommerce.routemisr.com/api/v1/brands/${id}`,
          { cache: "no-store" }
        );
        const data = await res.json();
        setBrand(data?.data || null);
      } catch (err) {
        console.error("Failed to fetch brand:", err);
        setBrand(null);
      } finally {
        setLoading(false);
      }
    }

    fetchBrand();
  }, [id]);

  if (loading) return <p className="text-center mt-20">Loading brand products...</p>;
  if (!brand) return <p className="text-center mt-20 text-red-500">Brand not found.</p>;

  const products = brand.products || []; // default to empty array

  return (
    <div className="container w-[90%] mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-6">{brand.name} Products</h1>

      {products.length === 0 ? (
        <p className="text-gray-600">No products found for this brand.</p>
      ) : (
        <div className="flex flex-wrap -mx-2">
          {products.map((product) => (
            <div
              key={product.id || product._id}
              className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 px-2 mb-6"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}