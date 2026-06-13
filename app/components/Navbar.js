"use client";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/app/context/CartContext";
import { useAuth } from "@/app/context/AuthContext";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const { getTotalItems } = useCart();
    const { user, hydrated, isAuthenticated, isAdmin, logout } = useAuth();
    const totalItems = getTotalItems();

    return (
        <nav className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo/Brand */}
                    <Link
                        href="/"
                        className="flex items-center space-x-2 hover:opacity-90 transition"
                    >
                        <svg
                            className="w-8 h-8"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" />
                        </svg>
                        <span className="text-xl font-bold hidden sm:inline">
                            Mirpur Bazaar
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex space-x-8">
                        <Link
                            href="/"
                            className="hover:bg-blue-700 px-3 py-2 rounded transition"
                        >
                            Home
                        </Link>
                        <Link
                            href="/#products"
                            className="hover:bg-blue-700 px-3 py-2 rounded transition"
                        >
                            Products
                        </Link>
                        <Link
                            href="/about"
                            className="hover:bg-blue-700 px-3 py-2 rounded transition"
                        >
                            About
                        </Link>
                        {/* Admin-only: shows up only for users with
                            role === "admin" or "super_admin". Regular
                            customers and vendors never see this link. */}
                        {hydrated && isAdmin && (
                            <Link
                                href="/admin/dashboard"
                                className="bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-100 px-3 py-2 rounded transition flex items-center gap-1"
                            >
                                <svg
                                    className="w-4 h-4"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                Admin
                            </Link>
                        )}
                    </div>

                    {/* Right-side actions */}
                    <div className="hidden md:flex items-center space-x-4">
                        <Link
                            href="/cart"
                            className="relative hover:opacity-90 transition flex items-center"
                        >
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                                />
                            </svg>
                            {totalItems > 0 && (
                                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                    {totalItems}
                                </span>
                            )}
                        </Link>

                        {hydrated && isAuthenticated ? (
                            <>
                                <Link
                                    href={isAdmin ? "/admin/dashboard" : "/dashboard"}
                                    className="bg-white/10 hover:bg-white/20 px-3 py-2 rounded transition text-sm font-semibold"
                                >
                                    {user?.fullName?.split(" ")[0] || "Account"}
                                </Link>
                                <button
                                    onClick={logout}
                                    className="bg-red-500 hover:bg-red-600 text-white text-sm font-semibold px-3 py-2 rounded transition"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <Link
                                href="/auth/login"
                                className="bg-yellow-500 hover:bg-yellow-600 text-blue-900 font-bold py-2 px-4 rounded transition"
                            >
                                Login
                            </Link>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md hover:bg-blue-700 transition"
                        >
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                {isOpen ? (
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                ) : (
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {isOpen && (
                    <div className="md:hidden pb-4 space-y-2">
                        <Link
                            href="/"
                            className="block hover:bg-blue-700 px-3 py-2 rounded transition"
                        >
                            Home
                        </Link>
                        <Link
                            href="/#products"
                            className="block hover:bg-blue-700 px-3 py-2 rounded transition"
                        >
                            Products
                        </Link>
                        <Link
                            href="/about"
                            className="block hover:bg-blue-700 px-3 py-2 rounded transition"
                        >
                            About
                        </Link>
                        {hydrated && isAdmin && (
                            <Link
                                href="/admin/dashboard"
                                className="block bg-yellow-500/20 text-yellow-100 hover:bg-yellow-500/30 px-3 py-2 rounded transition"
                            >
                                ⚙ Admin Dashboard
                            </Link>
                        )}
                        <Link
                            href="/cart"
                            className="flex items-center hover:bg-blue-700 px-3 py-2 rounded transition"
                        >
                            <svg
                                className="w-5 h-5 mr-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                                />
                            </svg>
                            Cart {totalItems > 0 && `(${totalItems})`}
                        </Link>

                        {hydrated && isAuthenticated ? (
                            <>
                                <Link
                                    href={isAdmin ? "/admin/dashboard" : "/dashboard"}
                                    className="block hover:bg-blue-700 px-3 py-2 rounded transition"
                                >
                                    My Account
                                </Link>
                                <button
                                    onClick={logout}
                                    className="block w-full text-left bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded transition"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <Link
                                href="/auth/login"
                                className="block bg-yellow-500 hover:bg-yellow-600 text-blue-900 font-bold py-2 px-3 rounded transition"
                            >
                                Login / Register
                            </Link>
                        )}
                    </div>
                )}
            </div>
        </nav>
    );
}
