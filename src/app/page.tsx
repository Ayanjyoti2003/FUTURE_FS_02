import HeroSlider from "@/components/HeroSlider";
import ProductList from "@/components/ProductList";
import SearchBarWrapper from "@/components/SearchBarWrapper"; // ✅ Use wrapper
import SidebarFiltersWrapper from "@/components/SidebarFiltersWrapper"; // ✅ Use wrapper
import type { Product } from "@/types";
import { getProducts } from "@/lib/getProducts";
import Image from "next/image";

import sports from "@/assets/sports.jpeg";
import fashion from "@/assets/fashion.jpeg";
import home from "@/assets/home.jpeg";
import electronics from "@/assets/electronics.jpeg";

const categories = [
  { title: "Electronics", image: electronics, link: "?category=smartphones" },
  { title: "Fashion", image: fashion, link: "?category=mens-shirts" },
  { title: "Home & Living", image: home, link: "?category=home-decoration" },
  { title: "Sports", image: sports, link: "?category=sports-accessories" },
];

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string; minPrice?: string; maxPrice?: string; sort?: string }>;
}) {
  // Await the searchParams Promise to get the actual search parameters
  const params = await searchParams;

  const products: Product[] = await getProducts(
    params.q ?? null,
    params.category ?? null,
    params.minPrice ?? null,
    params.maxPrice ?? null,
    params.sort ?? null
  );

  return (
    <div className="space-y-10">
      {/* HERO SLIDER */}
      <HeroSlider />

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
              <Image
                src={cat.image}
                alt={cat.title}
                className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                width={400}
                height={160}
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
          <SidebarFiltersWrapper />
        </div>
        <div className="md:col-span-9 space-y-4">
          <div className="block md:hidden sticky top-0 z-20 bg-white py-2 shadow-sm">
            <SearchBarWrapper />
          </div>
          <div className="hidden md:block">
            <SearchBarWrapper />
          </div>
          <ProductList products={products} />
        </div>
      </div>
    </div>
  );
}