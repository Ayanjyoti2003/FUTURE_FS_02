"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import ProductList from "@/components/ProductList";
import SearchBar from "@/components/SearchBar";
import SidebarFilters from "@/components/SidebarFilters";
import type { Product } from "@/types";

const BASE = process.env.NEXT_PUBLIC_DUMMYJSON_BASE_URL || "https://dummyjson.com";

async function getProducts(query: string | null): Promise<Product[]> {
    let products: Product[] = [];

    if (query) {
        const res = await fetch(`${BASE}/products/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        products = data.products || [];
    } else {
        const res = await fetch(`${BASE}/products?limit=100`);
        const data = await res.json();
        products = data.products || [];
    }

    return products;
}

export default function ProductsPage() {
    const searchParams = useSearchParams();
    const query = searchParams.get("query");
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        getProducts(query).then(setProducts);
    }, [query]);

    return (
        <div className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Sidebar */}
            <div className="md:col-span-3">
                <SidebarFilters />
            </div>

            {/* Search + Products */}
            <div className="md:col-span-9 space-y-4">
                <SearchBar />
                <ProductList products={products} />
            </div>
        </div>
    );
}
