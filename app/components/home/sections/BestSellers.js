"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

/**
 * BestSellers
 * -----------
 * A static, prominent grid showcasing the store's best-selling products.
 * Sits directly under the AnimatedProducts (Featured) section and
 * is intentionally larger / more visually dominant than the
 * animated strip above and the regular product grid below.
 *
 * - Fetches products from /api/products
 * - Picks the top 6 highest-priced products as a "best sellers" proxy
 *   (the Product model has no sales field, so we use price as a
 *   sensible stand-in; easy to swap for a real sales field later)
 * - Renders as a 1/2/3 column grid of LARGE cards
 * - Static — no animation
 */
export default function BestSellers() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

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
                console.error("BestSellers fetch error:", err);
                if (!cancelled) setLoading(false);
            }
        };

        load();
        return () => {
            cancelled = true;
        };
    }, []);

    if (loading) {
        return (
            <section
                aria-label="Best selling products"
                className="bg-white py-12 sm:py-16"
            >
                <div className="max-w-7xl mx-auto px-4">
                    <div className="h-64 flex items-center justify-center text-gray-500 text-sm">
                        Loading best sellers...
                    </div>
                </div>
            </section>
        );
    }

    if (products.length === 0) {
        return null;
    }

    // Pick the 6 highest-priced products as a stand-in for best sellers.
    // Prefer products that are explicitly flagged `featured: true`
    // (the new real-image products) so this section highlights them.
    const featured = products.filter(
        (p) => p.featured && typeof p.price === "number"
    );
    const others = products.filter(
        (p) => !p.featured && typeof p.price === "number"
    );

    const bestSellers = [...featured, ...others]
        .sort((a, b) => (b.price || 0) - (a.price || 0))
        .slice(0, 6);

    if (bestSellers.length === 0) {
        return null;
    }

    return (
        <section
            id="best-sellers"
            aria-label="Best selling products"
            className="bg-white py-14 sm:py-20"
        >
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-10">
                    <div>
                        <span className="inline-block text-xs sm:text-sm font-bold uppercase tracking-widest text-blue-600 mb-2">
                            Top Picks
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
                            Best Selling Products
                        </h2>
                        <p className="text-gray-600 mt-2 text-sm sm:text-base">
                            Our most popular items, handpicked for you
                        </p>
                    </div>
                    <Link
                        href="#products"
                        className="text-sm sm:text-base font-semibold text-blue-600 hover:text-blue-800 transition self-start sm:self-auto"
                    >
                        View all products →
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                    {bestSellers.map((product) => (
                        <Link
                            key={product._id}
                            href={`/products/${product._id}`}
                            className="group relative flex flex-col bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
                            aria-label={`View ${product.title}`}
                        >
                            {/* "Best Seller" badge */}
                            <span className="absolute top-4 left-4 z-10 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-[10px] sm:text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow">
                                ★ Best Seller
                            </span>

                            <span className="block w-full h-64 sm:h-72 bg-gray-100 overflow-hidden">
                                {product.image ? (
                                    <img
                                        src={product.image}
                                        alt={product.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                ) : (
                                    <span className="w-full h-full flex items-center justify-center text-gray-400">
                                        No image
                                    </span>
                                )}
                            </span>

                            <span className="flex flex-col gap-2 p-6">
                                {product.category && (
                                    <span className="text-[10px] uppercase tracking-widest text-blue-600 font-bold">
                                        {product.category}
                                    </span>
                                )}
                                <span className="text-lg sm:text-xl font-bold text-gray-900 line-clamp-2 group-hover:text-blue-700 transition">
                                    {product.title}
                                </span>
                                {product.description && (
                                    <span className="text-sm text-gray-600 line-clamp-2">
                                        {product.description}
                                    </span>
                                )}
                                <span className="mt-2 flex items-center justify-between">
                                    <span className="text-xl sm:text-2xl font-extrabold text-blue-600">
                                        Tk. {product.price?.toFixed(2) || "0.00"}
                                    </span>
                                    <span className="text-sm font-semibold text-blue-600 group-hover:underline">
                                        Shop now →
                                    </span>
                                </span>
                            </span>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
