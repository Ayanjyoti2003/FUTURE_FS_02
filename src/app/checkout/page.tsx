// app/checkout/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { useState, useMemo } from "react";
import { useCart } from "@/store/useCart";
import { useAuth } from "@/context/AuthContext";
import { auth } from "@/lib/firebaseClient";
import { useOrders } from "@/store/useOrders";
import type { CartItem } from "@/types";

type ShippingInfo = {
    fullName: string;
    address1: string;
    city: string;
    country: string;
    zip: string;
    phone: string;
};

export default function CheckoutPage() {
    const router = useRouter();
    const { user } = useAuth();
    const { items, subtotal, clear } = useCart();
    const { fetchOrders } = useOrders();

    const [submitting, setSubmitting] = useState(false);

    const shipping = 10;
    const sub = subtotal();
    const total = useMemo(() => sub + shipping, [sub]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!user) {
            alert("Please login first.");
            router.push("/login?next=/checkout");
            return;
        }
        if (items.length === 0) {
            alert("Your cart is empty.");
            router.push("/cart");
            return;
        }

        const fd = new FormData(e.currentTarget);
        const shippingInfo: ShippingInfo = {
            fullName: String(fd.get("fullName") || ""),
            address1: String(fd.get("address1") || ""),
            city: String(fd.get("city") || ""),
            country: String(fd.get("country") || ""),
            zip: String(fd.get("zip") || ""),
            phone: String(fd.get("phone") || ""),
        };

        setSubmitting(true);
        try {
            const token = await auth.currentUser?.getIdToken();
            if (!token) throw new Error("Not authenticated");

            // API expects: { items: [{ id, title, price, image?, qty }], shippingInfo }
            const payload = {
                items: items.map((i) => ({
                    productId: i.id,
                    title: i.title,
                    price: i.price,
                    image: i.image ?? "",
                    qty: i.qty ?? 1, // normalize qty
                })),
                shippingInfo,
            };

            const res = await fetch("/api/orders", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                throw new Error(err?.error || err?.message || "Failed to place order");
            }

            clear();             // empty cart locally
            await fetchOrders();  // refresh orders list
            router.push("/orders");
        } catch (err) {
            if (err instanceof Error) {
                alert(err.message);
            } else {
                alert("Something went wrong");
            }
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6">
            <form onSubmit={handleSubmit} className="md:col-span-2 space-y-4 bg-white p-6 rounded-lg shadow border">
                <h1 className="text-2xl font-semibold">Checkout</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm text-gray-600 mb-1">Full Name</label>
                        <input name="fullName" required className="w-full border rounded px-3 py-2" />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-600 mb-1">Phone</label>
                        <input name="phone" className="w-full border rounded px-3 py-2" />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm text-gray-600 mb-1">Address</label>
                        <input name="address1" required className="w-full border rounded px-3 py-2" />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-600 mb-1">City</label>
                        <input name="city" required className="w-full border rounded px-3 py-2" />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-600 mb-1">Country</label>
                        <input name="country" required className="w-full border rounded px-3 py-2" />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-600 mb-1">ZIP</label>
                        <input name="zip" required className="w-full border rounded px-3 py-2" />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={submitting || items.length === 0}
                    className={`w-full md:w-auto px-6 py-2 rounded-md text-white bg-purple-600 hover:bg-purple-700 transition-colors ${submitting || items.length === 0 ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                >
                    {submitting ? "Placing order..." : "Simulate Payment & Place Order"}
                </button>
            </form>

            <aside className="h-fit bg-white p-6 rounded-lg shadow border">
                <h2 className="font-semibold">Order Summary</h2>
                <div className="mt-2 flex justify-between">
                    <span>Subtotal</span>
                    <span>${sub.toFixed(2)}</span>
                </div>
                <div className="mt-2 flex justify-between">
                    <span>Shipping</span>
                    <span>$10.00</span>
                </div>
                <div className="mt-2 pt-2 border-t flex justify-between font-semibold">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                </div>
            </aside>
        </div>
    );
}
