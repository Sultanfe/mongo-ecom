"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

/**
 * AnimatedProducts
 * ----------------
 * A big, prominent horizontal showcase that animates the user's
 * product pictures and names across the very top of the home page.
 *
 * - Fetches products from /api/products
 * - Duplicates the product list so the marquee can loop seamlessly
 * - Slow, readable scroll speed
 * - Pauses on hover for accessibility
 * - Falls back gracefully if there are no products
 */
export default function AnimatedProducts() {
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
                console.error("AnimatedProducts fetch error:", err);
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
                aria-label="Featured products animation"
                className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 py-10 sm:py-14 overflow-hidden"
            >
                <div className="max-w-7xl mx-auto px-4">
                    <div className="h-40 flex items-center justify-center text-white/80 text-sm">
                        Loading featured products...
                    </div>
                </div>
            </section>
        );
    }

    if (products.length === 0) {
        return null;
    }

    // Prioritize products that have a `featured: true` flag (the new
    // real-image products from the seed), then append the rest.
    const featuredFirst = [
        ...products.filter((p) => p.featured),
        ...products.filter((p) => !p.featured),
    ];

    // Duplicate the list so the marquee animation can loop seamlessly.
    const loopedProducts = [...featuredFirst, ...featuredFirst];

    return (
        <section
            aria-label="Featured products animation"
            className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 py-8 sm:py-12 shadow-md overflow-hidden"
        >
            <div className="max-w-7xl mx-auto px-4 mb-6">
                <h2 className="text-white text-2xl sm:text-3xl font-bold tracking-wide flex items-center gap-3">
                    <span className="inline-block w-3 h-3 bg-yellow-400 rounded-full animate-pulse" />
                    Featured Products
                    <span className="hidden sm:inline-block ml-2 text-sm sm:text-base font-normal text-white/80">
                        · Hover to pause
                    </span>
                </h2>
            </div>

            <div
                className="relative w-full overflow-hidden"
                style={{
                    maskImage:
                        "linear-gradient(to right, transparent, black 5%, black 95%, transparent)",
                    WebkitMaskImage:
                        "linear-gradient(to right, transparent, black 5%, black 95%, transparent)",
                }}
            >
                <div className="marquee-track flex gap-6 sm:gap-8 w-max hover:[animation-play-state:paused]">
                    {loopedProducts.map((product, index) => (
                        <Link
                            key={`${product._id}-${index}`}
                            href={`/products/${product._id}`}
                            className="group flex flex-col w-56 sm:w-64 bg-white text-gray-900 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
                            aria-label={`View ${product.title}`}
                        >
                            <span className="block w-full h-40 sm:h-48 bg-gray-100 overflow-hidden">
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
                            <span className="flex flex-col gap-1 p-4">
                                {product.category && (
                                    <span className="text-[10px] uppercase tracking-wider text-blue-600 font-bold">
                                        {product.category}
                                    </span>
                                )}
                                <span className="text-base sm:text-lg font-bold line-clamp-2 group-hover:text-blue-700 transition">
                                    {product.title}
                                </span>
                                {typeof product.price === "number" && (
                                    <span className="text-sm font-semibold text-blue-600 mt-1">
                                        Tk. {product.price.toFixed(2)}
                                    </span>
                                )}
                            </span>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
