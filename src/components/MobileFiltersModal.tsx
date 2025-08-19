'use client';

import { useState, useEffect } from 'react';
import { XMarkIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';
import SidebarFilters from './SidebarFilters';

export default function MobileFiltersModal() {
    const [isOpen, setIsOpen] = useState(false);

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        // Cleanup on unmount
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

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

            {/* Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Modal */}
            <div
                className={`fixed top-0 right-0 h-full w-80 max-w-[90vw] bg-white z-50 transform transition-transform duration-300 ease-in-out md:hidden ${isOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-purple-500 to-indigo-600 text-white">
                    <h2 className="text-lg font-semibold">Filters</h2>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="p-1 hover:bg-purple-600 rounded"
                        aria-label="Close filters"
                    >
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-4 overflow-y-auto h-full pb-20">
                    <SidebarFilters />
                </div>

                {/* Apply Button */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t">
                    <button
                        onClick={() => setIsOpen(false)}
                        className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-indigo-700 transition-all duration-200"
                    >
                        Apply Filters
                    </button>
                </div>
            </div>
        </>
    );
}