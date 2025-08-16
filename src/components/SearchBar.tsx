"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { XMarkIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";

export default function SearchBar() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const initialQuery = searchParams.get("query") || "";
    const [query, setQuery] = useState(initialQuery);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            router.push(`/product?query=${encodeURIComponent(query)}`);
        } else {
            router.push(`/product`);
        }
    };

    const clearSearch = () => {
        setQuery("");
        router.push(`/product`);
    };

    return (
        <form onSubmit={handleSearch} className="relative w-full">
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full rounded-lg border border-purple-300 px-4 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white shadow-sm"
            />

            {/* Clear button */}
            {query && (
                <button
                    type="button"
                    onClick={clearSearch}
                    className="absolute right-10 top-1/2 -translate-y-1/2 text-purple-500 hover:text-purple-700"
                >
                    <XMarkIcon className="w-5 h-5" />
                </button>
            )}

            {/* Search icon */}
            <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-purple-500 hover:text-purple-700"
            >
                <MagnifyingGlassIcon className="w-5 h-5" />
            </button>
        </form>
    );
}
