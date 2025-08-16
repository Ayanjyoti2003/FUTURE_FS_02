"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/store/useCart";

export default function CartBadge() {
    const [mounted, setMounted] = useState(false);
    const count = useCart((s) => s.count());

    useEffect(() => setMounted(true), []);

    if (!mounted || count === 0) return null;

    return (
        <span className="absolute -top-2 -right-2 text-xs px-1.5 py-0.5 rounded-full bg-white text-purple-700 font-semibold shadow">
            {count}
        </span>
    );
}
