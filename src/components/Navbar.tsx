"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebaseClient";
import { useCart } from "@/store/useCart";
import SearchBar from "./SearchBar";
import { ShoppingCartIcon, Bars3Icon, XMarkIcon, HeartIcon } from "@heroicons/react/24/outline";
import CartBadge from "./CartBadge";

export default function Navbar() {
    const { user } = useAuth();
    const count = useCart((s) => s.count());
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside (desktop only)
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
        <header className="bg-purple-700 text-white sticky top-0 z-30 shadow-md">
            <nav className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">

                {/* Left: Logo */}
                <Link
                    href="/"
                    className="font-bold text-xl hover:text-purple-200 transition-colors"
                >
                    MiniShop
                </Link>

                {/* Right: Search + Buttons */}
                <div className="flex items-center gap-4">
                    {/* Desktop-only SearchBar */}
                    <div className="hidden sm:block w-64">
                        <SearchBar />
                    </div>

                    {/* Cart */}
                    <Link
                        href="/cart"
                        className="relative hover:text-purple-200 transition-colors"
                    >
                        <ShoppingCartIcon className="w-6 h-6" />
                        <CartBadge />

                    </Link>

                    {/* Auth */}
                    {!user ? (
                        <>
                            <Link href="/login" className="hover:text-purple-200 transition-colors">Login</Link>
                            <Link href="/signup" className="hover:text-purple-200 transition-colors">Sign-up</Link>
                        </>
                    ) : (
                        <div className="relative" ref={menuRef}>
                            <button
                                className="flex items-center gap-2 hover:text-purple-200 transition-colors"
                                onClick={() => setMenuOpen(!menuOpen)}
                            >
                                {/* Avatar */}
                                <div className="w-8 h-8 rounded-full border border-white flex items-center justify-center bg-purple-600 overflow-hidden">
                                    {user.photoURL ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img
                                            src={user.photoURL}
                                            alt="avatar"
                                            className="w-8 h-8 rounded-full"
                                        />
                                    ) : (
                                        <span>
                                            {(user.displayName || user.email || "U")[0].toUpperCase()}
                                        </span>
                                    )}
                                </div>

                                {/* Hamburger / Close */}
                                {menuOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
                            </button>

                            {/* Mobile full-screen sheet */}
                            {menuOpen && (
                                <div className="sm:hidden">
                                    {/* Background overlay */}
                                    <div
                                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
                                        onClick={() => setMenuOpen(false)}
                                    />

                                    {/* Menu sheet */}
                                    <div
                                        className={`
                                            fixed top-0 left-0 right-0 bg-white text-gray-800 z-50 shadow-lg
                                            transform transition-transform duration-300 ease-in-out
                                            ${menuOpen ? "translate-y-0" : "-translate-y-full"}
                                        `}
                                    >
                                        <div className="flex items-center justify-between px-4 py-3 border-b">
                                            <span className="font-semibold">Menu</span>
                                            <button onClick={() => setMenuOpen(false)} className="p-2">
                                                <XMarkIcon className="w-6 h-6" />
                                            </button>
                                        </div>
                                        <div className="flex flex-col">
                                            <Link
                                                href="/profile"
                                                className="px-4 py-3 hover:bg-purple-50"
                                                onClick={() => setMenuOpen(false)}
                                            >
                                                Profile
                                            </Link>
                                            <Link
                                                href="/wishlist"
                                                className="px-4 py-3 hover:bg-purple-50 flex items-center gap-2"
                                                onClick={() => setMenuOpen(false)}
                                            >
                                                <HeartIcon className="w-5 h-5 text-purple-600" />
                                                Wishlist
                                            </Link>
                                            <Link
                                                href="/orders"
                                                className="px-4 py-3 hover:bg-purple-50"
                                                onClick={() => setMenuOpen(false)}
                                            >
                                                Order History
                                            </Link>
                                            <button
                                                className="w-full text-left px-4 py-3 hover:bg-purple-50"
                                                onClick={() => {
                                                    signOut(auth);
                                                    setMenuOpen(false);
                                                }}
                                            >
                                                Logout
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Desktop dropdown */}
                            <div
                                className={`
                                    absolute right-0 mt-2 w-44 bg-white text-gray-800 rounded-md shadow-lg overflow-hidden z-20 hidden sm:block
                                    transform transition-all duration-200 ease-out
                                    ${menuOpen
                                        ? "opacity-100 scale-100 translate-y-0"
                                        : "opacity-0 scale-95 -translate-y-2 pointer-events-none"}
                                `}
                            >
                                <Link href="/profile" className="block px-4 py-2 hover:bg-purple-50" onClick={() => setMenuOpen(false)}>Profile</Link>
                                <Link href="/wishlist" className="block px-4 py-2 hover:bg-purple-50" onClick={() => setMenuOpen(false)}>Wishlist</Link>
                                <Link href="/orders" className="block px-4 py-2 hover:bg-purple-50" onClick={() => setMenuOpen(false)}>Order History</Link>
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
                        </div>
                    )}
                </div>
            </nav>
        </header>
    );
}
