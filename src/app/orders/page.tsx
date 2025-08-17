"use client";

import { useEffect } from "react";
import { useOrders } from "@/store/useOrders";
import { format } from "date-fns";
import Link from "next/link";
import Image from "next/image"; // ✅ import Image

function StatusBadge({ status }: { status: string }) {
    const normalized = status?.toUpperCase() || "UNKNOWN";
    let colorClasses = "bg-gray-100 text-gray-700";

    switch (normalized) {
        case "PENDING":
            colorClasses = "bg-yellow-100 text-yellow-800";
            break;
        case "SHIPPED":
            colorClasses = "bg-blue-100 text-blue-800";
            break;
        case "DELIVERED":
            colorClasses = "bg-green-100 text-green-800";
            break;
        case "CANCELLED":
            colorClasses = "bg-red-100 text-red-800";
            break;
    }

    return (
        <span
            className={`px-2 py-1 text-xs font-medium rounded-full ${colorClasses}`}
        >
            {normalized.charAt(0) + normalized.slice(1).toLowerCase()}
        </span>
    );
}

export default function OrderHistoryPage() {
    const { orders, fetchOrders, loading } = useOrders();

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Your Orders</h1>

            {loading ? (
                <p className="text-gray-500">Loading your orders...</p>
            ) : orders.length > 0 ? (
                <ul className="space-y-6">
                    {orders.map((order) => (
                        <li
                            key={order.id}
                            className="p-6 bg-white shadow rounded-lg"
                        >
                            {/* Header */}
                            <div className="flex justify-between items-center border-b pb-3 mb-3">
                                <div>
                                    <p className="font-semibold">
                                        Order #{order.id}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        {order.date
                                            ? format(
                                                new Date(order.date),
                                                "PPPpp"
                                            )
                                            : ""}
                                    </p>
                                </div>
                                <div className="text-right space-y-1">
                                    <p className="text-purple-600 font-bold text-lg">
                                        ${order.total.toFixed(2)}
                                    </p>
                                    <StatusBadge status={order.status} />
                                </div>
                            </div>

                            {/* Items */}
                            <ul className="divide-y">
                                {order.items.map((item) => (
                                    <li
                                        key={item.id}
                                        className="flex items-center justify-between py-2"
                                    >
                                        <Link
                                            href={`/product/${item.id}`}
                                            className="flex items-center space-x-3 hover:bg-gray-50 p-2 rounded transition"
                                        >
                                            {item.image && (
                                                <Image
                                                    src={item.image}
                                                    alt={item.title}
                                                    width={48}  // ✅ must provide width
                                                    height={48} // ✅ must provide height
                                                    className="object-cover rounded"
                                                />
                                            )}
                                            <div>
                                                <p className="font-medium text-purple-600 hover:underline">
                                                    {item.title}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    Qty: {item.quantity}
                                                </p>
                                            </div>
                                        </Link>
                                        <p className="font-semibold">
                                            ${(item.price * item.quantity).toFixed(2)}
                                        </p>
                                    </li>
                                ))}
                            </ul>

                            {/* View Details button */}
                            <div className="mt-4 flex justify-end">
                                <Link
                                    href={`/orders/${order.id}`}
                                    className="px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded hover:bg-purple-700 transition"
                                >
                                    View Details
                                </Link>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-gray-500">
                    You haven’t placed any orders yet.
                </p>
            )}
        </div>
    );
}
