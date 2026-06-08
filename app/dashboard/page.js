"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/app/context/AuthContext";

export default function DashboardPage() {
    const router = useRouter();
    const { user, hydrated, isAuthenticated, logout } = useAuth();

    useEffect(() => {
        if (hydrated && !isAuthenticated) {
            router.push("/auth/login");
        }
    }, [hydrated, isAuthenticated, router]);

    if (!hydrated) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center text-gray-500">
                Loading...
            </div>
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="max-w-5xl mx-auto px-4 py-10">
            <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            My Dashboard
                        </h1>
                        <p className="text-gray-500 mt-1">
                            Welcome back,{" "}
                            <span className="font-semibold text-gray-700">
                                {user?.fullName}
                            </span>
                        </p>
                    </div>
                    <button
                        onClick={logout}
                        className="px-4 py-2 rounded-lg bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition"
                    >
                        Logout
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="rounded-xl border border-gray-200 p-5">
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-semibold text-gray-800 break-all">
                            {user?.email}
                        </p>
                    </div>
                    <div className="rounded-xl border border-gray-200 p-5">
                        <p className="text-sm text-gray-500">Phone</p>
                        <p className="font-semibold text-gray-800">
                            {user?.phone || "Not set"}
                        </p>
                    </div>
                    <div className="rounded-xl border border-gray-200 p-5">
                        <p className="text-sm text-gray-500">Account Type</p>
                        <p className="font-semibold text-gray-800 capitalize">
                            {user?.role}
                        </p>
                    </div>
                </div>

                <div className="mt-8">
                    <h2 className="text-xl font-bold text-gray-900 mb-3">
                        Quick Actions
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <Link
                            href="/"
                            className="rounded-xl border border-gray-200 p-4 hover:border-blue-500 hover:shadow transition"
                        >
                            <p className="font-semibold text-gray-800">
                                Browse Products
                            </p>
                            <p className="text-sm text-gray-500">
                                Find what you need from the marketplace
                            </p>
                        </Link>
                        <Link
                            href="/cart"
                            className="rounded-xl border border-gray-200 p-4 hover:border-blue-500 hover:shadow transition"
                        >
                            <p className="font-semibold text-gray-800">
                                My Cart
                            </p>
                            <p className="text-sm text-gray-500">
                                View items you have added
                            </p>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
