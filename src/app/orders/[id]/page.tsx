"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useOrders } from "@/store/useOrders";
import { format } from "date-fns";

export default function OrderDetailsPage() {
    const { id } = useParams(); // dynamic route param
    const { orders, fetchOrders } = useOrders();
    const [loading, setLoading] = useState(true);
    const [order, setOrder] = useState<any>(null);

    useEffect(() => {
        async function load() {
            await fetchOrders();
            setLoading(false);
        }
        load();
    }, [fetchOrders]);

    useEffect(() => {
        if (orders.length > 0 && id) {
            const found = orders.find((o) => o.id === id);
            setOrder(found || null);
        }
    }, [orders, id]);

    if (loading) {
        return (
            <div className="max-w-3xl mx-auto px-4 py-8">
                <p className="text-gray-500">Loading order...</p>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="max-w-3xl mx-auto px-4 py-8">
                <h1 className="text-xl font-bold mb-4">Order not found</h1>
                <p className="text-gray-500">
                    We couldn’t find the order you’re looking for.
                </p>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">
                Order #{order.id}
            </h1>

            {/* Order Summary */}
            <div className="bg-white shadow rounded-lg p-6 mb-6">
                <p>
                    <span className="font-medium">Date:</span>{" "}
                    {order.date
                        ? format(new Date(order.date), "PPPpp")
                        : "N/A"}
                </p>
                <p>
                    <span className="font-medium">Status:</span>{" "}
                    {order.status}
                </p>
                <p>
                    <span className="font-medium">Total:</span> $
                    {order.total.toFixed(2)}
                </p>
            </div>

            {/* Items */}
            <h2 className="text-lg font-semibold mb-3">Items</h2>
            <ul className="divide-y bg-white shadow rounded-lg">
                {order.items.map((item: any) => (
                    <li
                        key={item.id}
                        className="flex items-center justify-between p-4"
                    >
                        <a
                            href={`/product/${item.id}`} // 👈 link to product page
                            className="flex items-center space-x-3 hover:bg-gray-50 p-2 rounded transition"
                        >
                            {item.image && (
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    className="w-16 h-16 object-cover rounded"
                                />
                            )}
                            <div>
                                <p className="font-medium text-purple-600 hover:underline">
                                    {item.title}
                                </p>
                                <p className="text-sm text-gray-500">
                                    Qty: {item.quantity} × ${item.price}
                                </p>
                            </div>
                        </a>
                        <p className="font-semibold">
                            ${(item.price * item.quantity).toFixed(2)}
                        </p>
                    </li>
                ))}
            </ul>

        </div>
    );
}
