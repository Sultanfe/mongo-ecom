"use client";
import { useCart } from "@/app/context/CartContext";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, getTotalPrice, clearCart } = useCart();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <p className="text-center text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <svg className="w-24 h-24 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Cart is Empty</h2>
            <p className="text-gray-600 mb-8">Add some products to get started!</p>
            <Link href="/" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg inline-block transition">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const subtotal = getTotalPrice();
  const shipping = subtotal > 500 ? 0 : 150;
  const tax = subtotal * 0.15;
  const total = subtotal + shipping + tax;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              {cart.map((item) => (
                <div key={item._id} className="p-6 border-b border-gray-200 hover:bg-gray-50 transition">
                  <div className="flex gap-6">
                    {/* Product Image */}
                    {item.image && (
                      <div className="w-24 h-24 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    {/* Product Details */}
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">{item.title}</h3>
                          <p className="text-sm text-gray-600">{item.category}</p>
                        </div>
                        <p className="text-lg font-bold text-blue-600">Tk. {item.price}</p>
                      </div>
                      <p className="text-gray-600 text-sm mb-4">{item.description}</p>

                      {/* Quantity and Actions */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center border border-gray-300 rounded-lg">
                          <button
                            onClick={() => updateQuantity(item._id, item.quantity - 1)}
                            className="px-3 py-2 text-gray-600 hover:bg-gray-100 transition"
                          >
                            −
                          </button>
                          <span className="px-4 py-2 font-semibold text-gray-900">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item._id, item.quantity + 1)}
                            className="px-3 py-2 text-gray-600 hover:bg-gray-100 transition"
                          >
                            +
                          </button>
                        </div>

                        <div className="text-right">
                          <p className="text-sm text-gray-600 mb-2">Subtotal</p>
                          <p className="text-lg font-bold text-gray-900">Tk. {(item.price * item.quantity).toFixed(2)}</p>
                        </div>

                        <button
                          onClick={() => removeFromCart(item._id)}
                          className="text-red-600 hover:text-red-800 font-semibold transition"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex gap-4">
              <Link href="/" className="px-6 py-3 border-2 border-gray-300 rounded-lg font-bold text-gray-700 hover:border-blue-600 hover:text-blue-600 transition">
                Continue Shopping
              </Link>
              <button
                onClick={clearCart}
                className="px-6 py-3 text-red-600 hover:text-red-800 font-bold transition"
              >
                Clear Cart
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6 border-b pb-6">
                {cart.map((item) => (
                  <div key={item._id} className="flex justify-between text-gray-600 text-sm">
                    <span>{item.title} x{item.quantity}</span>
                    <span>Tk. {(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-3 mb-6 border-b pb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>Tk. {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? "FREE" : `Tk. ${shipping}`}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax (15%)</span>
                  <span>Tk. {tax.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex justify-between text-xl font-bold text-gray-900 mb-6">
                <span>Total</span>
                <span className="text-blue-600">Tk. {total.toFixed(2)}</span>
              </div>

              <Link href="/checkout" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg text-center block transition mb-3">
                Proceed to Checkout
              </Link>

              <div className="bg-blue-50 p-4 rounded-lg text-sm text-gray-600 space-y-2">
                <p className="flex items-center">
                  <span className="text-green-600 mr-2">✓</span>
                  Secure checkout
                </p>
                <p className="flex items-center">
                  <span className="text-green-600 mr-2">✓</span>
                  Fast delivery
                </p>
                <p className="flex items-center">
                  <span className="text-green-600 mr-2">✓</span>
                  Money-back guarantee
                </p>
                {subtotal > 500 && (
                  <p className="flex items-center text-green-600 font-semibold mt-4">
                    <span className="mr-2">🎉</span>
                    Free Shipping!
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
