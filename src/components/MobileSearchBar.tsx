'use client';

import { Suspense } from 'react';
import SearchBar from './SearchBar';

// Loading component for search bar
function SearchBarLoading() {
    return (
        <div className="w-full h-12 bg-gray-200 rounded-lg animate-pulse"></div>
    );
}

export default function MobileSearchBar() {
    return (
        <div className="md:hidden sticky top-16 z-30 bg-white/95 backdrop-blur-sm border-b border-gray-200 px-4 py-3 shadow-sm">
            <Suspense fallback={<SearchBarLoading />}>
                <SearchBar />
            </Suspense>
        </div>
    );
}