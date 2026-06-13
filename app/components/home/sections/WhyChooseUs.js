"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";

/**
 * WhyChooseUs
 * -----------
 * 4 feature boxes highlighting the store's value props.
 * Each box uses an IntersectionObserver to trigger a zoom-in
 * animation the first time the user scrolls the box into view.
 *
 * The "Learn more" link on each box links to the relevant area
 * so every clickable element on the page does something useful.
 */
const FEATURES = [
    {
        title: "Free Shipping",
        description: "On all orders over Tk. 500. Fast delivery to your door.",
        href: "/products",
        icon: (
            <svg
                className="w-7 h-7"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 7h13l3 4h2v6h-3a2 2 0 11-4 0H10a2 2 0 11-4 0H3V7zm5 8a2 2 0 100 4 2 2 0 000-4zm10 0a2 2 0 100 4 2 2 0 000-4zM3 7V5a2 2 0 012-2h10"
                />
            </svg>
        ),
    },
    {
        title: "Easy Returns",
        description: "Hassle-free 7-day return policy. No questions asked.",
        href: "/dashboard",
        icon: (
            <svg
                className="w-7 h-7"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v6h6M20 20v-6h-6M4 10a8 8 0 0114-3M20 14a8 8 0 01-14 3"
                />
            </svg>
        ),
    },
    {
        title: "Secure Payment",
        description: "Your transactions are encrypted and 100% safe with us.",
        href: "/checkout",
        icon: (
            <svg
                className="w-7 h-7"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 2l8 4v6c0 5-3.5 9-8 10-4.5-1-8-5-8-10V6l8-4z"
                />
            </svg>
        ),
    },
    {
        title: "24/7 Support",
        description: "Our friendly team is here to help — any time, any day.",
        href: "/about",
        icon: (
            <svg
                className="w-7 h-7"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 11a9 9 0 1118 0v3a2 2 0 01-2 2h-2v-7h4M3 11v3a2 2 0 002 2h2v-7H3"
                />
            </svg>
        ),
    },
];

export default function WhyChooseUs() {
    const sectionRef = useRef(null);

    useEffect(() => {
        const root = sectionRef.current;
        if (!root) return;

        const boxes = root.querySelectorAll(".why-box");
        if (!("IntersectionObserver" in window) || boxes.length === 0) {
            boxes.forEach((b) => b.classList.add("why-box--in"));
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("why-box--in");
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.15 }
        );

        boxes.forEach((b) => observer.observe(b));
        return () => observer.disconnect();
    }, []);

    return (
        <section
            ref={sectionRef}
            id="why-choose-us"
            aria-label="Why choose us"
            className="bg-white py-8 sm:py-10"
        >
            <div className="max-w-7xl mx-auto px-4">
                {/* Compact header */}
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 mb-5">
                    <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900">
                        Why Choose Us
                    </h2>
                    <Link
                        href="/about"
                        className="text-sm font-semibold text-blue-600 hover:text-blue-800 transition self-start sm:self-auto"
                    >
                        Learn more about us →
                    </Link>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                    {FEATURES.map((feature, idx) => (
                        <Link
                            key={feature.title}
                            href={feature.href}
                            style={{ animationDelay: `${idx * 80}ms` }}
                            className="why-box group flex flex-col items-center text-center bg-gradient-to-b from-blue-50 to-white border border-blue-100 rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-xl hover:border-blue-300 hover:-translate-y-1 transition-all duration-300"
                        >
                            <div className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 mb-2 rounded-full bg-blue-600 text-white group-hover:bg-blue-700 transition-colors">
                                {feature.icon}
                            </div>
                            <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-1">
                                {feature.title}
                            </h3>
                            <p className="text-xs sm:text-sm text-gray-600 leading-snug">
                                {feature.description}
                            </p>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
