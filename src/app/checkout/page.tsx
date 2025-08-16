"use client";

import { useRouter } from "next/navigation";
import { useCart } from "@/store/useCart";
import { useAuth } from "@/context/AuthContext";
import { auth } from "@/lib/firebaseClient";
import { useOrders } from "@/store/useOrders"; // 👈 import store

export default function CheckoutPage() {
    const { items, subtotal, clear } = useCart();
    const { user } = useAuth();
    const router = useRouter();
    const addOrder = useOrders((s) => s.addOrder); // 👈 addOrder fn

    async function placeOrder(formData: FormData) {
        if (!user) {
            alert("Please login first");
            return;
        }
        if (items.length === 0) {
            alert("Cart is empty");
            return;
        }

        const shippingInfo = {
            fullName: String(formData.get("fullName")),
            address1: String(formData.get("address1")),
            city: String(formData.get("city")),
            country: String(formData.get("country")),
            zip: String(formData.get("zip")),
            phone: String(formData.get("phone") || ""),
        };
        const shipping = 10;
        const sub = subtotal();

        const token = await auth.currentUser?.getIdToken();
        const res = await fetch("/api/orders", {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({ items, shippingInfo, subtotal: sub, shipping }),
        });

        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            alert(err?.message || "Failed to place order");
            return;
        }

        const data = await res.json();

        // ✅ Save in Zustand store as well
        addOrder({
            id: data.orderId,
            date: new Date().toISOString(),
            items: items.map((i) => ({
                id: i.id,
                title: i.title,
                price: i.price,
                quantity: i.quantity ?? i.qty ?? 1,  // 👈 normalize qty → quantity
                image: i.image ?? "/placeholder.png", // 👈 fallback if undefined
            })),
            total: sub + shipping,
        });

        return (
            <div className="max-w-xl mx-auto bg-white shadow-sm border border-gray-200 rounded-lg p-6">
                <h1 className="text-2xl font-semibold mb-6 text-gray-800">Checkout</h1>
                <form action={placeOrder} className="space-y-4">
                    {/* ...inputs stay the same... */}
                    <button
                        type="submit"
                        className="w-full mt-4 px-4 py-2 rounded-md text-white bg-purple-600 hover:bg-purple-700 transition-colors"
                    >
                        Simulate Payment &amp; Place Order
                    </button>
                </form>
            </div>
        );
    }
