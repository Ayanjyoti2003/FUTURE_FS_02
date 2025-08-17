import Link from 'next/link';
import { HeartIcon, ShoppingBagIcon, UserIcon } from '@heroicons/react/24/outline';

export default function Footer() {
    return (
        <footer className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white mt-16">
            <div className="max-w-6xl mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

                    {/* Brand Section */}
                    <div className="md:col-span-1">
                        <h3 className="text-2xl font-bold mb-4">MINI-SHOP</h3>
                        <p className="text-purple-100 mb-4">
                            Your one-stop destination for quality products at amazing prices.
                        </p>
                        <div className="flex space-x-4">
                            <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center hover:bg-purple-400 transition-colors cursor-pointer">
                                <span className="text-sm font-bold">f</span>
                            </div>
                            <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center hover:bg-purple-400 transition-colors cursor-pointer">
                                <span className="text-sm font-bold">t</span>
                            </div>
                            <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center hover:bg-purple-400 transition-colors cursor-pointer">
                                <span className="text-sm font-bold">in</span>
                            </div>
                        </div>
                    </div>

                    {/* Shop Links */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4">Shop</h4>
                        <ul className="space-y-2 text-purple-100">
                            <li><Link href="/product" className="hover:text-white transition-colors">All Products</Link></li>
                            <li><Link href="/product?category=beauty" className="hover:text-white transition-colors">Beauty</Link></li>
                            <li><Link href="/product?category=electronics" className="hover:text-white transition-colors">Electronics</Link></li>
                            <li><Link href="/product?category=furniture" className="hover:text-white transition-colors">Furniture</Link></li>
                            <li><Link href="/product?category=groceries" className="hover:text-white transition-colors">Groceries</Link></li>
                        </ul>
                    </div>

                    {/* Account Links */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4">Account</h4>
                        <ul className="space-y-2 text-purple-100">
                            <li>
                                <Link href="/profile" className="hover:text-white transition-colors flex items-center gap-2">
                                    <UserIcon className="w-4 h-4" />
                                    My Profile
                                </Link>
                            </li>
                            <li>
                                <Link href="/orders" className="hover:text-white transition-colors flex items-center gap-2">
                                    <ShoppingBagIcon className="w-4 h-4" />
                                    Order History
                                </Link>
                            </li>
                            <li>
                                <Link href="/wishlist" className="hover:text-white transition-colors flex items-center gap-2">
                                    <HeartIcon className="w-4 h-4" />
                                    Wishlist
                                </Link>
                            </li>
                            <li><Link href="/cart" className="hover:text-white transition-colors">Shopping Cart</Link></li>
                        </ul>
                    </div>

                    {/* Support Links */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4">Support</h4>
                        <ul className="space-y-2 text-purple-100">
                            <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
                            <li><Link href="/shipping" className="hover:text-white transition-colors">Shipping Info</Link></li>
                            <li><Link href="/returns" className="hover:text-white transition-colors">Returns</Link></li>
                            <li><Link href="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
                            <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-purple-500 mt-8 pt-8 text-center text-purple-100">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <p>&copy; 2025 MiniShop. All rights reserved. Built with ❤️ for learning.</p>
                        <div className="flex space-x-4 mt-4 md:mt-0">
                            <span className="text-sm">Demo Project</span>
                            <span className="text-sm">•</span>
                            <span className="text-sm">Portfolio Showcase</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}