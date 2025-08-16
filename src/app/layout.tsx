import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext"; // ✅ import cart provider

export const metadata: Metadata = {
  title: "MiniShop",
  description: "Next.js + Firebase + Mongo"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50">
        <AuthProvider>
          <CartProvider> {/* ✅ wrap inside AuthProvider */}
            <Navbar />
            <main className="mx-auto max-w-6xl px-4 py-6">
              {children}
            </main>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
