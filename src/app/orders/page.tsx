"use client";

import { useEffect } from "react";
import { useOrders } from "@/store/useOrders";

export default function OrderHistoryPage() {
    const { orders, fetchOrders, loading } = useOrders();

    // Load orders on mount
    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Your Orders</h1>

            {loading ? (
                <p className="text-gray-500">Loading your orders...</p>
            ) : orders.length > 0 ? (
                <ul className="space-y-4">
                    {orders.map((order) => (
                        <li
                            key={order.id}
                            className="p-4 bg-white shadow rounded-lg flex justify-between items-center"
                        >
                            <div>
                                <p className="font-medium">Order #{order.id}</p>
                                <p className="text-sm text-gray-500">{order.date}</p>
                            </div>
                            <p className="text-purple-600 font-semibold">${order.total.toFixed(2)}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-gray-500">You haven’t placed any orders yet.</p>
            )}
        </div>
    );
}
