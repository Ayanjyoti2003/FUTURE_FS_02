"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/store/useCart";
import { useWishlist } from "@/store/useWishlist";
import type { Product } from "@/types";
import { HeartIcon as HeartOutline } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid";

export default function ProductCard({ p }: { p: Product }) {
    const add = useCart((s) => s.add);
    const { items, toggle } = useWishlist();
    const inWishlist = items.some((item) => item.id === p.id);

    return (
        <div className="border border-gray-200 rounded-xl p-4 flex flex-col bg-white shadow-sm hover:shadow-md transition-shadow relative">
            <Link href={`/product/${p.id}`} className="block">
                <div className="relative w-full h-48 rounded-lg overflow-hidden">
                    <Image
                        src={p.thumbnail || p.images?.[0] || "/placeholder.png"}
                        alt={p.title}
                        fill
                        className="object-cover"
                    />
                </div>
                <h4 className="mt-3 font-semibold text-gray-900 line-clamp-1">
                    {p.title}
                </h4>
            </Link>

            {/* Wishlist Icon (top-right corner) */}
            <button
                onClick={() =>
                    toggle({
                        id: p.id,
                        title: p.title,
                        price: p.price,
                        image: p.thumbnail || "/placeholder.png",
                    })
                }
                aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
                className="absolute top-3 right-3 rounded-full p-1 bg-white shadow-sm hover:bg-purple-50 transition"
            >
                {inWishlist ? (
                    <HeartSolid className="w-6 h-6 text-purple-600" />
                ) : (
                    <HeartOutline className="w-6 h-6 text-gray-500 hover:text-purple-600 transition-colors" />
                )}
            </button>

            <div className="flex items-center justify-between mt-3">
                <span className="font-bold text-purple-700">${p.price}</span>
                <button
                    onClick={() =>
                        add({
                            id: p.id,
                            title: p.title,
                            price: p.price,
                            image: p.thumbnail,
                        })
                    }
                    className="text-sm font-medium px-4 py-1.5 bg-purple-100 text-purple-700 rounded-md hover:bg-purple-200 active:bg-purple-300 transition-colors"
                >
                    Add to cart
                </button>
            </div>
        </div>
    );
}
