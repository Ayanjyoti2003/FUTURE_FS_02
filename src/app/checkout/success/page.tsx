"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

// Component that uses useSearchParams - needs to be wrapped in Suspense
function CheckoutSuccessContent() {
    const searchParams = useSearchParams();
    const orderId = searchParams.get("orderId");

    // No need to update status since orders are created as "PAID" directly
    // useEffect for status update removed since it's handled in the API

    return (
        <div className="text-center py-10">
            <h1 className="text-3xl font-bold text-green-600">Payment Successful!</h1>
            <p className="mt-4 text-gray-600">Your simulated payment has been processed and your order is confirmed as paid.</p>
            {orderId && (
                <p className="mt-2 text-sm text-gray-500">Order ID: {orderId}</p>
            )}
            <div className="mt-6">
                <Link
                    href="/orders"
                    className="inline-block px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                    View Your Orders
                </Link>
            </div>
        </div>
    );
}

// Loading fallback component
function CheckoutSuccessLoading() {
    return (
        <div className="text-center py-10">
            <div className="animate-pulse">
                <div className="h-10 bg-gray-200 rounded-lg mb-4 max-w-md mx-auto"></div>
                <div className="h-6 bg-gray-200 rounded mb-4 max-w-lg mx-auto"></div>
                <div className="h-4 bg-gray-200 rounded max-w-xs mx-auto"></div>
            </div>
        </div>
    );
}

// Main page component
export default function CheckoutSuccessPage() {
    return (
        <Suspense fallback={<CheckoutSuccessLoading />}>
            <CheckoutSuccessContent />
        </Suspense>
    );
}