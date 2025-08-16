"use client";

import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useSearchParams } from "next/navigation";

export default function CheckoutSuccessPage() {
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
        </div>
    );
}

