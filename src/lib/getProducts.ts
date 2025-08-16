// lib/getProducts.ts
import type { Product } from "@/types";

const BASE = process.env.NEXT_PUBLIC_DUMMYJSON_BASE_URL || "https://dummyjson.com";

export async function getProducts(
    q: string | null,
    category: string | null,
    minPrice: string | null,
    maxPrice: string | null,
    sort: string | null
): Promise<Product[]> {
    const params = new URLSearchParams();
    if (q) params.set("q", q);

    let products: Product[] = [];

    if (category) {
        const res = await fetch(`${BASE}/products/category/${encodeURIComponent(category)}`);
        const data = await res.json();
        products = data.products || [];
    } else if (q) {
        const res = await fetch(`${BASE}/products/search?${params.toString()}`);
        const data = await res.json();
        products = data.products || [];
    } else {
        const res = await fetch(`${BASE}/products?limit=100`);
        const data = await res.json();
        products = data.products || [];
    }

    // Filter
    if (minPrice) {
        products = products.filter((p) => p.price >= Number(minPrice));
    }
    if (maxPrice) {
        products = products.filter((p) => p.price <= Number(maxPrice));
    }

    // Sort
    if (sort === "price-asc") {
        products = products.sort((a, b) => a.price - b.price);
    } else if (sort === "price-desc") {
        products = products.sort((a, b) => b.price - a.price);
    }

    return products;
}
