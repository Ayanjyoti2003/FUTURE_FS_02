"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ProductList from "@/components/ProductList";
import SidebarFilters from "@/components/SidebarFilters";
import MobileFiltersModal from "@/components/MobileFiltersModal";
import MobileSearchBar from "@/components/MobileSearchBar";
import type { Product } from "@/types";

const BASE = process.env.NEXT_PUBLIC_DUMMYJSON_BASE_URL || "https://dummyjson.com";

async function getProducts(
    query: string | null,
    category: string | null,
    minPrice: string | null,
    maxPrice: string | null,
    sort: string | null
): Promise<Product[]> {
    let products: Product[] = [];

    try {
        if (query) {
            // Search by query
            const res = await fetch(`${BASE}/products/search?q=${encodeURIComponent(query)}`);
            const data = await res.json();
            products = data.products || [];
        } else if (category) {
            // Handle multiple categories
            const categories = category.split(',').map(c => c.trim());
            const allCategoryProducts = new Set<Product>();

            // Fetch products for each category
            await Promise.all(
                categories.map(async (cat) => {
                    try {
                        const res = await fetch(`${BASE}/products/category/${encodeURIComponent(cat)}`);
                        const data = await res.json();
                        const categoryProducts = data.products || [];
                        categoryProducts.forEach((product: Product) => allCategoryProducts.add(product));
                    } catch (error) {
                        console.error(`Error fetching category ${cat}:`, error);
                    }
                })
            );

            products = Array.from(allCategoryProducts);
        } else {
            // Get all products
            const res = await fetch(`${BASE}/products?limit=100`);
            const data = await res.json();
            products = data.products || [];
        }

        // Apply price filtering
        if (minPrice || maxPrice) {
            products = products.filter((product) => {
                const price = product.price;
                const min = minPrice ? parseFloat(minPrice) : 0;
                const max = maxPrice ? parseFloat(maxPrice) : Infinity;
                return price >= min && price <= max;
            });
        }

        // Apply sorting
        if (sort) {
            products.sort((a, b) => {
                switch (sort) {
                    case 'price-asc':
                        return a.price - b.price;
                    case 'price-desc':
                        return b.price - a.price;
                    case 'name-asc':
                        return a.title.localeCompare(b.title);
                    case 'name-desc':
                        return b.title.localeCompare(a.title);
                    case 'rating':
                        return (b.rating || 0) - (a.rating || 0);
                    default:
                        return 0;
                }
            });
        }
    } catch (error) {
        console.error('Error fetching products:', error);
        products = [];
    }

    return products;
}

// Component that uses useSearchParams - needs to be wrapped in Suspense
function ProductsContent() {
    const searchParams = useSearchParams();
    const query = searchParams.get("query");
    const category = searchParams.get("category");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const sort = searchParams.get("sort");

    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        getProducts(query, category, minPrice, maxPrice, sort).then((data) => {
            setProducts(data);
            setLoading(false);
        });
    }, [query, category, minPrice, maxPrice, sort]);

    // Create filter summary for display
    const getFilterSummary = () => {
        const filters = [];
        if (query) filters.push(`Search: "${query}"`);
        if (category) filters.push(`Category: ${category.replace('-', ' ')}`);
        if (minPrice) filters.push(`Min: $${minPrice}`);
        if (maxPrice) filters.push(`Max: $${maxPrice}`);
        if (sort) {
            const sortLabels = {
                'price-asc': 'Price: Low to High',
                'price-desc': 'Price: High to Low',
                'name-asc': 'Name: A to Z',
                'name-desc': 'Name: Z to A',
                'rating': 'Top Rated'
            };
            filters.push(sortLabels[sort as keyof typeof sortLabels] || `Sort: ${sort}`);
        }
        return filters;
    };

    const filterSummary = getFilterSummary();
    const hasFilters = query || category || minPrice || maxPrice || sort;

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
                    {/* Filter Results Header */}
                    {hasFilters && (
                        <div className="mb-6 px-4 lg:px-0">
                            <h2 className="text-xl font-semibold text-gray-800">
                                {query ? `Search results for: &ldquo;${query}&rdquo;` : 'Filtered Results'}
                            </h2>
                            <div className="mt-2 flex flex-wrap gap-2">
                                {filterSummary.map((filter, index) => (
                                    <span
                                        key={index}
                                        className="inline-block bg-purple-100 text-purple-800 text-sm px-3 py-1 rounded-full"
                                    >
                                        {filter}
                                    </span>
                                ))}
                            </div>
                            <p className="text-gray-600 mt-2">
                                {loading ? 'Loading...' : `${products.length} products found`}
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