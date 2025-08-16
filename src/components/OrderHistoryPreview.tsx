"use client";

import Link from "next/link";
import { useOrders } from "../store/useOrders"; // <- if you have orders in Zustand

export default function OrderHistoryPreview() {
    const { orders } = useOrders();
    const recent = orders.slice(0, 3); // latest 3

    return (
        <div className="space-y-3">
            {recent.length === 0 ? (
                <p className="text-gray-500">No orders yet.</p>
            ) : (
                <ul className="space-y-2">
                    {recent.map((order) => (
                        <li key={order.id} className="flex justify-between text-sm">
                            <span className="text-gray-700">#{order.id}</span>
                            <span className="font-medium text-purple-700">${order.total}</span>
                        </li>
                    ))}
                </ul>
            )}
            <div className="mt-3 text-right">
                <Link
                    href="/order-history"
                    className="text-purple-600 hover:underline text-sm font-medium"
                >
                    View all →
                </Link>
            </div>
        </div>
    );
}
