import type { Metadata } from "next";
import "./globals.css";
import { Suspense } from "react";
import Navbar from "@/components/Navbar";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";

export const metadata: Metadata = {
  title: "MiniShop",
  description: "Next.js + Firebase + Mongo"
};

// Loading component for navbar
function NavbarLoading() {
  return (
    <header className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white sticky top-0 z-30 shadow-md">
      <nav className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <div className="font-bold text-xl">MINI-SHOP</div>
        <div className="flex items-center gap-4">
          <div className="hidden sm:block w-64 h-10 bg-purple-400 rounded animate-pulse"></div>
          <div className="w-6 h-6 bg-purple-400 rounded animate-pulse"></div>
          <div className="w-12 h-6 bg-purple-400 rounded animate-pulse"></div>
        </div>
      </nav>
    </header>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50">
        <AuthProvider>
          <CartProvider>
            <Suspense fallback={<NavbarLoading />}>
              <Navbar />
            </Suspense>
            <main className="mx-auto max-w-6xl px-4 py-6">
              {children}
            </main>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}