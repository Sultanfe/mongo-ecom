"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

/**
 * NewArrivals
 * -----------
 * Shows up to 4 of the most recently added products. If the
 * API exposes a `createdAt` timestamp we sort by that; otherwise
 * we just take the last 4 entries (assuming the API returns
 * newest-last or newest-first — both work as a sensible proxy).
 *
 * - Same visual style as BestSellers' cards
 * - The whole section is always visible (no opacity gating) so
 *   it can never disappear if an IntersectionObserver fails to
 *   fire. We add a subtle fade-in via a CSS transition instead.
 * - Each card has a hover scale effect
 */
export default function NewArrivals() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [animated, setAnimated] = useState(false);
    const sectionRef = useRef(null);

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
                console.error("NewArrivals fetch error:", err);
                if (!cancelled) setLoading(false);
            }
        };
        load();
        return () => {
            cancelled = true;
        };
    }, []);

    // Trigger the card-stagger animation once products arrive.
    useEffect(() => {
        if (loading) return;
        // Small delay so the browser paints the cards in their
        // pre-animation state before the keyframe runs.
        const t = setTimeout(() => setAnimated(true), 50);
        return () => clearTimeout(t);
    }, [loading]);

    // Sort by createdAt desc if present, else assume the API
    // already returns newest-first; fall back to last 4 of the array.
    const lastFour = (() => {
        if (products.length === 0) return [];
        const withDate = products.filter(
            (p) =>
                p.createdAt && !Number.isNaN(new Date(p.createdAt).getTime())
        );
        if (withDate.length >= 4) {
            return [...products]
                .sort(
                    (a, b) =>
                        new Date(b.createdAt).getTime() -
                        new Date(a.createdAt).getTime()
                )
                .slice(0, 4);
        }
        return products.slice(-4);
    })();

    // If there's nothing to show and we're still loading, show a
    // skeleton-style placeholder. If we finished loading and there
    // are genuinely no products, hide the entire section so we
    // don't leave a useless empty header on the page.
    if (loading) {
        return (
            <section
                aria-label="New arrivals"
                className="bg-gray-50 py-10 sm:py-12"
            >
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 mb-6">
                        <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900">
                            New Arrivals
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        {[1, 2, 3, 4].map((i) => (
                            <div
                                key={i}
                                className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm animate-pulse"
                            >
                                <div className="h-48 sm:h-56 bg-gray-200" />
                                <div className="p-5 space-y-3">
                                    <div className="h-3 bg-gray-200 rounded w-1/3" />
                                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                                    <div className="h-3 bg-gray-200 rounded w-full" />
                                    <div className="h-5 bg-gray-200 rounded w-1/2 mt-2" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (lastFour.length === 0) {
        return null;
    }

    return (
        <section
            ref={sectionRef}
            id="new-arrivals"
            aria-label="New arrivals"
            className="bg-gray-50 py-10 sm:py-12"
        >
            <div className="max-w-7xl mx-auto px-4">
                {/* Compact header */}
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 mb-6">
                    <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900">
                        New Arrivals
                    </h2>
                    <Link
                        href="/products"
                        className="text-sm font-semibold text-blue-600 hover:text-blue-800 transition self-start sm:self-auto"
                    >
                        View all products →
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
                    {lastFour.map((product, idx) => (
                        <Link
                            key={product._id}
                            href={`/products/${product._id}`}
                            style={{
                                animationDelay: animated ? `${idx * 100}ms` : "0ms",
                            }}
                            className={`arrival-card group relative flex flex-col bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 ${
                                animated ? "arrival-card--in" : ""
                            }`}
                            aria-label={`View ${product.title}`}
                        >
                            {/* "New" badge */}
                            <span className="absolute top-3 left-3 z-10 bg-gradient-to-r from-blue-500 to-blue-700 text-white text-[10px] sm:text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow">
                                ✨ New
                            </span>

                            <span className="block w-full h-48 sm:h-56 bg-gray-100 overflow-hidden">
                                {product.image ? (
                                    <img
                                        src={product.image}
                                        alt={product.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                ) : (
                                    <span className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                                        No image
                                    </span>
                                )}
                            </span>

                            <span className="flex flex-col gap-1.5 p-4 sm:p-5">
                                {product.category && (
                                    <span className="text-[10px] uppercase tracking-widest text-blue-600 font-bold">
                                        {product.category}
                                    </span>
                                )}
                                <span className="text-base sm:text-lg font-bold text-gray-900 line-clamp-2 group-hover:text-blue-700 transition">
                                    {product.title}
                                </span>
                                {product.description && (
                                    <span className="text-sm text-gray-600 line-clamp-2">
                                        {product.description}
                                    </span>
                                )}
                                <span className="mt-1 flex items-center justify-between">
                                    <span className="text-lg sm:text-xl font-extrabold text-blue-600">
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
