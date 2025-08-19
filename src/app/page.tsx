import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import ProductList from "@/components/ProductList";
import MobileSearchBar from "@/components/MobileSearchBar";
import type { Product } from "@/types";

// Import category images
import electronics from "@/assets/electronics.jpeg";
import fashion from "@/assets/fashion.jpeg";
import home from "@/assets/home.jpeg";
import sports from "@/assets/sports.jpeg";

const BASE = process.env.NEXT_PUBLIC_DUMMYJSON_BASE_URL || "https://dummyjson.com";

async function getProducts(): Promise<Product[]> {
  const res = await fetch(`${BASE}/products?limit=20`, {
    next: { revalidate: 3600 } // Cache for 1 hour
  });
  if (!res.ok) return [];
  const data = await res.json();
  return data.products || [];
}

// Loading component
function HomeLoading() {
  return (
    <div className="space-y-6">
      <MobileSearchBar />

      {/* Hero Section Loading */}
      <div className="px-4 lg:px-0">
        <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl p-6 md:p-8 text-white animate-pulse">
          <div className="h-8 bg-purple-400 rounded mb-4 max-w-md"></div>
          <div className="h-4 bg-purple-400 rounded mb-6 max-w-lg"></div>
          <div className="h-10 bg-purple-400 rounded max-w-xs"></div>
        </div>
      </div>

      {/* Products Loading */}
      <div className="px-4 lg:px-0">
        <div className="h-8 bg-gray-200 rounded mb-6 max-w-xs animate-pulse"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow p-4 animate-pulse">
              <div className="h-48 bg-gray-200 rounded mb-4"></div>
              <div className="h-6 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-8 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default async function HomePage() {
  const products = await getProducts();

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Mobile Search Bar */}
      <MobileSearchBar />

      {/* Hero Section */}
      <div className="px-4 lg:px-0">
        <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl p-6 md:p-8 lg:p-12 text-white">
          <div className="max-w-2xl">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
              Welcome to MiniShop
            </h1>
            <p className="text-purple-100 mb-6 text-sm md:text-base">
              Discover amazing products at unbeatable prices. From beauty essentials to luxury watches,
              we have everything you need.
            </p>
            <Link
              href="/product"
              className="inline-block bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-purple-50 transition-colors duration-200"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </div>

      {/* Categories Section - Moved above Featured Products */}
      <div className="px-4 lg:px-0">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6">
          Shop by Category
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: 'Electronics', image: electronics, href: '/product?category=smartphones,laptops,tablets' },
            { name: 'Fashion', image: fashion, href: '/product?category=mens-shirts,mens-shoes,womens-dresses,womens-shoes' },
            { name: 'Home & Living', image: home, href: '/product?category=home-decoration,furniture,kitchen-accessories' },
            { name: 'Sports', image: sports, href: '/product?category=sports-accessories' }
          ].map((category) => (
            <Link
              key={category.name}
              href={category.href}
              className="relative group rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 bg-white"
            >
              <div className="relative h-32 md:h-40">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors duration-200"></div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white font-semibold text-sm md:text-lg text-center px-2">
                  {category.name}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Featured Products - Moved below Categories */}
      <div className="px-4 lg:px-0">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-gray-800">
            Featured Products
          </h2>
          <Link
            href="/product"
            className="text-purple-600 hover:text-purple-700 font-medium text-sm md:text-base"
          >
            View All →
          </Link>
        </div>

        <Suspense fallback={<HomeLoading />}>
          <ProductList products={products} />
        </Suspense>
      </div>
    </div>
  );
}