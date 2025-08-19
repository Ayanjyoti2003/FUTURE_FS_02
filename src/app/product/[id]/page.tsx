import Image from "next/image";
import { notFound } from "next/navigation";
import type { Product } from "@/types";
import AddToCart from "@/components/AddToCart";

const BASE = process.env.DUMMYJSON_BASE_URL || "https://dummyjson.com";

async function getProduct(id: string): Promise<Product | null> {
    const res = await fetch(`${BASE}/products/${id}`, { next: { revalidate: 120 } });
    if (!res.ok) return null;
    const data: Product = await res.json();
    return data;
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
    // Await the params Promise to get the actual params object
    const { id } = await params;

    const product = await getProduct(id);
    if (!product) return notFound();

    return (
        <div className="min-h-screen">
            <div className="max-w-7xl mx-auto px-4 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12">
                    {/* Product Image - Mobile optimized */}
                    <div className="relative w-full h-72 sm:h-80 lg:h-[32rem] bg-gray-100 rounded-lg overflow-hidden">
                        <Image
                            src={product.images?.[0] || product.thumbnail || "/placeholder.png"}
                            alt={product.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 50vw"
                            priority
                        />
                    </div>

                    {/* Product Details - Mobile optimized */}
                    <div className="space-y-6">
                        {/* Title and Brand */}
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
                                {product.title}
                            </h1>
                            <p className="text-sm text-gray-600 mt-2">
                                <span className="font-medium">{product.brand}</span> • {product.category}
                            </p>
                        </div>

                        {/* Price */}
                        <div className="text-3xl font-bold text-green-600">
                            ${product.price}
                        </div>

                        {/* Description */}
                        <div className="prose prose-sm sm:prose-base max-w-none">
                            <p className="text-gray-700 leading-relaxed">
                                {product.description}
                            </p>
                        </div>

                        {/* Add to Cart - Mobile optimized */}
                        <div className="pt-4">
                            <AddToCart
                                id={product.id}
                                title={product.title}
                                price={product.price}
                                image={product.thumbnail}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}