"use client";

import Link from "next/link";

/**
 * PromotionalBanner
 * -----------------
 * Full-width gradient blue promo strip.
 * - Big bold headline with a shimmer / sliding effect on the offer text
 * - Subtext below
 * - "Shop Now" CTA with subtle pulse animation
 * - Pure CSS keyframes (see globals.css)
 */
export default function PromotionalBanner() {
    return (
        <section
            aria-label="Special offer promotional banner"
            className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 py-12 sm:py-16"
        >
            {/* Decorative blurred circles for extra visual interest */}
            <div className="pointer-events-none absolute -top-10 -left-10 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
            <div className="pointer-events-none absolute -bottom-10 -right-10 w-64 h-64 bg-yellow-400/10 rounded-full blur-3xl" />

            <div className="relative max-w-7xl mx-auto px-4 text-center">
                {/* Badge */}
                <span className="inline-block bg-yellow-400 text-blue-900 text-xs sm:text-sm font-bold uppercase tracking-widest px-4 py-1.5 rounded-full shadow-md mb-5">
                    Limited Time
                </span>

                {/* Headline with shimmer overlay on the offer text */}
                <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight">
                    <span className="block">Special Offer</span>
                    <span className="relative inline-block mt-2">
                        <span className="shimmer-text bg-gradient-to-r from-yellow-300 via-white to-yellow-300 bg-clip-text text-transparent">
                            Up to 30% OFF
                        </span>
                    </span>
                </h2>

                <p className="mt-5 text-white/90 text-base sm:text-lg max-w-2xl mx-auto">
                    Grab your favorites at unbeatable prices. Don&rsquo;t miss out
                    on our biggest sale of the season.
                </p>

                <div className="mt-8">
                    <Link
                        href="/products"
                        className="promo-cta inline-block bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-bold text-base sm:text-lg py-3 px-8 sm:py-4 sm:px-10 rounded-full shadow-lg transition-colors duration-200"
                    >
                        Shop Now →
                    </Link>
                </div>
            </div>
        </section>
    );
}
