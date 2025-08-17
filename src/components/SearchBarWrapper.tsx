// src/components/SearchBarWrapper.tsx
import { Suspense } from 'react';
import SearchBar from './SearchBar';

// Create a wrapper component that handles the Suspense boundary
export default function SearchBarWrapper() {
    return (
        <Suspense fallback={<SearchBarFallback />}>
            <SearchBar />
        </Suspense>
    );
}

// Fallback component that shows while SearchBar is loading
function SearchBarFallback() {
    return (
        <div className="flex gap-2">
            <input
                type="text"
                placeholder="Search products..."
                className="flex-1 border border-gray-300 rounded px-3 py-2 animate-pulse bg-gray-50"
                disabled
            />
            <button
                className="px-4 py-2 bg-gray-300 text-gray-500 rounded animate-pulse"
                disabled
            >
                Search
            </button>
        </div>
    );
}