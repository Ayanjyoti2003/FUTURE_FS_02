import { Suspense } from "react";
import ProductList from "@/components/ProductList";
import MobileSearchBar from "@/components/MobileSearchBar";
import type { Product } from "@/types";

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
            <a
              href="/product"
              className="inline-block bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-purple-50 transition-colors duration-200"
            >
              Shop Now
            </a>
          </div>
        </div>
      </div>

      {/* Featured Products */}
      <div className="px-4 lg:px-0">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-gray-800">
            Featured Products
          </h2>
          <a
            href="/product"
            className="text-purple-600 hover:text-purple-700 font-medium text-sm md:text-base"
          >
            View All →
          </a>
        </div>

        <Suspense fallback={<HomeLoading />}>
          <ProductList products={products} />
        </Suspense>
      </div>

      {/* Categories Section */}
      <div className="px-4 lg:px-0">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6">
          Shop by Category
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: 'Beauty', emoji: '💄', href: '/product?category=beauty' },
            { name: 'Electronics', emoji: '📱', href: '/product?category=electronics' },
            { name: 'Furniture', emoji: '🛋️', href: '/product?category=furniture' },
            { name: 'Groceries', emoji: '🛒', href: '/product?category=groceries' }
          ].map((category) => (
            <a
              key={category.name}
              href={category.href}
              className="bg-white rounded-lg p-4 md:p-6 text-center shadow-sm hover:shadow-md transition-shadow duration-200 border"
            >
              <div className="text-2xl md:text-3xl mb-2">{category.emoji}</div>
              <div className="font-semibold text-gray-800 text-sm md:text-base">
                {category.name}
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}