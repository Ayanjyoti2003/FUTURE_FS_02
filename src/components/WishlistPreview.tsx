"use client";

import Link from "next/link";
import { useWishlist } from "@/store/useWishlist";

export default function WishlistPreview() {
    const { items } = useWishlist();
    const recent = items.slice(0, 3); // take only first 3

    return (
        <div className="space-y-3">
            {recent.length === 0 ? (
                <p className="text-gray-500">Your wishlist is empty.</p>
            ) : (
                <ul className="space-y-2">
                    {recent.map((item) => (
                        <li key={item.id} className="flex items-center gap-3">
                            <img
                                src={item.image}
                                alt={item.title}
                                className="w-12 h-12 rounded object-cover"
                            />
                            <span className="text-sm text-gray-700 line-clamp-1">{item.title}</span>
                        </li>
                    ))}
                </ul>
            )}
            <div className="mt-3 text-right">
                <Link
                    href="/wishlist"
                    className="text-purple-600 hover:underline text-sm font-medium"
                >
                    View all →
                </Link>
            </div>
        </div>
    );
}
