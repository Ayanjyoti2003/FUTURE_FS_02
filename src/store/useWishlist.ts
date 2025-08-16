"use client";

import { create } from "zustand";
import { auth } from "@/lib/firebaseClient";

export type WishlistItem = {
    id: number;
    title: string;
    price: number;
    image: string;
};

type WishlistState = {
    items: WishlistItem[];
    loading: boolean;
    fetchWishlist: () => Promise<void>;
    add: (item: WishlistItem) => Promise<void>;
    remove: (id: number) => Promise<void>;
    toggle: (item: WishlistItem) => Promise<void>;
    count: () => number;
};

export const useWishlist = create<WishlistState>((set, get) => ({
    items: [],
    loading: false,

    // 🔹 Fetch from API
    fetchWishlist: async () => {
        const token = await auth.currentUser?.getIdToken();
        if (!token) return;

        set({ loading: true });
        const res = await fetch("/api/wishlist", {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
            const data = await res.json();
            set({ items: data.wishlist || [] });
        }
        set({ loading: false });
    },

    // 🔹 Add item
    add: async (item) => {
        const token = await auth.currentUser?.getIdToken();
        if (!token) return;

        const res = await fetch("/api/wishlist", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(item),
        });

        if (res.ok) {
            await get().fetchWishlist(); // ✅ re-fetch after add
        }
    },

    // 🔹 Remove item
    remove: async (id) => {
        const token = await auth.currentUser?.getIdToken();
        if (!token) return;

        const res = await fetch(`/api/wishlist/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
            await get().fetchWishlist(); // ✅ re-fetch after remove
        }
    },

    // 🔹 Toggle item
    toggle: async (item) => {
        const exists = get().items.find((i) => i.id === item.id);
        if (exists) {
            await get().remove(item.id);
        } else {
            await get().add(item);
        }
    },

    // 🔹 Count items
    count: () => get().items.length,
}));
