"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/app/context/AuthContext";

/**
 * Admin · User Management
 * -----------------------
 * Lists every registered user and lets the current admin
 * change any user's role in place via a dropdown.
 *
 * - GET    /api/admin/users   — list users
 * - POST   /api/admin/promote — { userId, role }
 *
 * Only `super_admin` can promote to `admin` or `super_admin`,
 * per the rules in /api/admin/promote. Regular admins can
 * promote to `customer` or `vendor` only.
 */
const ROLES = ["customer", "vendor", "admin", "super_admin"];

function RoleBadge({ role }) {
    const cls =
        role === "super_admin"
            ? "bg-red-100 text-red-700"
            : role === "admin"
            ? "bg-purple-100 text-purple-700"
            : role === "vendor"
            ? "bg-yellow-100 text-yellow-700"
            : "bg-blue-100 text-blue-700";
    return (
        <span
            className={`px-2 py-0.5 rounded text-xs font-semibold ${cls}`}
        >
            {role}
        </span>
    );
}

export default function AdminUsersPage() {
    const router = useRouter();
    const { user, token, hydrated, isAuthenticated, isAdmin, isSuperAdmin, logout } =
        useAuth();

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [updatingId, setUpdatingId] = useState(null);
    const [flash, setFlash] = useState("");

    // Auth guard
    useEffect(() => {
        if (hydrated) {
            if (!isAuthenticated) router.push("/auth/login");
            else if (!isAdmin) router.push("/dashboard");
        }
    }, [hydrated, isAuthenticated, isAdmin, router]);

    const loadUsers = useCallback(async () => {
        if (!token) return;
        setLoading(true);
        setError("");
        try {
            const res = await fetch("/api/admin/users", {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (!res.ok) {
                setError(data.error || "Failed to load users");
            } else {
                setUsers(Array.isArray(data.users) ? data.users : []);
            }
        } catch (err) {
            setError("Failed to load users");
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        if (hydrated && isAdmin && token) loadUsers();
    }, [hydrated, isAdmin, token, loadUsers]);

    const handleRoleChange = async (userId, newRole) => {
        setUpdatingId(userId);
        setError("");
        setFlash("");
        try {
            const res = await fetch("/api/admin/promote", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ userId, role: newRole }),
            });
            const data = await res.json();
            if (!res.ok) {
                setError(data.error || "Role update failed");
            } else {
                setFlash(
                    `Role updated to "${newRole}" for ${
                        data?.user?.fullName || "user"
                    }`
                );
                // Auto-clear the success flash after 2.5s
                setTimeout(() => setFlash(""), 2500);
                loadUsers();
            }
        } catch (err) {
            setError("Role update failed");
        } finally {
            setUpdatingId(null);
        }
    };

    if (!hydrated || !isAuthenticated) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center text-gray-500">
                Loading...
            </div>
        );
    }
    if (!isAdmin) return null;

    const filtered = users.filter((u) => {
        const q = search.trim().toLowerCase();
        if (!q) return true;
        return (
            (u.fullName || "").toLowerCase().includes(q) ||
            (u.email || "").toLowerCase().includes(q) ||
            (u.phone || "").toLowerCase().includes(q) ||
            (u.role || "").toLowerCase().includes(q)
        );
    });

    return (
        <div className="max-w-6xl mx-auto px-4 py-8 sm:py-10">
            <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                        Manage Users & Roles
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Logged in as{" "}
                        <span className="font-semibold text-gray-700">
                            {user?.fullName}
                        </span>{" "}
                        (<RoleBadge role={user?.role} />)
                    </p>
                </div>
                <div className="flex gap-2 flex-wrap">
                    <Link
                        href="/admin/products"
                        className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm font-semibold hover:bg-gray-50 transition"
                    >
                        Products
                    </Link>
                    <Link
                        href="/admin/dashboard"
                        className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm font-semibold hover:bg-gray-50 transition"
                    >
                        Dashboard
                    </Link>
                    <button
                        onClick={logout}
                        className="px-4 py-2 rounded-lg bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition"
                    >
                        Logout
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row gap-3 mb-5">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by name, email, phone, or role…"
                        className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                    />
                </div>

                {!isSuperAdmin && (
                    <div className="mb-4 px-4 py-3 rounded bg-amber-50 border border-amber-200 text-amber-800 text-sm">
                        You are an <strong>admin</strong> (not super_admin). You
                        can change users to <code>customer</code> or{" "}
                        <code>vendor</code>. Only a <code>super_admin</code>{" "}
                        can grant the admin or super_admin role.
                    </div>
                )}

                {error && (
                    <div className="mb-4 px-4 py-3 rounded bg-red-50 border border-red-200 text-red-700 text-sm">
                        {error}
                    </div>
                )}
                {flash && (
                    <div className="mb-4 px-4 py-3 rounded bg-green-50 border border-green-200 text-green-700 text-sm">
                        ✓ {flash}
                    </div>
                )}

                {loading ? (
                    <p className="text-gray-500">Loading users…</p>
                ) : filtered.length === 0 ? (
                    <p className="text-gray-500 text-sm">No users found.</p>
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
                                    <th className="py-2 pr-4 text-right">
                                        Change role
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((u) => {
                                    const isSelf = u._id === user?._id;
                                    return (
                                        <tr
                                            key={u._id}
                                            className="border-b border-gray-100 hover:bg-gray-50"
                                        >
                                            <td className="py-2 pr-4 font-medium text-gray-800">
                                                {u.fullName}
                                                {isSelf && (
                                                    <span className="ml-2 text-xs text-gray-500">
                                                        (you)
                                                    </span>
                                                )}
                                            </td>
                                            <td className="py-2 pr-4 text-gray-700">
                                                {u.email}
                                            </td>
                                            <td className="py-2 pr-4 text-gray-700">
                                                {u.phone || "-"}
                                            </td>
                                            <td className="py-2 pr-4">
                                                <RoleBadge role={u.role} />
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
                                            <td className="py-2 pr-4 text-right">
                                                <select
                                                    value={u.role}
                                                    disabled={
                                                        updatingId === u._id ||
                                                        isSelf
                                                    }
                                                    onChange={(e) =>
                                                        handleRoleChange(
                                                            u._id,
                                                            e.target.value
                                                        )
                                                    }
                                                    className="text-xs rounded border border-gray-300 px-2 py-1 bg-white disabled:opacity-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                                                >
                                                    {ROLES.map((r) => {
                                                        // Regular admins cannot pick admin/super_admin here;
                                                        // the server will reject it anyway.
                                                        return (
                                                            <option
                                                                key={r}
                                                                value={r}
                                                            >
                                                                {r}
                                                            </option>
                                                        );
                                                    })}
                                                </select>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
