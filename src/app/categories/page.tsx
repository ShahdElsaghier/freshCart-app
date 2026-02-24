"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface Category {
  _id: string;
  name: string;
  image?: string;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch(
          "https://ecommerce.routemisr.com/api/v1/categories"
        );
        const data = await res.json();
        setCategories(data.data || []);
      } catch (err) {
        console.error("Error fetching categories:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="container w-[90%] mx-auto mt-16 text-center">
        <p>Loading categories...</p>
      </div>
    );
  }

  return (
    <div className="container w-[90%] mx-auto mt-16">
      <h1 className="text-3xl font-bold mb-8 text-center">All Categories</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <Link href={`/categories/${cat._id}`} key={cat._id}>
            <div className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-xl transition cursor-pointer">
              <div className="relative w-full h-64 bg-gray-100">
                {cat.image ? (
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-gray-400">No image available</span>
                  </div>
                )}
              </div>
              <div className="p-3 text-center">
                <h3 className="text-lg font-semibold">{cat.name}</h3>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}