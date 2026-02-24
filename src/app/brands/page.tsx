"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface Brand {
  _id: string;
  name: string;
  image: string;
}

export default function BrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const router = useRouter();

  useEffect(() => {
    async function fetchBrands() {
      try {
        const res = await fetch("https://ecommerce.routemisr.com/api/v1/brands", {
          cache: "no-store",
        });
        const data = await res.json();
        setBrands(data?.data || []);
      } catch (err) {
        console.error(err);
      }
    }
    fetchBrands();
  }, []);

  if (!brands.length) return <p className="text-center mt-20">Loading brands...</p>;

  return (
    <div className="container w-[90%] mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-6">Brands</h1>

      <div className="flex flex-wrap gap-4 mb-10">
        {brands.map((brand) => (
          <div
            key={brand._id}
            className="cursor-pointer border rounded-lg p-4 flex flex-col items-center gap-2 transition hover:shadow-lg"
            onClick={() => router.push(`/brands/${brand._id}`)}
          >
            <div className="relative w-24 h-24">
              <Image src={brand.image} alt={brand.name} fill className="object-contain" />
            </div>
            <p className="font-semibold">{brand.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}