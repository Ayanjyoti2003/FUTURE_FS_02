// src/components/SidebarFiltersWrapper.tsx
import { Suspense } from 'react';
import SidebarFilters from './SidebarFilters';

export default function SidebarFiltersWrapper() {
    return (
        <Suspense fallback={<FiltersFallback />}>
            <SidebarFilters />
        </Suspense>
    );
}

function FiltersFallback() {
    return (
        <div className="space-y-4">
            <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                <div className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded w-full"></div>
                    <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
            </div>
            <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-full"></div>
            </div>
        </div>
    );
}