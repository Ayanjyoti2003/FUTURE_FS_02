"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useWishlist } from "@/store/useWishlist";
import { useOrders } from "@/store/useOrders";
import { useProfile } from "@/store/useProfile";
import { CameraIcon, PencilSquareIcon } from "@heroicons/react/24/outline";

export default function ProfilePage() {
    const { user } = useAuth();

    // 🟣 Profile state from MongoDB (via store)
    const { profile, fetchProfile, updateProfile, loading: profileLoading } =
        useProfile();

    const [editing, setEditing] = useState(false);
    const [name, setName] = useState(profile?.name || user?.displayName || "");
    const [photo, setPhoto] = useState(
        profile?.photo || user?.photoURL || "/placeholder.png"
    );
    const [activeTab, setActiveTab] = useState<"wishlist" | "orders">("wishlist");

    // ✅ Always default to arrays
    const { items: wishlist = [], fetchWishlist, loading: wishlistLoading } =
        useWishlist();
    const { orders = [], fetchOrders, loading: ordersLoading } = useOrders();

    // 🔹 Fetch profile, wishlist, and orders when user logs in
    useEffect(() => {
        if (user) {
            fetchProfile();
            fetchOrders();
            fetchWishlist();
        }
    }, [user, fetchProfile, fetchOrders, fetchWishlist]);

    // 🔹 Update local UI state when profile store changes
    useEffect(() => {
        if (profile) {
            setName(profile.name || "");
            setPhoto(profile.photo || "/placeholder.png");
        }
    }, [profile]);

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = () => {
                if (reader.result) setPhoto(reader.result.toString());
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async () => {
        await updateProfile({ name, photo }); // ✅ Save to MongoDB
        setEditing(false);
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="bg-white shadow-lg rounded-xl overflow-hidden">
                {/* Gradient Header */}
                <div className="h-32 bg-gradient-to-r from-purple-500 to-indigo-600 relative">
                    <button
                        onClick={() => setEditing(!editing)}
                        className="absolute top-3 right-3 p-2 rounded-full bg-white/80 hover:bg-white shadow"
                    >
                        <PencilSquareIcon className="w-5 h-5 text-gray-700" />
                    </button>
                </div>

                {/* Avatar */}
                <div className="relative flex justify-center -mt-16">
                    <div className="w-28 h-28 rounded-full border-4 border-white shadow overflow-hidden bg-gray-100 relative">
                        <img
                            src={photo}
                            alt="Profile"
                            className="w-full h-full object-cover"
                        />
                        {editing && (
                            <label className="absolute inset-0 bg-black/50 flex items-center justify-center cursor-pointer">
                                <CameraIcon className="w-8 h-8 text-white" />
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handlePhotoChange}
                                />
                            </label>
                        )}
                    </div>
                </div>

                {/* Profile Info */}
                <div className="p-6 text-center">
                    {profileLoading ? (
                        <p className="text-gray-400">Loading profile...</p>
                    ) : editing ? (
                        <>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="text-lg font-semibold border-b border-gray-300 focus:outline-none text-center"
                                placeholder="Enter your name"
                            />
                            <div className="mt-4 flex justify-center gap-3">
                                <button
                                    onClick={handleSave}
                                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                                >
                                    Save
                                </button>
                                <button
                                    onClick={() => setEditing(false)}
                                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                                >
                                    Cancel
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <h2 className="text-2xl font-bold text-gray-800">
                                Hi {name || "Shopper"} 👋
                            </h2>
                            <p className="text-gray-500 mt-1">
                                Enjoying your shopping today?
                            </p>
                        </>
                    )}
                </div>

                {/* Tabs */}
                <div className="border-t px-6">
                    <div className="flex justify-center gap-6">
                        <button
                            onClick={() => setActiveTab("wishlist")}
                            className={`py-3 px-4 border-b-2 transition ${activeTab === "wishlist"
                                    ? "border-purple-600 text-purple-600 font-semibold"
                                    : "border-transparent text-gray-500 hover:text-gray-700"
                                }`}
                        >
                            Wishlist
                        </button>
                        <button
                            onClick={() => setActiveTab("orders")}
                            className={`py-3 px-4 border-b-2 transition ${activeTab === "orders"
                                    ? "border-purple-600 text-purple-600 font-semibold"
                                    : "border-transparent text-gray-500 hover:text-gray-700"
                                }`}
                        >
                            Order History
                        </button>
                    </div>
                </div>

                {/* Tab Content */}
                <div className="p-6">
                    {activeTab === "wishlist" ? (
                        wishlistLoading ? (
                            <p className="text-center text-gray-400">Loading wishlist...</p>
                        ) : wishlist.length > 0 ? (
                            <>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                    {wishlist.slice(0, 3).map((item) => (
                                        <div
                                            key={item.id}
                                            className="bg-gray-50 rounded-lg p-3 shadow-sm"
                                        >
                                            <img
                                                src={item.image}
                                                alt={item.title}
                                                className="w-full h-24 object-cover rounded"
                                            />
                                            <h4 className="mt-2 text-sm font-medium">{item.title}</h4>
                                            <p className="text-purple-600 text-sm">
                                                ${Number(item.price).toFixed(2)}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                                <div className="text-center mt-4">
                                    <Link
                                        href="/wishlist"
                                        className="px-4 py-2 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                                    >
                                        View All Wishlist
                                    </Link>
                                </div>
                            </>
                        ) : (
                            <p className="text-center text-gray-500">Your wishlist is empty.</p>
                        )
                    ) : ordersLoading ? (
                        <p className="text-center text-gray-400">Loading orders...</p>
                    ) : orders.length > 0 ? (
                        <>
                            <ul className="space-y-3">
                                {orders.slice(0, 3).map((order) => (
                                    <li
                                        key={order.id}
                                        className="p-3 border rounded-lg flex justify-between items-center"
                                    >
                                        <span>
                                            <span className="font-medium">#{order.id}</span> <br />
                                            <span className="text-sm text-gray-500">{order.date}</span>
                                        </span>
                                        <span className="text-purple-600 font-semibold">
                                            ${Number(order.total).toFixed(2)}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                            <div className="text-center mt-4">
                                <Link
                                    href="/orderhistory"
                                    className="px-4 py-2 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                                >
                                    View Full Order History
                                </Link>
                            </div>
                        </>
                    ) : (
                        <p className="text-center text-gray-500">No orders yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
}
