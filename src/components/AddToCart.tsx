"use client";

import { useCart } from "@/store/useCart";

export default function AddToCart({ id, title, price, image }: { id: number; title: string; price: number; image?: string }) {
    const add = useCart((s) => s.add);

    return (
        <button
            className="underline"
            onClick={() => add({ id, title, price, image })}
        >
            Add to cart
        </button>
    );
}
