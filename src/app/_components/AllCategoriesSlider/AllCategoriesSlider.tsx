"use client"; 

import { useEffect, useState } from "react";
import Image from "next/image";

interface Category {
  _id: string;
  name: string;
  image?: string;
}

export default function AllCategoriesSlider() {
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
        console.error("Failed to fetch categories:", err);
      }
    }

    fetchCategories();
  }, []);

  if (categories.length === 0) return null;

  return (
    <div className="container w-[90%] mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-5">Shop All Categories</h2>

      <div className="flex overflow-x-auto gap-4 py-2">
        {categories.map((cat) => (
          <div
            key={cat._id}
            className="flex-shrink-0 w-40 h-40 bg-white shadow-md rounded-lg flex flex-col items-center justify-center cursor-pointer hover:scale-105 transition-transform"
          >
            {cat.image ? (
              <Image
                src={cat.image}
                alt={cat.name}
                width={100}
                height={100}
                className="object-contain"
              />
            ) : (
              <div className="w-24 h-24 bg-gray-200 flex items-center justify-center rounded-md">
                {cat.name[0].toUpperCase()}
              </div>
            )}
            <p className="mt-2 text-center font-medium">{cat.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}