"use client";

import Image from "next/image";
import Link from "next/link";
import { useWishlist } from "@/store/useWishlist";

export default function WishlistPage() {
    const { items, remove } = useWishlist();

    if (items.length === 0) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-10 text-center">
                <h1 className="text-2xl font-bold text-gray-800">Your Wishlist is Empty 💜</h1>
                <p className="mt-2 text-gray-600">Start exploring and add products you love!</p>
                <Link
                    href="/"
                    className="mt-6 inline-block px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                >
                    Continue Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-10">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Your Wishlist 💜</h1>

            <div className="space-y-4">
                {items.map((item) => (
                    <div
                        key={item.id}
                        className="flex items-center gap-4 border rounded-lg p-4 shadow-sm bg-white"
                    >
                        <div className="relative w-24 h-24 flex-shrink-0">
                            <Image
                                src={item.image || "/placeholder.png"}
                                alt={item.title}
                                fill
                                className="object-cover rounded-md"
                            />
                        </div>
                        <div className="flex-1">
                            <Link
                                href={`/product/${item.id}`}
                                className="text-lg font-semibold text-purple-700 hover:underline"
                            >
                                {item.title}
                            </Link>
                            <p className="text-gray-600">${item.price}</p>
                        </div>
                        <button
                            onClick={() => remove(item.id)}
                            className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded"
                        >
                            Remove
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
