"use client";

import Link from "next/link";
import Image from "next/image"; // ✅ use Next.js Image
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
                            <div className="relative w-12 h-12">
                                <Image
                                    src={item.image || "/placeholder.png"} // fallback in case image is missing
                                    alt={item.title}
                                    fill
                                    className="rounded object-cover"
                                />
                            </div>
                            <span className="text-sm text-gray-700 line-clamp-1">
                                {item.title}
                            </span>
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
