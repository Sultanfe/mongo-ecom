import Link from "next/link";

/**
 * Footer
 * ------
 * Site-wide footer for the Mirpur Bazaar storefront.
 * Renders a 4-column grid on desktop, 2 columns on tablet, and
 * a single stacked column on mobile.
 */
export default function Footer() {
    return (
        <footer className="bg-gray-900 text-gray-300 mt-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Brand / About */}
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <svg
                                className="w-8 h-8 text-yellow-400"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" />
                            </svg>
                            <span className="text-xl font-bold text-white">
                                Mirpur Bazaar
                            </span>
                        </div>
                        <p className="text-sm leading-relaxed text-gray-400">
                            Your trusted community marketplace for quality
                            products from Mirpur society. Buy and sell locally
                            with confidence.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-white font-semibold mb-4 uppercase tracking-wider text-sm">
                            Quick Links
                        </h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link
                                    href="/"
                                    className="hover:text-yellow-400 transition"
                                >
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/#products"
                                    className="hover:text-yellow-400 transition"
                                >
                                    Products
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/#best-sellers"
                                    className="hover:text-yellow-400 transition"
                                >
                                    Best Sellers
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/about"
                                    className="hover:text-yellow-400 transition"
                                >
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/cart"
                                    className="hover:text-yellow-400 transition"
                                >
                                    Cart
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Customer Service */}
                    <div>
                        <h3 className="text-white font-semibold mb-4 uppercase tracking-wider text-sm">
                            Customer Service
                        </h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link
                                    href="/auth/login"
                                    className="hover:text-yellow-400 transition"
                                >
                                    Login
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/auth/register"
                                    className="hover:text-yellow-400 transition"
                                >
                                    Register
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/dashboard"
                                    className="hover:text-yellow-400 transition"
                                >
                                    My Account
                                </Link>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="hover:text-yellow-400 transition"
                                >
                                    Contact Us
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="hover:text-yellow-400 transition"
                                >
                                    FAQ
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Contact / Newsletter */}
                    <div>
                        <h3 className="text-white font-semibold mb-4 uppercase tracking-wider text-sm">
                            Stay Connected
                        </h3>
                        <p className="text-sm text-gray-400 mb-4">
                            Subscribe to get special offers, free giveaways,
                            and once-in-a-lifetime deals.
                        </p>
                        <form
                            action="#"
                            method="post"
                            className="flex flex-col gap-2"
                        >
                            <input
                                type="email"
                                placeholder="Your email"
                                className="px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400"
                            />
                            <button
                                type="submit"
                                className="px-3 py-2 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-blue-900 font-bold text-sm transition"
                            >
                                Subscribe
                            </button>
                        </form>
                        <div className="flex gap-3 mt-5">
                            {/* Facebook */}
                            <a
                                href="#"
                                aria-label="Facebook"
                                className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-800 hover:bg-blue-600 transition"
                            >
                                <svg
                                    className="w-4 h-4"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M22 12a10 10 0 10-11.6 9.9V14.9H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.4h-1.2c-1.2 0-1.6.8-1.6 1.6V12h2.7l-.4 2.9h-2.3v7A10 10 0 0022 12z" />
                                </svg>
                            </a>
                            {/* Twitter / X */}
                            <a
                                href="#"
                                aria-label="Twitter"
                                className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-800 hover:bg-sky-500 transition"
                            >
                                <svg
                                    className="w-4 h-4"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M22 5.8a8.5 8.5 0 01-2.4.7 4.2 4.2 0 001.8-2.3 8.4 8.4 0 01-2.6 1 4.2 4.2 0 00-7.1 3.8 11.8 11.8 0 01-8.6-4.4 4.2 4.2 0 001.3 5.6 4.2 4.2 0 01-1.9-.5v.1a4.2 4.2 0 003.4 4.1 4.2 4.2 0 01-1.9.1 4.2 4.2 0 003.9 2.9A8.4 8.4 0 012 18.6 11.8 11.8 0 008.4 20.5c7.7 0 11.9-6.4 11.9-11.9v-.5A8.4 8.4 0 0022 5.8z" />
                                </svg>
                            </a>
                            {/* Instagram */}
                            <a
                                href="#"
                                aria-label="Instagram"
                                className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-800 hover:bg-pink-600 transition"
                            >
                                <svg
                                    className="w-4 h-4"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M12 2.2c3.2 0 3.6 0 4.9.1 1.2.1 1.8.3 2.2.4.6.2 1 .5 1.4 1 .5.4.8.8 1 1.4.1.4.3 1 .4 2.2.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c-.1 1.2-.3 1.8-.4 2.2-.2.6-.5 1-1 1.4-.4.5-.8.8-1.4 1-.4.1-1 .3-2.2.4-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2-.1-1.8-.3-2.2-.4-.6-.2-1-.5-1.4-1-.5-.4-.8-.8-1-1.4-.1-.4-.3-1-.4-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.9c.1-1.2.3-1.8.4-2.2.2-.6.5-1 1-1.4.4-.5.8-.8 1.4-1 .4-.1 1-.3 2.2-.4C8.4 2.2 8.8 2.2 12 2.2zm0 1.8c-3.1 0-3.5 0-4.8.1-1 .1-1.5.2-1.9.3-.5.2-.8.4-1.1.7-.3.3-.5.6-.7 1.1-.1.4-.2.9-.3 1.9-.1 1.3-.1 1.7-.1 4.8s0 3.5.1 4.8c.1 1 .2 1.5.3 1.9.2.5.4.8.7 1.1.3.3.6.5 1.1.7.4.1.9.2 1.9.3 1.3.1 1.7.1 4.8.1s3.5 0 4.8-.1c1-.1 1.5-.2 1.9-.3.5-.2.8-.4 1.1-.7.3-.3.5-.6.7-1.1.1-.4.2-.9.3-1.9.1-1.3.1-1.7.1-4.8s0-3.5-.1-4.8c-.1-1-.2-1.5-.3-1.9-.2-.5-.4-.8-.7-1.1-.3-.3-.6-.5-1.1-.7-.4-.1-.9-.2-1.9-.3-1.3-.1-1.7-.1-4.8-.1zM12 7.4a4.6 4.6 0 110 9.2 4.6 4.6 0 010-9.2zm0 7.6a3 3 0 100-6 3 3 0 000 6zm5.8-7.8a1.1 1.1 0 11-2.2 0 1.1 1.1 0 012.2 0z" />
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-gray-500">
                    <p>
                        © {new Date().getFullYear()} Mirpur Bazaar. All rights
                        reserved.
                    </p>
                    <div className="flex gap-4">
                        <a href="#" className="hover:text-yellow-400 transition">
                            Privacy
                        </a>
                        <a href="#" className="hover:text-yellow-400 transition">
                            Terms
                        </a>
                        <a href="#" className="hover:text-yellow-400 transition">
                            Support
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
