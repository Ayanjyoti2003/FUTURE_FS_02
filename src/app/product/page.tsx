"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ProductList from "@/components/ProductList";
import SidebarFilters from "@/components/SidebarFilters";
import MobileFiltersModal from "@/components/MobileFiltersModal";
import MobileSearchBar from "@/components/MobileSearchBar";
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
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        getProducts(query).then((data) => {
            setProducts(data);
            setLoading(false);
        });
    }, [query]);

    return (
        <>
            {/* Mobile Search Bar - Sticky */}
            <MobileSearchBar />

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Desktop Sidebar - Hidden on mobile */}
                <div className="hidden lg:block lg:col-span-3">
                    <div className="sticky top-20">
                        <SidebarFilters />
                    </div>
                </div>

                {/* Products Section */}
                <div className="lg:col-span-9">
                    {/* Search Results Header */}
                    {query && (
                        <div className="mb-6 px-4 lg:px-0">
                            <h2 className="text-xl font-semibold text-gray-800">
                                Search results for: &ldquo;{query}&rdquo;
                            </h2>
                            <p className="text-gray-600 mt-1">
                                {loading ? 'Searching...' : `${products.length} products found`}
                            </p>
                        </div>
                    )}

                    {/* Products Grid */}
                    <div className="px-4 lg:px-0">
                        {loading ? (
                            <ProductsListLoading />
                        ) : (
                            <ProductList products={products} />
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Filter Modal */}
            <MobileFiltersModal />
        </>
    );
}

// Loading components
function ProductsPageLoading() {
    return (
        <div className="space-y-6">
            <MobileSearchBar />
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="hidden lg:block lg:col-span-3">
                    <SidebarFiltersLoading />
                </div>
                <div className="lg:col-span-9 px-4 lg:px-0">
                    <ProductsListLoading />
                </div>
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

function ProductsListLoading() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {[...Array(8)].map((_, i) => (
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
        <div className="min-h-screen">
            <Suspense fallback={<ProductsPageLoading />}>
                <ProductsContent />
            </Suspense>
        </div>
    );
}