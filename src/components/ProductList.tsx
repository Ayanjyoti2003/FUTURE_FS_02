"use client";

import type { Product } from "@/types";
import ProductCard from "@/components/ProductCard";

export default function ProductList({ products }: { products: Product[] }) {
    if (!products || products.length === 0) {
        return <p className="text-gray-500 text-center">No products found.</p>;
    }

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((p) => (
                <ProductCard key={p.id} p={p} />
            ))}
        </div>
    );
}
