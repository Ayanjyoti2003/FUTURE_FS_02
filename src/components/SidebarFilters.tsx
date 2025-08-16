"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FunnelIcon, XMarkIcon } from "@heroicons/react/24/outline";

type Category = string | { slug: string; name: string };

export default function SidebarFilters() {
    const [cats, setCats] = useState<Category[]>([]);
    const [showCategories, setShowCategories] = useState(true);
    const [showPrice, setShowPrice] = useState(false);
    const [showSort, setShowSort] = useState(false);

    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");

    const [mobileOpen, setMobileOpen] = useState(false);

    const router = useRouter();
    const params = useSearchParams();
    const activeCategory = params.get("category") ?? "";
    const activeSort = params.get("sort") ?? "";

    // Fetch categories
    useEffect(() => {
        fetch(
            `${process.env.NEXT_PUBLIC_DUMMYJSON_BASE_URL ?? "https://dummyjson.com"}/products/categories`
        )
            .then((r) => r.json())
            .then((data) => setCats(data));
    }, []);

    // Collapse filters after a bit of scroll (desktop + mobile)
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 100) {
                setShowCategories(false);
                setShowPrice(false);
                setShowSort(false);
                setMobileOpen(false); // ✅ auto-close on mobile too
            }
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Choose category
    const chooseCategory = (c?: string) => {
        const qp = new URLSearchParams(params.toString());
        if (c && c.length) qp.set("category", c);
        else qp.delete("category");
        router.push(`/product?${qp.toString()}`);
        setMobileOpen(false);
    };

    // Apply price filter
    const applyPriceFilter = () => {
        const qp = new URLSearchParams(params.toString());
        if (minPrice) qp.set("minPrice", minPrice);
        else qp.delete("minPrice");
        if (maxPrice) qp.set("maxPrice", maxPrice);
        else qp.delete("maxPrice");
        router.push(`/product?${qp.toString()}`);
        setMobileOpen(false);
    };

    // Choose sort option
    const chooseSort = (sortValue: string) => {
        const qp = new URLSearchParams(params.toString());
        if (sortValue) qp.set("sort", sortValue);
        else qp.delete("sort");
        router.push(`/product?${qp.toString()}`);
        setMobileOpen(false);
    };

    // Clear all filters
    const clearFilters = () => {
        const qp = new URLSearchParams(params.toString());
        qp.delete("category");
        qp.delete("minPrice");
        qp.delete("maxPrice");
        qp.delete("sort");
        router.push(`/product?${qp.toString()}`);
        setMinPrice("");
        setMaxPrice("");
        setMobileOpen(false);
    };

    return (
        <>
            {/* Sidebar (desktop sticky, mobile drawer) */}
            <aside
                className={`fixed inset-y-0 left-0 z-40 w-64 transform bg-purple-50 p-4 shadow-lg overflow-y-auto transition-transform md:relative md:translate-x-0 md:sticky md:top-20 md:h-fit md:shadow-sm md:rounded-lg
                ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}
            >
                {/* Close button for mobile */}
                <div className="flex justify-between items-center md:hidden mb-4">
                    <h2 className="text-lg font-semibold text-purple-800">Filters</h2>
                    <button onClick={() => setMobileOpen(false)} className="text-gray-500">
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </div>

                {/* Categories */}
                <div className="space-y-4">
                    <div>
                        <button
                            onClick={() => setShowCategories(!showCategories)}
                            className="w-full flex justify-between items-center font-semibold text-purple-800 text-lg"
                        >
                            Categories
                            <span>{showCategories ? "−" : "+"}</span>
                        </button>
                        {showCategories && (
                            <div className="mt-2 space-y-1">
                                <button
                                    className={`block w-full text-left px-2 py-1 rounded-md transition-colors ${!activeCategory
                                        ? "bg-purple-600 text-white"
                                        : "hover:bg-purple-100 text-purple-700"
                                        }`}
                                    onClick={() => chooseCategory()}
                                >
                                    All
                                </button>
                                {cats.map((c, idx) => {
                                    const key =
                                        typeof c === "string" ? c : c.slug || idx.toString();
                                    const label = typeof c === "string" ? c : c.name;
                                    const isActive = activeCategory === key;
                                    return (
                                        <button
                                            key={key}
                                            className={`block w-full text-left px-2 py-1 rounded-md transition-colors ${isActive
                                                ? "bg-purple-600 text-white"
                                                : "hover:bg-purple-100 text-purple-700"
                                                }`}
                                            onClick={() => chooseCategory(key)}
                                        >
                                            {label}
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Price Range */}
                    <div>
                        <button
                            onClick={() => setShowPrice(!showPrice)}
                            className="w-full flex justify-between items-center font-semibold text-purple-800 text-lg"
                        >
                            Price Range
                            <span>{showPrice ? "−" : "+"}</span>
                        </button>
                        {showPrice && (
                            <div className="mt-2 space-y-2">
                                <div className="flex gap-2">
                                    <input
                                        type="number"
                                        placeholder="Min"
                                        value={minPrice}
                                        onChange={(e) => setMinPrice(e.target.value)}
                                        className="w-1/2 px-2 py-1 border rounded"
                                    />
                                    <input
                                        type="number"
                                        placeholder="Max"
                                        value={maxPrice}
                                        onChange={(e) => setMaxPrice(e.target.value)}
                                        className="w-1/2 px-2 py-1 border rounded"
                                    />
                                </div>
                                <button
                                    onClick={applyPriceFilter}
                                    className="w-full bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700 transition"
                                >
                                    Apply
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Sort By */}
                    <div>
                        <button
                            onClick={() => setShowSort(!showSort)}
                            className="w-full flex justify-between items-center font-semibold text-purple-800 text-lg"
                        >
                            Sort By
                            <span>{showSort ? "−" : "+"}</span>
                        </button>
                        {showSort && (
                            <div className="mt-2 space-y-1">
                                {[
                                    { label: "Price: Low to High", value: "price-asc" },
                                    { label: "Price: High to Low", value: "price-desc" },
                                    { label: "Newest First", value: "newest" },
                                ].map((option) => (
                                    <button
                                        key={option.value}
                                        className={`block w-full text-left px-2 py-1 rounded-md transition-colors ${activeSort === option.value
                                            ? "bg-purple-600 text-white"
                                            : "hover:bg-purple-100 text-purple-700"
                                            }`}
                                        onClick={() => chooseSort(option.value)}
                                    >
                                        {option.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Clear Filters Button */}
                    {(activeCategory || activeSort || minPrice || maxPrice) && (
                        <div className="pt-2 border-t">
                            <button
                                onClick={clearFilters}
                                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-2 rounded-md text-sm font-medium"
                            >
                                Clear Filters
                            </button>
                        </div>
                    )}
                </div>
            </aside>

            {/* Overlay for mobile */}
            {mobileOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-40 z-30 md:hidden"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* Floating Filter Button (mobile only) */}
            {!mobileOpen && (
                <button
                    onClick={() => setMobileOpen(true)}
                    className="fixed bottom-6 right-6 z-50 p-4 bg-purple-600 text-white rounded-full shadow-lg md:hidden hover:bg-purple-700 transition"
                >
                    <FunnelIcon className="w-6 h-6" />
                </button>
            )}
        </>
    );
}
