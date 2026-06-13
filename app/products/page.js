"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCart } from "@/app/context/CartContext";

/**
 * Products listing page.
 * - Fetches all products from /api/products
 * - Filters by `?category=...` query param (case-insensitive)
 * - Shows a grid of product cards with add-to-cart
 * - Includes a small breadcrumb / back link and a clear-filter button
 */
function ProductsContent() {
    const searchParams = useSearchParams();
    const categoryFilter = searchParams.get("category") || "";

    const [products, setProducts] = useState([]);
    const [query, setQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [addedItems, setAddedItems] = useState({});
    const { addToCart } = useCart();

    useEffect(() => {
        let cancelled = false;
        const load = async () => {
            try {
                const res = await fetch("/api/products");
                if (!res.ok) throw new Error("Failed to fetch products");
                const data = await res.json();
                if (!cancelled) {
                    setProducts(Array.isArray(data) ? data : []);
                    setLoading(false);
                }
            } catch (err) {
                console.error("Products fetch error:", err);
                if (!cancelled) setLoading(false);
            }
        };
        load();
        return () => {
            cancelled = true;
        };
    }, []);

    const handleAddToCart = (product) => {
        addToCart(product);
        setAddedItems((prev) => ({ ...prev, [product._id]: true }));
        setTimeout(() => {
            setAddedItems((prev) => ({ ...prev, [product._id]: false }));
        }, 2000);
    };

    const normalizedFilter = categoryFilter.trim().toLowerCase();
    const filtered = products.filter((p) => {
        const matchesCategory = normalizedFilter
            ? (p.category || "").toLowerCase() === normalizedFilter
            : true;
        const q = query.trim().toLowerCase();
        const matchesQuery = q
            ? (p.title || "").toLowerCase().includes(q) ||
              (p.description || "").toLowerCase().includes(q)
            : true;
        return matchesCategory && matchesQuery;
    });

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="py-12 px-4">
                <div className="max-w-7xl mx-auto">
                    {/* Breadcrumb */}
                    <nav className="mb-6 text-sm text-gray-500">
                        <Link href="/" className="hover:text-blue-600 transition">
                            Home
                        </Link>
                        <span className="mx-2">/</span>
                        <span className="text-gray-700 font-medium">
                            Products
                        </span>
                        {categoryFilter && (
                            <>
                                <span className="mx-2">/</span>
                                <span className="text-gray-700 font-medium">
                                    {categoryFilter}
                                </span>
                            </>
                        )}
                    </nav>

                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                        {categoryFilter
                            ? `${categoryFilter} Products`
                            : "All Products"}
                    </h1>
                    <p className="text-gray-600 mb-8">
                        {categoryFilter
                            ? `Browse our ${categoryFilter.toLowerCase()} collection from Mirpur Bazaar`
                            : "Discover our amazing collection from Mirpur Bazaar"}
                    </p>

                    {/* Filter / search bar */}
                    <div className="flex flex-col sm:flex-row gap-3 mb-8">
                        <input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            type="text"
                            placeholder="Search products..."
                            className="flex-1 rounded-lg border border-slate-300 bg-white py-2 px-4 text-gray-700 placeholder-gray-400 focus:border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500"
                        />
                        {categoryFilter && (
                            <Link
                                href="/products"
                                className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-6 rounded-lg font-semibold transition-colors text-center"
                            >
                                Clear filter
                            </Link>
                        )}
                    </div>

                    {loading ? (
                        <div className="text-center py-12 text-gray-500">
                            Loading products...
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-500 text-lg">
                                No products found
                                {categoryFilter
                                    ? ` in ${categoryFilter}`
                                    : ""}
                                .
                            </p>
                            {categoryFilter && (
                                <Link
                                    href="/products"
                                    className="inline-block mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg font-semibold transition-colors"
                                >
                                    View all products
                                </Link>
                            )}
                        </div>
                    ) : (
                        <div
                            id="products"
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                        >
                            {filtered.map((product) => (
                                <div
                                    key={product._id}
                                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col"
                                >
                                    <Link href={`/products/${product._id}`}>
                                        {product.image && (
                                            <div className="w-full h-64 bg-gray-200 overflow-hidden cursor-pointer">
                                                <img
                                                    src={product.image}
                                                    alt={product.title}
                                                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                                />
                                            </div>
                                        )}
                                    </Link>
                                    <div className="p-6 flex-1 flex flex-col">
                                        {product.category && (
                                            <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full mb-3 w-fit">
                                                {product.category}
                                            </span>
                                        )}
                                        <Link
                                            href={`/products/${product._id}`}
                                        >
                                            <h2 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 hover:text-blue-600 transition cursor-pointer">
                                                {product.title}
                                            </h2>
                                        </Link>
                                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                            {product.description}
                                        </p>
                                        <div className="flex items-center justify-between mt-auto">
                                            <span className="text-2xl font-bold text-blue-600">
                                                Tk.{" "}
                                                {product.price?.toFixed(2) ||
                                                    "0.00"}
                                            </span>
                                            <button
                                                onClick={() =>
                                                    handleAddToCart(product)
                                                }
                                                className={`font-semibold py-2 px-4 rounded-lg transition-colors duration-200 ${
                                                    addedItems[product._id]
                                                        ? "bg-green-600 text-white hover:bg-green-700"
                                                        : "bg-blue-600 text-white hover:bg-blue-700"
                                                }`}
                                            >
                                                {addedItems[product._id]
                                                    ? "✓ Added"
                                                    : "Add to Cart"}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function ProductsPage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-500">
                    Loading...
                </div>
            }
        >
            <ProductsContent />
        </Suspense>
    );
}
