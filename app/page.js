"use client"
import {useEffect, useState} from "react";
import Link from "next/link";
import { useCart } from "@/app/context/CartContext";
import AnimatedProducts from "@/app/components/home/sections/AnimatedProducts";
import BestSellers from "@/app/components/home/sections/BestSellers";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState("");
  const [addedItems, setAddedItems] = useState({});
  const { addToCart } = useCart();
  
  useEffect(() => {
    fetch("/api/products")
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error("Error fetching products:", err));
  }, []);

  const handleSearch = async () => {
    if(query.trim()) {
      const res = await fetch("/api/ai-search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ query })
      });
      const data = await res.json();
      setProducts(data);
    }
  }

  const handleAddToCart = (product) => {
    addToCart(product);
    setAddedItems((prev) => ({
      ...prev,
      [product._id]: true,
    }));
    setTimeout(() => {
      setAddedItems((prev) => ({
        ...prev,
        [product._id]: false,
      }));
    }, 2000);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Animated product showcase - sits at the very top of the home page */}
      <AnimatedProducts />

      {/* Static Best Selling Products grid - larger than the featured section above */}
      <BestSellers />

      <div className="py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Products</h1>
        <p className="text-gray-600 mb-12">Discover our amazing collection from Mirpur Bazaar</p>

        <div className="flex gap-3 mb-8">
          <input value={query} onChange={(e) => setQuery(e.target.value)} type="text" placeholder="Search products..." className="flex-1 rounded-lg border border-slate-300 bg-white py-2 px-4 text-gray-700 placeholder-gray-400 focus:border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500" /> 
          <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 cursor-pointer rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold" onClick={handleSearch}>Search</button>
        </div>

        <div id="products" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <div key={product._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col">
              <Link href={`/products/${product._id}`}>
                {product.image && (
                  <div className="w-full h-64 bg-gray-200 overflow-hidden cursor-pointer">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
              </Link>
              <div className="p-6 flex-1 flex flex-col">
                {product.category && (
                  <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full mb-3 w-fit">
                    {product.category}
                  </span>
                )}
                <Link href={`/products/${product._id}`}>
                  <h2 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 hover:text-blue-600 transition cursor-pointer">{product.title}</h2>
                </Link>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-2xl font-bold text-blue-600">Tk. {product.price?.toFixed(2) || "0.00"}</span>
                  <button 
                    onClick={() => handleAddToCart(product)}
                    className={`font-semibold py-2 px-4 rounded-lg transition-colors duration-200 ${
                      addedItems[product._id]
                        ? "bg-green-600 text-white hover:bg-green-700"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                  >
                    {addedItems[product._id] ? "✓ Added" : "Add to Cart"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {products.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No products available</p>
          </div>
        )}
      </div>
      </div>
    </div>
  );
}
