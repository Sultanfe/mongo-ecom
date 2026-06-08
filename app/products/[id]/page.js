"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useCart } from "@/app/context/CartContext";
import Link from "next/link";

export default function ProductDetail() {
  const params = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch("/api/products");
        const products = await res.json();
        const found = products.find((p) => p._id === params.id);
        setProduct(found);
      } catch (err) {
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchProduct();
    }
  }, [params.id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <p className="text-center text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <Link href="/" className="text-blue-600 hover:text-blue-800">
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <Link href="/" className="text-blue-600 hover:text-blue-800 mb-6 inline-block">
          ← Back to Products
        </Link>

        <div className="grid md:grid-cols-2 gap-12 bg-white rounded-lg shadow-lg p-8">
          {/* Product Image */}
          <div>
            {product.image && (
              <div className="w-full bg-gray-200 rounded-lg overflow-hidden mb-6">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Product Details</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>✓ Quality Assured</li>
                <li>✓ Fast Delivery</li>
                <li>✓ Money-back Guarantee</li>
                <li>✓ Secure Checkout</li>
              </ul>
            </div>
          </div>

          {/* Product Info */}
          <div>
            <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold mb-4">
              {product.category}
            </span>

            <h1 className="text-4xl font-bold text-gray-900 mb-4">{product.title}</h1>

            <div className="flex items-baseline gap-4 mb-6">
              <span className="text-4xl font-bold text-blue-600">Tk. {product.price}</span>
              <span className="text-lg text-gray-500 line-through">Tk. {(product.price * 1.2).toFixed(2)}</span>
              <span className="text-lg font-semibold text-green-600">Save 17%</span>
            </div>

            <div className="flex items-center gap-2 mb-6">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                ))}
              </div>
              <span className="text-gray-600 ml-2">(128 reviews)</span>
            </div>

            <p className="text-gray-700 text-lg mb-8">{product.description}</p>

            <div className="bg-gray-50 p-4 rounded-lg mb-8">
              <h3 className="font-semibold text-gray-900 mb-3">Availability</h3>
              <p className="text-green-600 font-semibold mb-2">✓ In Stock</p>
              <p className="text-gray-600 text-sm">Only 5 left in stock - order soon!</p>
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleAddToCart}
                className={`flex-1 py-3 px-6 rounded-lg font-bold text-white transition ${
                  added
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {added ? "✓ Added to Cart" : "Add to Cart"}
              </button>
              <button className="px-6 py-3 border-2 border-gray-300 rounded-lg font-bold text-gray-700 hover:border-blue-600 hover:text-blue-600 transition">
                ♥ Wishlist
              </button>
            </div>

            <div className="mt-8 pt-8 border-t border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-4">Shipping Information</h3>
              <p className="text-gray-600 mb-2">📦 Free shipping on orders over Tk. 500</p>
              <p className="text-gray-600">⏱️ Delivery in 2-3 business days</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
