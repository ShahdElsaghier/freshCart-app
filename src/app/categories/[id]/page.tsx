"use client";

import { useEffect, useState } from "react";
import ProductCard from "../../_components/ProductCard/ProductCard";
import { useParams } from "next/navigation";

export default function CategoryPage() {
  const { id } = useParams();
  const [category, setCategory] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const categoryRes = await fetch(
          `https://ecommerce.routemisr.com/api/v1/categories/${id}`
        );
        const categoryData = await categoryRes.json();
        setCategory(categoryData.data);

        const productsRes = await fetch(
          `https://ecommerce.routemisr.com/api/v1/products?category=${id}`
        );
        const productsData = await productsRes.json();
        setProducts(productsData.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    if (id) fetchData();
  }, [id]);

  if (loading)
    return <div className="text-center mt-20">Loading...</div>;

  if (!category)
    return <div className="text-center mt-20 text-red-500">Failed to load category</div>;

  return (
    <div className="container w-[90%] mx-auto mt-16">
      <h1 className="text-3xl font-bold mb-8 text-center">
        {category.name}
      </h1>

      {products.length === 0 ? (
        <p className="text-center text-gray-500">
          No products in this category.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}

      
    </div>
  );
}