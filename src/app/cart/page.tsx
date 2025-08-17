import { Suspense } from "react";
import CartPageContent from "@/components/CartPageContent";

export default function CartPage() {
    return (
        <Suspense fallback={<CartPageFallback />}>
            <CartPageContent />
        </Suspense>
    );
}

function CartPageFallback() {
    return (
        <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-3">
                <h1 className="text-xl font-semibold">Your Cart</h1>
                <div className="animate-pulse space-y-3">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center gap-3 border border-gray-200 rounded p-3 bg-white shadow-sm">
                            <div className="w-16 h-16 bg-gray-200 rounded"></div>
                            <div className="flex-1 space-y-2">
                                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                <div className="h-8 bg-gray-200 rounded w-20"></div>
                            </div>
                            <div className="h-6 bg-gray-200 rounded w-16"></div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="border border-gray-200 rounded p-4 h-fit bg-white shadow-sm">
                <div className="animate-pulse space-y-4">
                    <div className="h-5 bg-gray-200 rounded w-32"></div>
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <div className="h-4 bg-gray-200 rounded w-16"></div>
                            <div className="h-4 bg-gray-200 rounded w-12"></div>
                        </div>
                        <div className="flex justify-between">
                            <div className="h-4 bg-gray-200 rounded w-16"></div>
                            <div className="h-4 bg-gray-200 rounded w-12"></div>
                        </div>
                    </div>
                    <div className="h-10 bg-gray-200 rounded w-full"></div>
                </div>
            </div>
        </div>
    );
}