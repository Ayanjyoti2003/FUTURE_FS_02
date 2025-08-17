"use client";

import { useEffect, useState, Suspense } from "react";
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

// Component that uses useSearchParams - needs to be wrapped in Suspense
function ProductsContent() {
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
                <Suspense fallback={<SidebarFiltersLoading />}>
                    <SidebarFilters />
                </Suspense>
            </div>

            {/* Search + Products */}
            <div className="md:col-span-9 space-y-4">
                <Suspense fallback={<SearchBarLoading />}>
                    <SearchBar />
                </Suspense>
                <ProductList products={products} />
            </div>
        </div>
    );
}

// Loading components
function ProductsPageLoading() {
    return (
        <div className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Sidebar Loading */}
            <div className="md:col-span-3">
                <SidebarFiltersLoading />
            </div>

            {/* Search + Products Loading */}
            <div className="md:col-span-9 space-y-4">
                <SearchBarLoading />
                <ProductsListLoading />
            </div>
        </div>
    );
}

function SidebarFiltersLoading() {
    return (
        <div className="space-y-4 animate-pulse">
            <div className="h-8 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-8 bg-gray-200 rounded"></div>
            <div className="h-24 bg-gray-200 rounded"></div>
        </div>
    );
}

function SearchBarLoading() {
    return (
        <div className="w-full h-10 bg-gray-200 rounded-lg animate-pulse"></div>
    );
}

function ProductsListLoading() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow p-4 animate-pulse">
                    <div className="h-48 bg-gray-200 rounded mb-4"></div>
                    <div className="h-6 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-8 bg-gray-200 rounded"></div>
                </div>
            ))}
        </div>
    );
}

// Main page component
export default function ProductsPage() {
    return (
        <Suspense fallback={<ProductsPageLoading />}>
            <ProductsContent />
        </Suspense>
    );
}