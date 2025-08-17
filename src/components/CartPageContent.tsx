// src/components/CartPageContent.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/store/useCart";

export default function CartPageContent() {
    const { items, updateQty, remove, subtotal } = useCart();

    return (
        <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-3">
                <h1 className="text-xl font-semibold">Your Cart</h1>
                {items.length === 0 && <p>Your cart is empty.</p>}
                {items.map((i) => (
                    <div
                        key={i.id}
                        className="flex items-center gap-3 border border-gray-200 rounded p-3 bg-white shadow-sm"
                    >
                        <div className="relative w-16 h-16 rounded overflow-hidden">
                            <Image
                                src={i.image || "/placeholder.png"}
                                alt={i.title}
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="flex-1">
                            <p className="font-medium">{i.title}</p>
                            <p className="text-sm text-gray-600">${i.price.toFixed(2)}</p>
                            <div className="mt-2 flex items-center gap-2">
                                <input
                                    type="number"
                                    min={1}
                                    value={i.qty}
                                    onChange={(e) =>
                                        updateQty(i.id, Number(e.target.value))
                                    }
                                    className="w-16 border border-gray-300 rounded px-2 py-1"
                                />
                                <button
                                    className="text-sm text-red-500 hover:underline"
                                    onClick={() => remove(i.id)}
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                        <div className="font-semibold">
                            ${(i.price * i.qty).toFixed(2)}
                        </div>
                    </div>
                ))}
            </div>

            <div className="border border-gray-200 rounded p-4 h-fit bg-white shadow-sm">
                <h2 className="font-semibold">Order Summary</h2>
                <div className="mt-2 flex justify-between">
                    <span>Subtotal</span>
                    <span>${subtotal().toFixed(2)}</span>
                </div>
                <div className="mt-2 flex justify-between">
                    <span>Shipping</span>
                    <span>$10.00</span>
                </div>
                <div className="mt-2 pt-2 border-t flex justify-between font-semibold">
                    <span>Total</span>
                    <span>${(subtotal() + 10).toFixed(2)}</span>
                </div>
                <Link
                    href="/checkout"
                    className={`mt-4 block w-full text-center px-4 py-2 rounded-md text-white bg-purple-600 hover:bg-purple-700 transition-colors ${items.length === 0
                        ? "pointer-events-none opacity-50"
                        : ""
                        }`}
                >
                    Proceed to Checkout
                </Link>
            </div>
        </div>
    );
}