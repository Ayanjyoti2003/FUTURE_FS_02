import Image from "next/image";
import { notFound } from "next/navigation";
import { useCart } from "@/store/useCart";
import type { Product } from "@/types";
import { Suspense } from "react";
import AddToCart from "@/components/AddToCart";

const BASE = process.env.DUMMYJSON_BASE_URL || "https://dummyjson.com";

async function getProduct(id: string): Promise<Product | null> {
    const res = await fetch(`${BASE}/products/${id}`, { next: { revalidate: 120 } });
    if (!res.ok) return null;
    return res.json();
}

export default async function ProductPage({ params }: { params: { id: string } }) {
    const product = await getProduct(params.id);
    if (!product) return notFound();

    return (
        <div className="grid md:grid-cols-2 gap-6">
            <div className="relative w-full h-80 md:h-[28rem]">
                <Image
                    src={product.images?.[0] || product.thumbnail || "/placeholder.png"}
                    alt={product.title}
                    fill
                    className="object-cover rounded"
                />
            </div>
            <div>
                <h1 className="text-2xl font-semibold">{product.title}</h1>
                <p className="text-sm text-gray-600 mt-1">{product.brand} • {product.category}</p>
                <p className="mt-4">{product.description}</p>
                <div className="mt-6 flex items-center gap-4">
                    <span className="text-2xl font-bold">${product.price}</span>
                    <AddToCart id={product.id} title={product.title} price={product.price} image={product.thumbnail} />
                </div>
            </div>
        </div>
    );
}

