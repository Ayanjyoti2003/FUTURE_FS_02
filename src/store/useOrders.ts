// src/store/useOrder.ts
"use client";

import { create } from "zustand";
import { auth } from "@/lib/firebaseClient";

export type Order = {
    id: string;
    date: string;
    items: {
        id: number;
        title: string;
        price: number;
        quantity: number;
        image: string;
    }[];
    total: number;
};

type OrderState = {
    orders: Order[];
    loading: boolean;
    fetchOrders: () => Promise<void>;
    // NOTE: your API expects { items, shippingInfo } for POST, not this Order shape.
    // Keep addOrder here if you use it elsewhere; otherwise adapt it later.
    addOrder: (order: Order) => Promise<void>;
    clearOrders: () => void;
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

            const data = await res.json();

            // Accept both shapes: an array OR { orders: [...] }
            const raw: any[] = Array.isArray(data)
                ? data
                : Array.isArray(data?.orders)
                    ? data.orders
                    : [];

            // Map MongoDB docs -> UI shape
            const mapped: Order[] = raw.map((o: any) => {
                // o example from DB:
                // {
                //   _id, userUid, items:[{productId,title,price,image,qty,lineTotal}],
                //   subtotal, shipping, total, status, createdAt
                // }
                return {
                    id: String(o._id ?? o.id ?? ""),
                    date: o.createdAt ? new Date(o.createdAt).toLocaleDateString() : "",
                    total: typeof o.total === "number" ? o.total : (o.subtotal ?? 0) + (o.shipping ?? 0),
                    items: Array.isArray(o.items)
                        ? o.items.map((it: any) => ({
                            id: typeof it.productId === "number" ? it.productId : Number(it.productId ?? it.id ?? 0),
                            title: it.title ?? "",
                            price: typeof it.price === "number" ? it.price : 0,
                            quantity: typeof it.qty === "number" ? it.qty : (it.quantity ?? 0),
                            image: it.image ?? "",
                        }))
                        : [],
                };
            });
            console.log("Fetched orders:", mapped);

            set({ orders: mapped, loading: false });
        } catch (err) {
            console.error("fetchOrders error", err);
            set({ orders: [], loading: false });
        }
    },

    // Your API /api/orders POST expects { items, shippingInfo }.
    // If you’re not using addOrder from here, you can leave it or adapt later.
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
