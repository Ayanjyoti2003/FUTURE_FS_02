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

    // Create category groups for better organization
    const categoryGroups = {
        electronics: ['smartphones', 'laptops', 'tablets'],
        fashion: ['mens-shirts', 'mens-shoes', 'mens-watches', 'womens-dresses', 'womens-shoes', 'womens-watches', 'womens-bags', 'womens-jewellery', 'tops', 'sunglasses'],
        home: ['home-decoration', 'furniture', 'kitchen-accessories'],
        beauty: ['beauty', 'fragrances', 'skin-care'],
        sports: ['sports-accessories'],
        automotive: ['vehicle', 'motorcycle'],
        groceries: ['groceries']
    };

    // Fetch categories
    useEffect(() => {
        fetch(
            `${process.env.NEXT_PUBLIC_DUMMYJSON_BASE_URL ?? "https://dummyjson.com"}/products/categories`
        )
            .then((r) => r.json())
            .then((data) => setCategories(data || []));
    }, []);

    // Set initial values from URL
    useEffect(() => {
        setMinPrice(searchParams.get("minPrice") ?? "");
        setMaxPrice(searchParams.get("maxPrice") ?? "");

        // Handle multiple categories from URL
        const categoryParam = searchParams.get("category");
        if (categoryParam) {
            setSelectedCategories(categoryParam.split(','));
        } else {
            setSelectedCategories([]);
        }
    }, [searchParams]);

    // Toggle category selection (allow multiple)
    const toggleCategory = (category: string) => {
        const newSelected = selectedCategories.includes(category)
            ? selectedCategories.filter(c => c !== category)
            : [...selectedCategories, category];

        setSelectedCategories(newSelected);
    };

    // Get categories by group
    const getCategoriesByGroup = (groupName: string): Category[] => {
        const groupCategories = categoryGroups[groupName as keyof typeof categoryGroups] || [];
        return categories.filter(cat => groupCategories.includes(cat));
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

        // Set categories (multiple)
        if (selectedCategories.length > 0) {
            qp.set("category", selectedCategories.join(','));
        } else {
            qp.delete("category");
        }

        // Set price range
        if (minPrice) qp.set("minPrice", minPrice);
        else qp.delete("minPrice");
        if (maxPrice) qp.set("maxPrice", maxPrice);
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

            {/* Filter Modal - No backdrop, just corner popup */}
            {isOpen && (
                <div className="fixed bottom-4 right-4 z-50 md:hidden">
                    {/* Corner Modal - Bottom Right */}
                    <div className="w-80 max-w-[calc(100vw-2rem)] max-h-[70vh] bg-white rounded-lg shadow-2xl border transform transition-all duration-300 ease-out">
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

                        {/* Content - Direct Filter Options */}
                        <div className="p-4 overflow-y-auto max-h-[50vh] space-y-6">
                            {/* Categories */}
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-3">
                                    Categories {selectedCategories.length > 0 && <span className="text-sm text-purple-600">({selectedCategories.length} selected)</span>}
                                </h3>
                                <div className="space-y-3 max-h-40 overflow-y-auto">
                                    {/* Clear Categories Button */}
                                    {selectedCategories.length > 0 && (
                                        <button
                                            onClick={() => setSelectedCategories([])}
                                            className="text-sm text-red-600 hover:text-red-800 underline"
                                        >
                                            Clear all categories
                                        </button>
                                    )}

                                    {/* Electronics Group */}
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-700 mb-2">📱 Electronics</h4>
                                        <div className="space-y-1 pl-4">
                                            {getCategoriesByGroup('electronics').map((category) => (
                                                <label key={category} className="flex items-center space-x-2">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedCategories.includes(category)}
                                                        onChange={() => toggleCategory(category)}
                                                        className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                                                    />
                                                    <span className="text-sm text-gray-700">{formatCategoryName(category)}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Fashion Group */}
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-700 mb-2">👗 Fashion</h4>
                                        <div className="space-y-1 pl-4">
                                            {getCategoriesByGroup('fashion').map((category) => (
                                                <label key={category} className="flex items-center space-x-2">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedCategories.includes(category)}
                                                        onChange={() => toggleCategory(category)}
                                                        className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                                                    />
                                                    <span className="text-sm text-gray-700">{formatCategoryName(category)}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Beauty Group */}
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-700 mb-2">💄 Beauty</h4>
                                        <div className="space-y-1 pl-4">
                                            {getCategoriesByGroup('beauty').map((category) => (
                                                <label key={category} className="flex items-center space-x-2">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedCategories.includes(category)}
                                                        onChange={() => toggleCategory(category)}
                                                        className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                                                    />
                                                    <span className="text-sm text-gray-700">{formatCategoryName(category)}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Home Group */}
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-700 mb-2">🏠 Home & Living</h4>
                                        <div className="space-y-1 pl-4">
                                            {getCategoriesByGroup('home').map((category) => (
                                                <label key={category} className="flex items-center space-x-2">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedCategories.includes(category)}
                                                        onChange={() => toggleCategory(category)}
                                                        className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                                                    />
                                                    <span className="text-sm text-gray-700">{formatCategoryName(category)}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Other Categories */}
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-700 mb-2">🛍️ Other</h4>
                                        <div className="space-y-1 pl-4">
                                            {categories
                                                .filter(cat => !Object.values(categoryGroups).flat().includes(cat))
                                                .map((category) => (
                                                    <label key={category} className="flex items-center space-x-2">
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedCategories.includes(category)}
                                                            onChange={() => toggleCategory(category)}
                                                            className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                                                        />
                                                        <span className="text-sm text-gray-700">{formatCategoryName(category)}</span>
                                                    </label>
                                                ))}
                                        </div>
                                    </div>
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