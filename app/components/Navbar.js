"use client"
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/app/context/CartContext";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { getTotalItems } = useCart();
  const totalItems = getTotalItems();

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <Link href="/" className="flex items-center space-x-2 hover:opacity-90 transition">
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" />
            </svg>
            <span className="text-xl font-bold hidden sm:inline">Mirpur Bazaar</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            <Link href="/" className="hover:bg-blue-700 px-3 py-2 rounded transition">
              Home
            </Link>
            <Link href="/#products" className="hover:bg-blue-700 px-3 py-2 rounded transition">
              Products
            </Link>
            <Link href="/about" className="hover:bg-blue-700 px-3 py-2 rounded transition">
              About
            </Link>
          </div>

          {/* Cart and Checkout Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/cart" className="relative hover:opacity-90 transition flex items-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
            <Link href="/checkout" className="bg-yellow-500 hover:bg-yellow-600 text-blue-900 font-bold py-2 px-4 rounded transition">
              Checkout
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md hover:bg-blue-700 transition"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link href="/" className="block hover:bg-blue-700 px-3 py-2 rounded transition">
              Home
            </Link>
            <Link href="/#products" className="block hover:bg-blue-700 px-3 py-2 rounded transition">
              Products
            </Link>
            <Link href="/about" className="block hover:bg-blue-700 px-3 py-2 rounded transition">
              About
            </Link>
            <Link href="/cart" className="flex items-center hover:bg-blue-700 px-3 py-2 rounded transition">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Cart {totalItems > 0 && `(${totalItems})`}
            </Link>
            <Link href="/checkout" className="block bg-yellow-500 hover:bg-yellow-600 text-blue-900 font-bold py-2 px-3 rounded transition">
              Checkout
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
