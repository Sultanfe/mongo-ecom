"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/app/context/AuthContext";

/**
 * Admin · Product Management
 * --------------------------
 * Full CRUD UI for the products in the store. Admin-only.
 *
 * - Lists all products in a table with search
 * - "Add new product" opens a modal-style form
 * - "Edit" opens the same form pre-filled
 * - "Delete" shows a confirmation and removes via the API
 *
 * All API calls go through /api/admin/products (and
 * /api/admin/products/[id]) and require a Bearer token.
 */
const EMPTY_FORM = {
    title: "",
    description: "",
    price: "",
    category: "",
    image: "",
    featured: false,
};

function ProductForm({ initial, onCancel, onSave, saving }) {
    const [form, setForm] = useState(() => ({
        ...EMPTY_FORM,
        ...(initial || {}),
        price:
            initial && initial.price !== undefined && initial.price !== null
                ? String(initial.price)
                : "",
    }));

    const update = (key, value) =>
        setForm((prev) => ({ ...prev, [key]: value }));

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({
            ...form,
            title: form.title.trim(),
            category: form.category.trim(),
            description: form.description.trim(),
            image: form.image.trim(),
            price: form.price === "" ? 0 : Number(form.price),
            featured: Boolean(form.featured),
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <form
                onSubmit={handleSubmit}
                className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
                <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-900">
                        {initial?._id ? "Edit Product" : "Add New Product"}
                    </h2>
                    <button
                        type="button"
                        onClick={onCancel}
                        className="text-gray-400 hover:text-gray-700 text-2xl leading-none"
                        aria-label="Close"
                    >
                        ×
                    </button>
                </div>

                <div className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                            Title <span className="text-red-500">*</span>
                        </label>
                        <input
                            required
                            value={form.title}
                            onChange={(e) => update("title", e.target.value)}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                            placeholder="e.g. Classic White Sneakers"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                            Description
                        </label>
                        <textarea
                            rows={3}
                            value={form.description}
                            onChange={(e) =>
                                update("description", e.target.value)
                            }
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                            placeholder="Short product description"
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                Price (Tk.){" "}
                                <span className="text-red-500">*</span>
                            </label>
                            <input
                                required
                                type="number"
                                step="0.01"
                                min="0"
                                value={form.price}
                                onChange={(e) =>
                                    update("price", e.target.value)
                                }
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                                placeholder="0.00"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                Category{" "}
                                <span className="text-red-500">*</span>
                            </label>
                            <input
                                required
                                value={form.category}
                                onChange={(e) =>
                                    update("category", e.target.value)
                                }
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                                placeholder="e.g. Footwear"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                            Image URL
                        </label>
                        <input
                            value={form.image}
                            onChange={(e) => update("image", e.target.value)}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                            placeholder="https://..."
                        />
                    </div>

                    <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                            type="checkbox"
                            checked={Boolean(form.featured)}
                            onChange={(e) =>
                                update("featured", e.target.checked)
                            }
                            className="w-4 h-4 accent-blue-600"
                        />
                        <span className="text-sm text-gray-700">
                            Feature this product on the home page
                        </span>
                    </label>
                </div>

                <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={saving}
                        className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition disabled:opacity-60"
                    >
                        {saving
                            ? "Saving..."
                            : initial?._id
                            ? "Save Changes"
                            : "Create Product"}
                    </button>
                </div>
            </form>
        </div>
    );
}

function ConfirmDialog({ message, onCancel, onConfirm, busy }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-2">
                    Confirm delete
                </h2>
                <p className="text-gray-600 text-sm mb-5">{message}</p>
                <div className="flex justify-end gap-3">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={busy}
                        className="px-4 py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition disabled:opacity-60"
                    >
                        {busy ? "Deleting..." : "Delete"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function AdminProductsPage() {
    const router = useRouter();
    const { token, hydrated, isAuthenticated, isAdmin, logout } = useAuth();

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");

    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState(null);
    const [saving, setSaving] = useState(false);

    const [confirmDelete, setConfirmDelete] = useState(null);
    const [deleting, setDeleting] = useState(false);

    // Auth guard
    useEffect(() => {
        if (hydrated) {
            if (!isAuthenticated) router.push("/auth/login");
            else if (!isAdmin) router.push("/dashboard");
        }
    }, [hydrated, isAuthenticated, isAdmin, router]);

    const loadProducts = useCallback(async () => {
        if (!token) return;
        setLoading(true);
        setError("");
        try {
            const res = await fetch(
                `/api/admin/products?q=${encodeURIComponent(search)}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            const data = await res.json();
            if (!res.ok) {
                setError(data.error || "Failed to load products");
            } else {
                setProducts(Array.isArray(data.products) ? data.products : []);
            }
        } catch (err) {
            setError("Failed to load products");
        } finally {
            setLoading(false);
        }
    }, [token, search]);

    useEffect(() => {
        if (hydrated && isAdmin && token) {
            loadProducts();
        }
    }, [hydrated, isAdmin, token, loadProducts]);

    const handleSave = async (form) => {
        setSaving(true);
        try {
            const isEdit = Boolean(editing?._id);
            const res = await fetch(
                isEdit
                    ? `/api/admin/products/${editing._id}`
                    : "/api/admin/products",
                {
                    method: isEdit ? "PUT" : "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(form),
                }
            );
            const data = await res.json();
            if (!res.ok) {
                setError(data.error || "Save failed");
            } else {
                setShowForm(false);
                setEditing(null);
                loadProducts();
            }
        } catch (err) {
            setError("Save failed");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        setDeleting(true);
        try {
            const res = await fetch(`/api/admin/products/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                setConfirmDelete(null);
                loadProducts();
            } else {
                const data = await res.json().catch(() => ({}));
                setError(data.error || "Delete failed");
            }
        } catch (err) {
            setError("Delete failed");
        } finally {
            setDeleting(false);
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

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 sm:py-10">
            <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                        Manage Products
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Add, edit, and remove products from the catalog
                    </p>
                </div>
                <div className="flex gap-2">
                    <Link
                        href="/admin/dashboard"
                        className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm font-semibold hover:bg-gray-50 transition"
                    >
                        ← Users
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
                        placeholder="Search by title, category, or description…"
                        className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                    />
                    <button
                        onClick={() => {
                            setEditing(null);
                            setShowForm(true);
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg transition"
                    >
                        + Add Product
                    </button>
                </div>

                {error && (
                    <div className="mb-4 px-4 py-3 rounded bg-red-50 border border-red-200 text-red-700 text-sm">
                        {error}
                    </div>
                )}

                {loading ? (
                    <p className="text-gray-500">Loading products…</p>
                ) : products.length === 0 ? (
                    <p className="text-gray-500 text-sm">
                        No products found. Click &ldquo;Add Product&rdquo; to
                        create one.
                    </p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="border-b border-gray-200 text-gray-600">
                                    <th className="py-2 pr-4">Image</th>
                                    <th className="py-2 pr-4">Title</th>
                                    <th className="py-2 pr-4">Category</th>
                                    <th className="py-2 pr-4">Price</th>
                                    <th className="py-2 pr-4">Featured</th>
                                    <th className="py-2 pr-4 text-right">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((p) => (
                                    <tr
                                        key={p._id}
                                        className="border-b border-gray-100 hover:bg-gray-50"
                                    >
                                        <td className="py-2 pr-4">
                                            {p.image ? (
                                                <img
                                                    src={p.image}
                                                    alt={p.title}
                                                    className="w-12 h-12 object-cover rounded"
                                                />
                                            ) : (
                                                <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-gray-400 text-xs">
                                                    —
                                                </div>
                                            )}
                                        </td>
                                        <td className="py-2 pr-4 font-medium text-gray-800 max-w-xs">
                                            <span className="line-clamp-2">
                                                {p.title}
                                            </span>
                                        </td>
                                        <td className="py-2 pr-4">
                                            <span className="px-2 py-0.5 rounded text-xs font-semibold bg-blue-100 text-blue-700">
                                                {p.category}
                                            </span>
                                        </td>
                                        <td className="py-2 pr-4 font-semibold text-blue-600">
                                            Tk.{" "}
                                            {typeof p.price === "number"
                                                ? p.price.toFixed(2)
                                                : "0.00"}
                                        </td>
                                        <td className="py-2 pr-4">
                                            {p.featured ? (
                                                <span className="px-2 py-0.5 rounded text-xs font-semibold bg-yellow-100 text-yellow-700">
                                                    ★ Featured
                                                </span>
                                            ) : (
                                                <span className="text-gray-400 text-xs">
                                                    —
                                                </span>
                                            )}
                                        </td>
                                        <td className="py-2 pr-4 text-right">
                                            <div className="inline-flex gap-2">
                                                <button
                                                    onClick={() => {
                                                        setEditing(p);
                                                        setShowForm(true);
                                                    }}
                                                    className="px-3 py-1 rounded text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 transition"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        setConfirmDelete(p)
                                                    }
                                                    className="px-3 py-1 rounded text-xs font-semibold bg-red-50 text-red-700 hover:bg-red-100 transition"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {showForm && (
                <ProductForm
                    initial={editing}
                    saving={saving}
                    onCancel={() => {
                        setShowForm(false);
                        setEditing(null);
                    }}
                    onSave={handleSave}
                />
            )}

            {confirmDelete && (
                <ConfirmDialog
                    message={`Are you sure you want to delete "${confirmDelete.title}"? This action cannot be undone.`}
                    onCancel={() => setConfirmDelete(null)}
                    onConfirm={() => handleDelete(confirmDelete._id)}
                    busy={deleting}
                />
            )}
        </div>
    );
}
