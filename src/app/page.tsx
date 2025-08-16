"use client";

import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

import ProductList from "@/components/ProductList";
import SearchBar from "@/components/SearchBar";
import SidebarFilters from "@/components/SidebarFilters";
import type { Product } from "@/types";

const BASE = process.env.NEXT_PUBLIC_DUMMYJSON_BASE_URL || "https://dummyjson.com";

// Category cards with Unsplash images
const categories = [
  { title: "Electronics", image: "https://source.unsplash.com/400x300/?electronics", link: "?category=smartphones" },
  { title: "Fashion", image: "https://source.unsplash.com/400x300/?fashion", link: "?category=mens-shirts" },
  { title: "Home & Living", image: "https://source.unsplash.com/400x300/?home", link: "?category=home-decoration" },
  { title: "Sports", image: "https://source.unsplash.com/400x300/?sports", link: "?category=sports-accessories" },
];

async function getProducts(
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

  // Filter by price locally
  if (minPrice) {
    products = products.filter((p) => p.price >= Number(minPrice));
  }
  if (maxPrice) {
    products = products.filter((p) => p.price <= Number(maxPrice));
  }

  // Sorting
  if (sort === "price-asc") {
    products = products.sort((a, b) => a.price - b.price);
  } else if (sort === "price-desc") {
    products = products.sort((a, b) => b.price - a.price);
  }

  return products;
}

export default function HomePage({
  searchParams,
}: {
  searchParams: { q?: string; category?: string; minPrice?: string; maxPrice?: string; sort?: string };
}) {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    getProducts(
      searchParams.q ?? null,
      searchParams.category ?? null,
      searchParams.minPrice ?? null,
      searchParams.maxPrice ?? null,
      searchParams.sort ?? null
    ).then(setProducts);
  }, [searchParams]);

  return (
    <div className="space-y-10">
      {/* HERO SLIDER */}
      <section className="relative rounded-xl overflow-hidden shadow-lg">
        <Swiper
          modules={[Autoplay, Pagination]}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          loop
          className="w-full h-[400px]"
        >
          <SwiperSlide>
            <img
              src="https://source.unsplash.com/1600x400/?shopping"
              alt="Shopping banner"
              className="w-full h-full object-cover"
            />
          </SwiperSlide>
          <SwiperSlide>
            <img
              src="https://source.unsplash.com/1600x400/?sale"
              alt="Sale banner"
              className="w-full h-full object-cover"
            />
          </SwiperSlide>
          <SwiperSlide>
            <img
              src="https://source.unsplash.com/1600x400/?fashion"
              alt="Fashion banner"
              className="w-full h-full object-cover"
            />
          </SwiperSlide>
        </Swiper>
      </section>

      {/* CATEGORY CARDS */}
      <section className="max-w-6xl mx-auto px-4">
        <h2 className="text-2xl font-bold mb-4">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <a
              key={cat.title}
              href={cat.link}
              className="relative group rounded-lg overflow-hidden shadow hover:shadow-lg transition"
            >
              <img
                src={cat.image}
                alt={cat.title}
                className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-white font-semibold text-lg">{cat.title}</span>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* MAIN CONTENT */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 max-w-6xl mx-auto px-4" id="products">
        <div className="md:col-span-3">
          <SidebarFilters />
        </div>
        <div className="md:col-span-9 space-y-4">
          {/* Mobile-only sticky SearchBar */}
          <div className="block md:hidden sticky top-0 z-20 bg-white py-2 shadow-sm">
            <SearchBar />
          </div>

          {/* Desktop-only SearchBar */}
          <div className="hidden md:block">
            <SearchBar />
          </div>

          <ProductList products={products} />
        </div>
      </div>
    </div>
  );
}
