"use client"
import {useEffect, useState} from "react";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState("");
  
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

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Products</h1>
        <p className="text-gray-600 mb-12">Discover our amazing collection</p>

        <input value={query} onChange={(e) => setQuery(e.target.value)} type="text" placeholder="Search products..." className="mb-4 w-full rounded-lg border border-slate-300 bg-white text-block py-2 px-4 text-gray-700 placeholder-gray-400 focus:border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500" /> 
        <button className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 mb-4 cursor-pointer rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500" onClick={handleSearch}>Search</button>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <div key={product._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
              {product.image && (
                <div className="w-full h-64 bg-gray-200 overflow-hidden cursor-pointer">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              <div className="p-6">
                {product.category && (
                  <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full mb-3">
                    {product.category}
                  </span>
                )}
                <h2 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">{product.title}</h2>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-gray-900">${product.price?.toFixed(2) || "0.00"}</span>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200">
                    Add to Cart
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
  );
}