// src/store/useOrders.ts
"use client";

import { create } from "zustand";
import { auth } from "@/lib/firebaseClient";

export type OrderItem = {
    id: number;
    title: string;
    price: number;
    quantity: number;
    image: string;
};

export type Order = {
    id: string;
    date: string;
    items: OrderItem[];
    total: number;
    status: string;
};

type OrderState = {
    orders: Order[];
    loading: boolean;
    fetchOrders: () => Promise<void>;
    addOrder: (order: Order) => Promise<void>;
    clearOrders: () => void;
};

// 👇 type for raw API data (so we don’t use `any`)
type RawOrder = {
    _id?: string;
    id?: string;
    createdAt?: string;
    total?: number;
    subtotal?: number;
    shipping?: number;
    status?: string;
    items?: {
        productId?: number | string;
        id?: number | string;
        title?: string;
        price?: number;
        qty?: number;
        quantity?: number;
        image?: string;
    }[];
};

export const useOrders = create<OrderState>((set, get) => ({
    orders: [],
    loading: false,

    fetchOrders: async () => {
        set({ loading: true });
        try {
            const token = await auth.currentUser?.getIdToken();
            if (!token) {
                set({ orders: [], loading: false });
                return;
            }

            const res = await fetch("/api/orders", {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!res.ok) {
                console.error("Failed to fetch orders", await res.text());
                set({ orders: [], loading: false });
                return;
            }

            const data: unknown = await res.json();

            const raw: RawOrder[] = Array.isArray(data)
                ? data
                : Array.isArray((data as { orders?: RawOrder[] })?.orders)
                    ? (data as { orders: RawOrder[] }).orders
                    : [];

            const mapped: Order[] = raw.map((o) => ({
                id: String(o._id ?? o.id ?? ""),
                date: o.createdAt
                    ? new Date(o.createdAt).toLocaleString()
                    : "",
                total:
                    typeof o.total === "number"
                        ? o.total
                        : (o.subtotal ?? 0) + (o.shipping ?? 0),
                status: o.status ?? "UNKNOWN",
                items: Array.isArray(o.items)
                    ? o.items.map((it) => ({
                        id:
                            typeof it.productId === "number"
                                ? it.productId
                                : Number(it.productId ?? it.id ?? 0),
                        title: it.title ?? "",
                        price: typeof it.price === "number" ? it.price : 0,
                        quantity:
                            typeof it.qty === "number"
                                ? it.qty
                                : (it.quantity ?? 0),
                        image: it.image ?? "",
                    }))
                    : [],
            }));

            set({ orders: mapped, loading: false });
        } catch (err) {
            console.error("fetchOrders error", err);
            set({ orders: [], loading: false });
        }
    },

    addOrder: async (order) => {
        const token = await auth.currentUser?.getIdToken();
        if (!token) return;

        const res = await fetch("/api/orders", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(order),
        });

        if (res.ok) {
            await get().fetchOrders();
        } else {
            console.error("addOrder failed:", await res.text());
        }
    },

    clearOrders: () => set({ orders: [] }),
}));
