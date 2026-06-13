"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";

/**
 * Testimonials
 * ------------
 * 3 hardcoded customer review cards. Each card slides in from
 * an alternating side (left, right, left) the first time the
 * section scrolls into view, via IntersectionObserver.
 *
 * The "Read all reviews" link below the cards links to the
 * about page so the section's CTA is always functional.
 */
const TESTIMONIALS = [
    {
        name: "Rahim Ahmed",
        role: "Verified Buyer",
        rating: 5,
        text: "Amazing quality products and super fast delivery! I've ordered three times from Mirpur Bazaar and every experience has been flawless. Highly recommend!",
    },
    {
        name: "Sumaiya Khan",
        role: "Loyal Customer",
        rating: 5,
        text: "The customer support team is incredibly helpful and the products always match the description. Best online shop in Bangladesh, hands down.",
    },
    {
        name: "Tanvir Hossain",
        role: "Verified Buyer",
        rating: 4,
        text: "Great prices, genuine products, and the return process was painless when I needed to exchange a size. Will definitely shop here again.",
    },
];

function StarRating({ rating }) {
    return (
        <div
            className="flex items-center gap-1"
            aria-label={`${rating} out of 5 stars`}
        >
            {[1, 2, 3, 4, 5].map((i) => (
                <svg
                    key={i}
                    className={`w-5 h-5 ${
                        i <= rating ? "text-yellow-400" : "text-gray-300"
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.922-.755 1.688-1.54 1.118l-3.371-2.448a1 1 0 00-1.175 0l-3.371 2.448c-.784.57-1.838-.196-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.05 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.3-3.957z" />
                </svg>
            ))}
        </div>
    );
}

export default function Testimonials() {
    const sectionRef = useRef(null);

    useEffect(() => {
        const root = sectionRef.current;
        if (!root) return;

        const cards = root.querySelectorAll(".testimonial-card");
        if (!("IntersectionObserver" in window) || cards.length === 0) {
            cards.forEach((c) => c.classList.add("testimonial-card--in"));
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("testimonial-card--in");
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.15 }
        );

        cards.forEach((c) => observer.observe(c));
        return () => observer.disconnect();
    }, []);

    return (
        <section
            ref={sectionRef}
            id="testimonials"
            aria-label="Customer testimonials"
            className="bg-gradient-to-b from-blue-50 to-white py-8 sm:py-10"
        >
            <div className="max-w-7xl mx-auto px-4">
                {/* Compact header */}
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 mb-5">
                    <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900">
                        What Our Customers Say
                    </h2>
                    <Link
                        href="/about"
                        className="text-sm font-semibold text-blue-600 hover:text-blue-800 transition self-start sm:self-auto"
                    >
                        Read all reviews →
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
                    {TESTIMONIALS.map((t, idx) => {
                        // Alternate slide direction: 0 = left, 1 = right, 2 = left
                        const fromLeft = idx % 2 === 0;
                        return (
                            <div
                                key={t.name}
                                style={{ animationDelay: `${idx * 100}ms` }}
                                className={`testimonial-card ${
                                    fromLeft
                                        ? "testimonial-card--left"
                                        : "testimonial-card--right"
                                } flex flex-col bg-white border border-gray-200 rounded-2xl p-5 sm:p-6 shadow-md hover:shadow-xl transition-shadow duration-300`}
                            >
                                <svg
                                    className="w-8 h-8 text-blue-200 mb-2"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M7.17 6C4.32 6 2 8.32 2 11.17V18h6v-6H5c0-1.66 1.34-3 3-3V6zm10 0c-2.85 0-5.17 2.32-5.17 5.17V18h6v-6h-3c0-1.66 1.34-3 3-3V6z" />
                                </svg>

                                <p className="text-gray-700 text-sm leading-relaxed mb-4 flex-1">
                                    &ldquo;{t.text}&rdquo;
                                </p>

                                <StarRating rating={t.rating} />

                                <div className="mt-3 flex items-center gap-3">
                                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-white font-bold">
                                        {t.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900 text-sm">
                                            {t.name}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {t.role}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
