"use client";

import { useEffect, Suspense } from "react";
import { useAuth } from "@/context/AuthContext";
import { useSearchParams } from "next/navigation";

// Component that uses useSearchParams - needs to be wrapped in Suspense
function CheckoutSuccessContent() {
    const { user } = useAuth();
    const searchParams = useSearchParams();
    const orderId = searchParams.get("orderId");

    useEffect(() => {
        const updateStatus = async () => {
            if (!user || !orderId) return;
            const token = await user.getIdToken();

            await fetch(`/api/orders?id=${orderId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ status: "PAID" }),
            });
        };
        updateStatus();
    }, [user, orderId]);

    return (
        <div className="text-center py-10">
            <h1 className="text-3xl font-bold text-green-600">Payment Successful!</h1>
            <p className="mt-4 text-gray-600">Your order is now marked as paid.</p>
            {orderId && (
                <p className="mt-2 text-sm text-gray-500">Order ID: {orderId}</p>
            )}
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