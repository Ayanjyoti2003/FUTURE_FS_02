'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { XMarkIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';

type Category = string;

export default function MobileFiltersModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");

    const router = useRouter();
    const searchParams = useSearchParams();
    const activeSort = searchParams.get("sort") ?? "";

    const handleClose = () => {
        setIsOpen(false);
    };

    // Fetch categories with fallback
    useEffect(() => {
        // Set fallback categories immediately to ensure something shows
        const fallbackCategories = [
            'beauty', 'fragrances', 'furniture', 'groceries', 'home-decoration',
            'kitchen-accessories', 'laptops', 'mens-shirts', 'mens-shoes', 'mens-watches',
            'mobile-accessories', 'motorcycle', 'skin-care', 'smartphones', 'sports-accessories',
            'sunglasses', 'tablets', 'tops', 'vehicle', 'womens-bags', 'womens-dresses',
            'womens-jewellery', 'womens-shoes', 'womens-watches'
        ];

        // Set fallback first to ensure UI is never empty
        setCategories(fallbackCategories);

        // Try to fetch from API
        fetch(
            `${process.env.NEXT_PUBLIC_DUMMYJSON_BASE_URL ?? "https://dummyjson.com"}/products/categories`
        )
            .then((r) => r.json())
            .then((data) => {
                // Only update if we get valid data, otherwise keep fallback
                if (Array.isArray(data) && data.length > 0) {
                    const validCategories = data.filter(cat => cat && typeof cat === 'string');
                    if (validCategories.length > 0) {
                        setCategories(validCategories);
                    }
                }
            })
            .catch((error) => {
                console.error('Error fetching categories (using fallback):', error);
                // Keep the fallback categories we already set
            });
    }, []);

    // Set initial values from URL
    useEffect(() => {
        setMinPrice(searchParams.get("minPrice") ?? "");
        setMaxPrice(searchParams.get("maxPrice") ?? "");

        // Handle multiple categories from URL
        const categoryParam = searchParams.get("category");
        if (categoryParam && typeof categoryParam === 'string' && categoryParam.length > 0) {
            setSelectedCategories(categoryParam.split(',').map(c => c.trim()).filter(c => c.length > 0));
        } else {
            setSelectedCategories([]);
        }
    }, [searchParams]);

    // Toggle category selection
    const toggleCategory = (category: string) => {
        if (!category || typeof category !== 'string') {
            console.warn('Invalid category passed to toggleCategory:', category);
            return;
        }

        try {
            const newSelected = selectedCategories.includes(category)
                ? selectedCategories.filter(c => c !== category)
                : [...selectedCategories, category];
            setSelectedCategories(newSelected);
        } catch (error) {
            console.error('Error in toggleCategory:', error);
        }
    };

    // Choose sort option
    const chooseSort = (sortValue: string) => {
        const qp = new URLSearchParams(searchParams.toString());
        if (sortValue) qp.set("sort", sortValue);
        else qp.delete("sort");
        router.push(`/product?${qp.toString()}`);
    };

    // Apply all filters
    const applyFilters = () => {
        const qp = new URLSearchParams(searchParams.toString());

        // Set categories
        if (selectedCategories && selectedCategories.length > 0) {
            const validCategories = selectedCategories.filter(cat => cat && typeof cat === 'string' && cat.trim().length > 0);
            if (validCategories.length > 0) {
                qp.set("category", validCategories.join(','));
            } else {
                qp.delete("category");
            }
        } else {
            qp.delete("category");
        }

        // Set price range
        if (minPrice && minPrice.trim()) qp.set("minPrice", minPrice.trim());
        else qp.delete("minPrice");
        if (maxPrice && maxPrice.trim()) qp.set("maxPrice", maxPrice.trim());
        else qp.delete("maxPrice");

        router.push(`/product?${qp.toString()}`);
        handleClose();
    };

    // Clear all filters
    const clearFilters = () => {
        const qp = new URLSearchParams(searchParams.toString());
        qp.delete("category");
        qp.delete("minPrice");
        qp.delete("maxPrice");
        qp.delete("sort");
        router.push(`/product?${qp.toString()}`);
        setSelectedCategories([]);
        setMinPrice("");
        setMaxPrice("");
        handleClose();
    };

    // Format category name for display
    const formatCategoryName = (category: string): string => {
        return category
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    return (
        <>
            {/* Filter Button - Only visible on mobile */}
            <button
                onClick={() => setIsOpen(true)}
                className="md:hidden fixed bottom-20 right-4 z-40 bg-gradient-to-r from-purple-500 to-indigo-600 text-white p-3 rounded-full shadow-lg hover:from-purple-600 hover:to-indigo-700 transition-all duration-200"
                aria-label="Open filters"
            >
                <AdjustmentsHorizontalIcon className="w-6 h-6" />
            </button>

            {/* Filter Modal */}
            {isOpen && (
                <div className="fixed bottom-4 right-4 z-50 md:hidden">
                    <div className="w-80 max-w-[calc(100vw-2rem)] max-h-[85vh] bg-white rounded-lg shadow-2xl border transform transition-all duration-300 ease-out">
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-t-lg">
                            <h2 className="text-lg font-semibold">Filters</h2>
                            <button
                                onClick={handleClose}
                                className="p-1 hover:bg-purple-600 rounded-full transition-colors duration-200"
                                aria-label="Close filters"
                            >
                                <XMarkIcon className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-4 overflow-y-auto max-h-[60vh] space-y-6">
                            {/* Categories */}
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-3">Categories</h3>
                                <div className="space-y-2 max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-purple-300 scrollbar-track-gray-100 pr-2 border rounded-lg p-2">
                                    {/* All Categories Button */}
                                    <button
                                        onClick={() => setSelectedCategories([])}
                                        className={`block w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${selectedCategories.length === 0
                                            ? "bg-purple-600 text-white"
                                            : "hover:bg-gray-100 text-gray-700 border"
                                            }`}
                                    >
                                        All Categories
                                    </button>

                                    {/* Individual Category Buttons */}
                                    {categories.map((category) => {
                                        const isSelected = selectedCategories.includes(category);
                                        return (
                                            <button
                                                key={category}
                                                onClick={() => toggleCategory(category)}
                                                className={`block w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${isSelected
                                                    ? "bg-purple-600 text-white"
                                                    : "hover:bg-gray-100 text-gray-700 border"
                                                    }`}
                                            >
                                                <span className="flex items-center justify-between">
                                                    <span>{formatCategoryName(category)}</span>
                                                    {isSelected && <span className="text-xs">✓</span>}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Price Range */}
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-3">Price Range</h3>
                                <div className="flex gap-3">
                                    <div className="flex-1">
                                        <input
                                            type="number"
                                            placeholder="Min"
                                            value={minPrice}
                                            onChange={(e) => setMinPrice(e.target.value)}
                                            className="w-full px-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <input
                                            type="number"
                                            placeholder="Max"
                                            value={maxPrice}
                                            onChange={(e) => setMaxPrice(e.target.value)}
                                            className="w-full px-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Sort Options */}
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-3">Sort By</h3>
                                <div className="space-y-2">
                                    {[
                                        { value: "", label: "Default" },
                                        { value: "price-asc", label: "Price: Low to High" },
                                        { value: "price-desc", label: "Price: High to Low" },
                                        { value: "name-asc", label: "Name: A to Z" },
                                        { value: "name-desc", label: "Name: Z to A" },
                                        { value: "rating", label: "Top Rated" }
                                    ].map((option) => (
                                        <button
                                            key={option.value}
                                            onClick={() => chooseSort(option.value)}
                                            className={`block w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${activeSort === option.value
                                                ? "bg-purple-600 text-white"
                                                : "hover:bg-gray-100 text-gray-700 border"
                                                }`}
                                        >
                                            {option.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="p-4 border-t bg-gray-50 rounded-b-lg space-y-3">
                            <button
                                onClick={applyFilters}
                                className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white py-2.5 rounded-lg font-semibold hover:from-purple-600 hover:to-indigo-700 transition-all duration-200"
                            >
                                Apply Filters
                            </button>
                            <button
                                onClick={clearFilters}
                                className="w-full bg-gray-200 text-gray-700 py-2.5 rounded-lg font-semibold hover:bg-gray-300 transition-all duration-200"
                            >
                                Clear All Filters
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
