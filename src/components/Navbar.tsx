"use client";

import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/store/useCart";
import { useProfile } from "@/store/useProfile";
import SearchBar from "./SearchBar";
import CartBadge from "./CartBadge";
import Link from "next/link";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebaseClient";
import {
    ShoppingCartIcon,
    Bars3Icon,
    XMarkIcon,
    HeartIcon,
} from "@heroicons/react/24/outline";
import { useState, useRef, useEffect, Suspense } from "react";

// Loading component for SearchBar
function SearchBarLoading() {
    return (
        <div className="w-64 h-10 bg-purple-400 rounded animate-pulse"></div>
    );
}

export default function Navbar() {
    const { user } = useAuth();
    const cartCount = useCart((s) => s.count()); // ✅ Fixed: renamed 'count' to 'cartCount' to use it
    const { profile } = useProfile();
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setMenuOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <header className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white sticky top-0 z-30 shadow-md">
            <nav className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">

                {/* Left: Logo */}
                <Link
                    href="/"
                    className="font-bold text-xl hover:text-purple-100 transition-colors"
                >
                    MINI-SHOP
                </Link>

                {/* Right: Search + Buttons */}
                <div className="flex items-center gap-4">
                    {/* Desktop-only SearchBar wrapped in Suspense */}
                    <div className="hidden sm:block w-64">
                        <Suspense fallback={<SearchBarLoading />}>
                            <SearchBar />
                        </Suspense>
                    </div>

                    {/* Cart */}
                    <Link
                        href="/cart"
                        className="relative hover:text-purple-100 transition-colors"
                        title={`Cart (${cartCount} items)`} // ✅ Fixed: now using cartCount
                    >
                        <ShoppingCartIcon className="w-6 h-6" />
                        <CartBadge />
                    </Link>

                    {/* Auth */}
                    {!user ? (
                        <>
                            <Link
                                href="/login"
                                className="hover:text-purple-100 transition-colors"
                            >
                                Login
                            </Link>
                            <Link
                                href="/signup"
                                className="hover:text-purple-100 transition-colors"
                            >
                                Sign-up
                            </Link>
                        </>
                    ) : (
                        <div className="flex items-center gap-3" ref={menuRef}>
                            {/* ✅ Avatar goes directly to Profile */}
                            <Link href="/profile">
                                <div className="w-8 h-8 rounded-full border border-white bg-purple-600 overflow-hidden flex items-center justify-center">
                                    {profile?.photo ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img
                                            src={profile.photo}
                                            alt="avatar"
                                            className="w-8 h-8 rounded-full object-cover"
                                        />
                                    ) : (
                                        <span>
                                            {(profile?.name ||
                                                user.displayName ||
                                                user.email ||
                                                "U")[0].toUpperCase()}
                                        </span>
                                    )}
                                </div>
                            </Link>

                            {/* ✅ Hamburger toggles dropdown */}
                            <button
                                className="hover:text-purple-100 transition-colors"
                                onClick={() => setMenuOpen(!menuOpen)}
                            >
                                {menuOpen ? (
                                    <XMarkIcon className="w-6 h-6" />
                                ) : (
                                    <Bars3Icon className="w-6 h-6" />
                                )}
                            </button>

                            {/* Dropdown Menu */}
                            {menuOpen && (
                                <div className="absolute right-0 top-14 w-44 bg-white text-gray-800 rounded-md shadow-lg z-20">
                                    <Link
                                        href="/wishlist"
                                        className="block px-4 py-2 hover:bg-purple-50 flex items-center gap-2"
                                        onClick={() => setMenuOpen(false)}
                                    >
                                        <HeartIcon className="w-5 h-5 text-purple-600" />
                                        Wishlist
                                    </Link>
                                    <Link
                                        href="/orders"
                                        className="block px-4 py-2 hover:bg-purple-50"
                                        onClick={() => setMenuOpen(false)}
                                    >
                                        Order History
                                    </Link>
                                    <button
                                        className="w-full text-left px-4 py-2 hover:bg-purple-50"
                                        onClick={() => {
                                            signOut(auth);
                                            setMenuOpen(false);
                                        }}
                                    >
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </nav>
        </header>
    );
}