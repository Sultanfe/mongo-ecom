"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/app/context/AuthContext";

export default function DashboardPage() {
    const router = useRouter();
    const { user, hydrated, isAuthenticated, logout } = useAuth();
    const [products, setProducts] = useState([]);
    const [users, setUsers] = useState([]);
    const [activeTab, setActiveTab] = useState("overview");
    const [loading, setLoading] = useState(false);
    const [newProduct, setNewProduct] = useState({
        title: "", description: "", price: "", category: "", image: "", featured: false
    });
    const [message, setMessage] = useState("");

    const isAdmin = user?.role === "admin" || user?.role === "super_admin";

    useEffect(() => {
        if (hydrated && !isAuthenticated) router.push("/auth/login");
    }, [hydrated, isAuthenticated, router]);

    useEffect(() => {
        if (isAdmin && isAuthenticated) {
            fetchProducts();
            fetchUsers();
        }
    }, [isAdmin, isAuthenticated]);

    const getToken = () => localStorage.getItem("token");

    const fetchProducts = async () => {
        try {
            const res = await fetch("/api/admin/products", {
                headers: { Authorization: `Bearer ${getToken()}` }
            });
            const data = await res.json();
            if (data.products) setProducts(data.products);
        } catch (e) { console.error(e); }
    };

    const fetchUsers = async () => {
        try {
            const res = await fetch("/api/admin/users", {
                headers: { Authorization: `Bearer ${getToken()}` }
            });
            const data = await res.json();
            if (data.users) setUsers(data.users);
        } catch (e) { console.error(e); }
    };

    const handleAddProduct = async () => {
        if (!newProduct.title || !newProduct.category || !newProduct.price) {
            setMessage("Title, category and price are required!");
            return;
        }
        setLoading(true);
        try {
            const res = await fetch("/api/admin/products", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${getToken()}`
                },
                body: JSON.stringify({ ...newProduct, price: parseFloat(newProduct.price) })
            });
            const data = await res.json();
            if (data.product) {
                setMessage("Product added successfully!");
                setNewProduct({ title: "", description: "", price: "", category: "", image: "", featured: false });
                fetchProducts();
            } else {
                setMessage(data.error || "Failed to add product");
            }
        } catch (e) {
            setMessage("Error adding product");
        }
        setLoading(false);
    };

    const handleDeleteProduct = async (id) => {
        if (!confirm("Delete this product?")) return;
        try {
            await fetch(`/api/admin/products/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${getToken()}` }
            });
            fetchProducts();
        } catch (e) { console.error(e); }
    };

    if (!hydrated) return <div className="min-h-[60vh] flex items-center justify-center text-gray-500">Loading...</div>;
    if (!isAuthenticated) return null;

    return (
        <div className="max-w-6xl mx-auto px-4 py-10">
            <div className="bg-white rounded-2xl shadow-lg p-8">
                {/* Header */}
                <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            {isAdmin ? "Admin Dashboard" : "My Dashboard"}
                        </h1>
                        <p className="text-gray-500 mt-1">Welcome back, <span className="font-semibold text-gray-700">{user?.fullName}</span></p>
                    </div>
                    <button onClick={logout} className="px-4 py-2 rounded-lg bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition">
                        Logout
                    </button>
                </div>

                {/* User Info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="rounded-xl border border-gray-200 p-5">
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-semibold text-gray-800 break-all">{user?.email}</p>
                    </div>
                    <div className="rounded-xl border border-gray-200 p-5">
                        <p className="text-sm text-gray-500">Phone</p>
                        <p className="font-semibold text-gray-800">{user?.phone || "Not set"}</p>
                    </div>
                    <div className="rounded-xl border border-gray-200 p-5">
                        <p className="text-sm text-gray-500">Account Type</p>
                        <p className="font-semibold text-gray-800 capitalize">{user?.role}</p>
                    </div>
                </div>

                {/* Admin Panel */}
                {isAdmin ? (
                    <>
                        {/* Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                            <div className="bg-blue-50 rounded-xl p-5 text-center">
                                <p className="text-3xl font-bold text-blue-600">{products.length}</p>
                                <p className="text-sm text-gray-600 mt-1">Total Products</p>
                            </div>
                            <div className="bg-green-50 rounded-xl p-5 text-center">
                                <p className="text-3xl font-bold text-green-600">{users.length}</p>
                                <p className="text-sm text-gray-600 mt-1">Total Users</p>
                            </div>
                            <div className="bg-purple-50 rounded-xl p-5 text-center">
                                <p className="text-3xl font-bold text-purple-600">{products.filter(p => p.featured).length}</p>
                                <p className="text-sm text-gray-600 mt-1">Featured</p>
                            </div>
                            <div className="bg-orange-50 rounded-xl p-5 text-center">
                                <p className="text-3xl font-bold text-orange-600">{users.filter(u => u.role === "admin").length}</p>
                                <p className="text-sm text-gray-600 mt-1">Admins</p>
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className="flex gap-2 mb-6 border-b">
                            {["overview", "products", "add-product", "users"].map(tab => (
                                <button key={tab} onClick={() => setActiveTab(tab)}
                                    className={`px-4 py-2 text-sm font-semibold capitalize rounded-t-lg transition ${activeTab === tab ? "bg-blue-600 text-white" : "text-gray-600 hover:text-blue-600"}`}>
                                    {tab.replace("-", " ")}
                                </button>
                            ))}
                        </div>

                        {/* Overview Tab */}
                        {activeTab === "overview" && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <Link href="/" className="rounded-xl border border-gray-200 p-4 hover:border-blue-500 hover:shadow transition">
                                    <p className="font-semibold text-gray-800">Browse Products</p>
                                    <p className="text-sm text-gray-500">View the marketplace</p>
                                </Link>
                                <button onClick={() => setActiveTab("add-product")} className="rounded-xl border border-gray-200 p-4 hover:border-blue-500 hover:shadow transition text-left">
                                    <p className="font-semibold text-gray-800">Add New Product</p>
                                    <p className="text-sm text-gray-500">Add products to marketplace</p>
                                </button>
                                <button onClick={() => setActiveTab("products")} className="rounded-xl border border-gray-200 p-4 hover:border-blue-500 hover:shadow transition text-left">
                                    <p className="font-semibold text-gray-800">Manage Products</p>
                                    <p className="text-sm text-gray-500">{products.length} products listed</p>
                                </button>
                                <button onClick={() => setActiveTab("users")} className="rounded-xl border border-gray-200 p-4 hover:border-blue-500 hover:shadow transition text-left">
                                    <p className="font-semibold text-gray-800">Manage Users</p>
                                    <p className="text-sm text-gray-500">{users.length} registered users</p>
                                </button>
                            </div>
                        )}

                        {/* Products Tab */}
                        {activeTab === "products" && (
                            <div>
                                <h2 className="text-lg font-bold text-gray-800 mb-4">All Products ({products.length})</h2>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="bg-gray-50 text-left">
                                                <th className="p-3 font-semibold">Title</th>
                                                <th className="p-3 font-semibold">Category</th>
                                                <th className="p-3 font-semibold">Price</th>
                                                <th className="p-3 font-semibold">Featured</th>
                                                <th className="p-3 font-semibold">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {products.map(p => (
                                                <tr key={p._id} className="border-t hover:bg-gray-50">
                                                    <td className="p-3">{p.title}</td>
                                                    <td className="p-3">{p.category}</td>
                                                    <td className="p-3">৳{p.price}</td>
                                                    <td className="p-3">{p.featured ? "✅" : "❌"}</td>
                                                    <td className="p-3">
                                                        <button onClick={() => handleDeleteProduct(p._id)}
                                                            className="text-red-500 hover:text-red-700 font-semibold text-xs">
                                                            Delete
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* Add Product Tab */}
                        {activeTab === "add-product" && (
                            <div className="max-w-lg">
                                <h2 className="text-lg font-bold text-gray-800 mb-4">Add New Product</h2>
                                {message && <p className={`mb-4 text-sm font-semibold ${message.includes("success") ? "text-green-600" : "text-red-500"}`}>{message}</p>}
                                <div className="space-y-3">
                                    {["title", "description", "price", "category", "image"].map(field => (
                                        <div key={field}>
                                            <label className="text-sm font-semibold text-gray-700 capitalize">{field}</label>
                                            <input
                                                type={field === "price" ? "number" : "text"}
                                                value={newProduct[field]}
                                                onChange={e => setNewProduct({ ...newProduct, [field]: e.target.value })}
                                                placeholder={field === "image" ? "Image URL" : `Enter ${field}`}
                                                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                                            />
                                        </div>
                                    ))}
                                    <div className="flex items-center gap-2">
                                        <input type="checkbox" id="featured"
                                            checked={newProduct.featured}
                                            onChange={e => setNewProduct({ ...newProduct, featured: e.target.checked })}
                                        />
                                        <label htmlFor="featured" className="text-sm font-semibold text-gray-700">Featured Product</label>
                                    </div>
                                    <button onClick={handleAddProduct} disabled={loading}
                                        className="w-full py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition disabled:opacity-50">
                                        {loading ? "Adding..." : "Add Product"}
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Users Tab */}
                        {activeTab === "users" && (
                            <div>
                                <h2 className="text-lg font-bold text-gray-800 mb-4">All Users ({users.length})</h2>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="bg-gray-50 text-left">
                                                <th className="p-3 font-semibold">Name</th>
                                                <th className="p-3 font-semibold">Email</th>
                                                <th className="p-3 font-semibold">Role</th>
                                                <th className="p-3 font-semibold">Joined</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {users.map(u => (
                                                <tr key={u._id} className="border-t hover:bg-gray-50">
                                                    <td className="p-3">{u.fullName || "N/A"}</td>
                                                    <td className="p-3">{u.email}</td>
                                                    <td className="p-3">
                                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${u.role === "admin" ? "bg-purple-100 text-purple-700" : "bg-gray-100 text-gray-700"}`}>
                                                            {u.role}
                                                        </span>
                                                    </td>
                                                    <td className="p-3">{new Date(u.createdAt).toLocaleDateString()}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    /* Regular User Dashboard */
                    <div className="mt-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-3">Quick Actions</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <Link href="/" className="rounded-xl border border-gray-200 p-4 hover:border-blue-500 hover:shadow transition">
                                <p className="font-semibold text-gray-800">Browse Products</p>
                                <p className="text-sm text-gray-500">Find what you need from the marketplace</p>
                            </Link>
                            <Link href="/cart" className="rounded-xl border border-gray-200 p-4 hover:border-blue-500 hover:shadow transition">
                                <p className="font-semibold text-gray-800">My Cart</p>
                                <p className="text-sm text-gray-500">View items you have added</p>
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}