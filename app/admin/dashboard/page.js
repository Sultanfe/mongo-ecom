"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";

export default function AdminDashboardPage() {
    const router = useRouter();
    const { user, token, hydrated, isAuthenticated, isAdmin, logout } =
        useAuth();

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Client-side guard: redirect non-admins.
    useEffect(() => {
        if (hydrated) {
            if (!isAuthenticated) {
                router.push("/auth/login");
            } else if (!isAdmin) {
                router.push("/dashboard");
            }
        }
    }, [hydrated, isAuthenticated, isAdmin, router]);

    // Fetch the user list once we know we're admin.
    useEffect(() => {
        if (!hydrated || !isAdmin || !token) return;

        let cancelled = false;
        const load = async () => {
            setLoading(true);
            try {
                const res = await fetch("/api/admin/users", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await res.json();
                if (cancelled) return;
                if (!res.ok) {
                    setError(data.error || "Failed to load users");
                } else {
                    setUsers(data.users || []);
                }
            } catch (err) {
                if (!cancelled) setError("Failed to load users");
            } finally {
                if (!cancelled) setLoading(false);
            }
        };
        load();
        return () => {
            cancelled = true;
        };
    }, [hydrated, isAdmin, token]);

    if (!hydrated || !isAuthenticated) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center text-gray-500">
                Loading...
            </div>
        );
    }

    if (!isAdmin) {
        return null;
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-10">
            <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            Admin Dashboard
                        </h1>
                        <p className="text-gray-500 mt-1">
                            Logged in as{" "}
                            <span className="font-semibold text-gray-700">
                                {user?.fullName}
                            </span>{" "}
                            ({user?.role})
                        </p>
                    </div>
                    <button
                        onClick={logout}
                        className="px-4 py-2 rounded-lg bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition"
                    >
                        Logout
                    </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                    <div className="rounded-xl border border-gray-200 p-5">
                        <p className="text-sm text-gray-500">Total Users</p>
                        <p className="text-2xl font-bold text-gray-800">
                            {users.length}
                        </p>
                    </div>
                    <div className="rounded-xl border border-gray-200 p-5">
                        <p className="text-sm text-gray-500">Customers</p>
                        <p className="text-2xl font-bold text-gray-800">
                            {
                                users.filter((u) => u.role === "customer")
                                    .length
                            }
                        </p>
                    </div>
                    <div className="rounded-xl border border-gray-200 p-5">
                        <p className="text-sm text-gray-500">Admins</p>
                        <p className="text-2xl font-bold text-gray-800">
                            {
                                users.filter(
                                    (u) =>
                                        u.role === "admin" ||
                                        u.role === "super_admin"
                                ).length
                            }
                        </p>
                    </div>
                </div>

                <h2 className="text-xl font-bold text-gray-900 mb-3">
                    Registered Users
                </h2>

                {error && (
                    <div className="mb-4 px-4 py-3 rounded bg-red-50 border border-red-200 text-red-700 text-sm">
                        {error}
                    </div>
                )}

                {loading ? (
                    <p className="text-gray-500">Loading users...</p>
                ) : users.length === 0 ? (
                    <p className="text-gray-500">No users yet.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="border-b border-gray-200 text-gray-600">
                                    <th className="py-2 pr-4">Name</th>
                                    <th className="py-2 pr-4">Email</th>
                                    <th className="py-2 pr-4">Phone</th>
                                    <th className="py-2 pr-4">Role</th>
                                    <th className="py-2 pr-4">Joined</th>
                                    <th className="py-2 pr-4">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((u) => (
                                    <tr
                                        key={u._id}
                                        className="border-b border-gray-100 hover:bg-gray-50"
                                    >
                                        <td className="py-2 pr-4 font-medium text-gray-800">
                                            {u.fullName}
                                        </td>
                                        <td className="py-2 pr-4 text-gray-700">
                                            {u.email}
                                        </td>
                                        <td className="py-2 pr-4 text-gray-700">
                                            {u.phone || "-"}
                                        </td>
                                        <td className="py-2 pr-4">
                                            <span
                                                className={`px-2 py-0.5 rounded text-xs font-semibold ${
                                                    u.role === "admin" ||
                                                    u.role === "super_admin"
                                                        ? "bg-purple-100 text-purple-700"
                                                        : "bg-blue-100 text-blue-700"
                                                }`}
                                            >
                                                {u.role}
                                            </span>
                                        </td>
                                        <td className="py-2 pr-4 text-gray-600">
                                            {u.createdAt
                                                ? new Date(
                                                      u.createdAt
                                                  ).toLocaleDateString()
                                                : "-"}
                                        </td>
                                        <td className="py-2 pr-4">
                                            <span
                                                className={`px-2 py-0.5 rounded text-xs font-semibold ${
                                                    u.isActive
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-red-100 text-red-700"
                                                }`}
                                            >
                                                {u.isActive
                                                    ? "Active"
                                                    : "Inactive"}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
