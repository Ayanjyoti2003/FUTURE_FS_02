"use client";

import type { Product } from "@/types";
import ProductCard from "@/components/ProductCard";

interface ProductListProps {
    products: Product[];
}

export default function ProductList({ products }: ProductListProps) {
    if (!products || products.length === 0) {
        return (
            <div className="text-center py-8">
                <p className="text-gray-500">No products found.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {products.map((product) => (
                <ProductCard key={product.id} p={product} />
            ))}
        </div>
    );
}
