"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

/**
 * ShopByCategory
 * --------------
 * Grid of clickable category cards pulled from the database
 * (with sensible defaults so the section is never empty).
 * Each card links to the products page with a `?category=<name>`
 * query param which the products listing page uses to filter.
 *
 * - Categories come from /api/categories (DB-driven, with counts)
 * - Emoji icon + name + product count on each card
 * - Fade-in-up animation on mount with staggered delay
 *   (pure CSS keyframes defined in globals.css)
 */

// Hardcoded fallback categories so the section is always
// rendered even if the DB is empty or the API fails.
const FALLBACK_CATEGORIES = [
    { name: "Electronics", emoji: "💻", count: 0 },
    { name: "Footwear", emoji: "👟", count: 0 },
    { name: "Apparel", emoji: "👕", count: 0 },
    { name: "Kitchen", emoji: "🍳", count: 0 },
    { name: "Sports", emoji: "⚽", count: 0 },
    { name: "Home Decor", emoji: "🛋️", count: 0 },
];

// Cap how many cards we show so the grid stays tidy even
// when the DB has many categories.
const MAX_CATEGORIES = 12;

export default function ShopByCategory() {
    const [categories, setCategories] = useState(FALLBACK_CATEGORIES);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // Small tick so the browser commits the initial (pre-animation)
        // styles before we flip the class, allowing the keyframe to run.
        const t = setTimeout(() => setMounted(true), 30);
        return () => clearTimeout(t);
    }, []);

    useEffect(() => {
        let cancelled = false;
        const load = async () => {
            try {
                const res = await fetch("/api/categories");
                if (!res.ok) throw new Error("Failed to fetch categories");
                const data = await res.json();
                if (cancelled) return;
                const list = Array.isArray(data?.categories) ? data.categories : [];
                if (list.length > 0) {
                    setCategories(list.slice(0, MAX_CATEGORIES));
                }
                // If empty, we keep the fallback so the section still renders.
            } catch (err) {
                console.error("ShopByCategory fetch error:", err);
                // Keep the fallback list on error.
            }
        };
        load();
        return () => {
            cancelled = true;
        };
    }, []);

    return (
        <section
            id="shop-by-category"
            aria-label="Shop by category"
            className="bg-gradient-to-b from-white to-blue-50 py-12 sm:py-16"
        >
            <div className="max-w-7xl mx-auto px-4">
                {/* Compact header — no big eyebrow gap */}
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 mb-8">
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                        Shop by Category
                    </h2>
                    <Link
                        href="/products"
                        className="text-sm sm:text-base font-semibold text-blue-600 hover:text-blue-800 transition self-start sm:self-auto"
                    >
                        Browse all products →
                    </Link>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-5">
                    {categories.map((cat, idx) => (
                        <Link
                            key={cat.name}
                            href={`/products?category=${encodeURIComponent(cat.name)}`}
                            // Staggered fade-in-up — index drives the delay.
                            style={{
                                animationDelay: `${idx * 80}ms`,
                            }}
                            className={`category-card group flex flex-col items-center justify-center bg-white border border-gray-200 rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-xl hover:border-blue-400 hover:-translate-y-1 transition-all duration-300 ${
                                mounted ? "category-card--in" : ""
                            }`}
                            aria-label={`Browse ${cat.name} products`}
                        >
                            <span
                                className="text-4xl sm:text-5xl mb-2 sm:mb-3 group-hover:scale-110 transition-transform duration-300"
                                aria-hidden="true"
                            >
                                {cat.emoji}
                            </span>
                            <span className="text-sm sm:text-base font-bold text-gray-900 group-hover:text-blue-700 text-center transition-colors">
                                {cat.name}
                            </span>
                            {typeof cat.count === "number" && cat.count > 0 && (
                                <span className="text-xs text-gray-500 mt-0.5">
                                    {cat.count} item{cat.count === 1 ? "" : "s"}
                                </span>
                            )}
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
