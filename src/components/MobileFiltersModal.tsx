'use client';

import { useState } from 'react';
import { XMarkIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';
import SidebarFilters from './SidebarFilters';

export default function MobileFiltersModal() {
    const [isOpen, setIsOpen] = useState(false);

    const handleClose = () => {
        setIsOpen(false);
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

                        {/* Content */}
                        <div className="p-4 overflow-y-auto max-h-[50vh]">
                            <SidebarFilters />
                        </div>

                        {/* Apply Button */}
                        <div className="p-4 border-t bg-gray-50 rounded-b-lg">
                            <button
                                onClick={handleClose}
                                className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white py-2.5 rounded-lg font-semibold hover:from-purple-600 hover:to-indigo-700 transition-all duration-200"
                            >
                                Apply Filters
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}