"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem } from "@/types";

type CartState = {
    items: CartItem[];
    add: (item: Omit<CartItem, "qty"> & { qty?: number }) => void;
    remove: (id: string) => void;
    updateQty: (id: string, qty: number) => void;
    clear: () => void;
    subtotal: () => number;
    count: () => number;
};

export const useCart = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            add: (item) =>
                set((s) => {
                    const exist = s.items.find((it) => it.id === item.id);
                    if (exist) {
                        return {
                            items: s.items.map((it) =>
                                it.id === item.id ? { ...it, qty: it.qty + (item.qty ?? 1) } : it
                            ),
                        };
                    }
                    return { items: [...s.items, { ...item, qty: item.qty ?? 1 }] };
                }),
            remove: (id) => set((s) => ({ items: s.items.filter((i) => i.id !== id) })),
            updateQty: (id, qty) =>
                set((s) => ({
                    items: s.items.map((i) => (i.id === id ? { ...i, qty: Math.max(1, qty) } : i)),
                })),
            clear: () => set({ items: [] }),
            subtotal: () => get().items.reduce((sum, i) => sum + i.price * i.qty, 0),
            count: () => get().items.reduce((sum, i) => sum + i.qty, 0),
        }),
        { name: "mini-shop-cart" }
    )
);
