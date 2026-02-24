"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

interface Category {
  _id: string;
  name: string;
  image?: string;
}

export default function CategorySlider() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch(
          "https://ecommerce.routemisr.com/api/v1/categories",
          { cache: "no-store" }
        );
        const data = await res.json();
        setCategories(data?.data || []);
      } catch (err) {
        console.error(err);
      }
    }
    fetchCategories();
  }, []);

  return (
    <div className="container mx-auto mt-10">
      <h2 className="text-3xl font-bold mb-6">Categories</h2>
      <div className="flex gap-6 overflow-x-auto py-2 scrollbar-none">
        {categories.map((cat) => (
          <Link key={cat._id} href={`/categories/${cat._id}`}>
            <div className="relative w-48 h-60 flex-shrink-0 rounded-2xl overflow-hidden shadow-lg cursor-pointer transition-transform hover:scale-105 hover:shadow-2xl">
              {cat.image ? (
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center text-4xl font-bold text-gray-500">
                  {cat.name[0].toUpperCase()}
                </div>
              )}
              <div className="absolute bottom-0 w-full bg-gradient-to-t from-black/70 to-transparent p-3">
                <p className="text-white text-lg font-semibold">{cat.name}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}