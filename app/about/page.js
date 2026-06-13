"use client";

import Link from "next/link";

export default function About() {
  const team = [
    {
      name: "Ahmed Hassan",
      role: "Founder & CEO",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
      bio: "Visionary entrepreneur with 10+ years of e-commerce experience",
    },
    {
      name: "Fatima Khan",
      role: "Head of Operations",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
      bio: "Expert in logistics and supply chain management",
    },
    {
      name: "Rajesh Patel",
      role: "Chief Technology Officer",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
      bio: "Tech innovator passionate about platform excellence",
    },
    {
      name: "Sophia Islam",
      role: "Customer Success Manager",
      image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop",
      bio: "Dedicated to exceptional customer service",
    },
  ];

  const testimonials = [
    {
      text: "Mirpur Bazaar has revolutionized how I shop for everyday items. The selection is amazing and delivery is always on time!",
      author: "Tahmina Ahmed",
      role: "Regular Customer",
      rating: 5,
    },
    {
      text: "As a seller, this platform has helped me reach more customers in the community. Great support team!",
      author: "Karim Uddin",
      role: "Vendor Partner",
      rating: 5,
    },
    {
      text: "Best prices, best selection, best service. Mirpur Bazaar is my go-to for all my shopping needs.",
      author: "Noor Hassan",
      role: "Premium Member",
      rating: 5,
    },
  ];

  const features = [
    {
      icon: "🚚",
      title: "Fast Delivery",
      desc: "Get your orders delivered within 2-3 business days to your doorstep",
      href: "/products",
    },
    {
      icon: "🔒",
      title: "Secure Payment",
      desc: "Bank-level security for all your transactions and personal information",
      href: "/checkout",
    },
    {
      icon: "💰",
      title: "Best Prices",
      desc: "Competitive pricing and exclusive deals for community members",
      href: "/products",
    },
    {
      icon: "🔄",
      title: "Easy Returns",
      desc: "30-day money-back guarantee with hassle-free returns",
      href: "/dashboard",
    },
    {
      icon: "👥",
      title: "Community First",
      desc: "Supporting local businesses and building community connections",
      href: "/auth/register",
    },
    {
      icon: "⭐",
      title: "Quality Assurance",
      desc: "All products verified for quality and authenticity",
      href: "/products",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-blue-900 text-white py-20 sm:py-24">
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1553531088-f352590f14c3?w=1200&q=80')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          ></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4">
            Welcome to Mirpur Bazaar
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-blue-100 mb-8">
            Your trusted online marketplace for the Mirpur community
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/products"
              className="bg-white text-blue-600 font-bold py-3 px-8 rounded-lg hover:bg-gray-100 transition"
            >
              Explore Products
            </Link>
            <Link
              href="/auth/register"
              className="border-2 border-white text-white font-bold py-3 px-8 rounded-lg hover:bg-white hover:text-blue-600 transition"
            >
              Join Community
            </Link>
          </div>
        </div>
      </div>

      {/* Story Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="grid md:grid-cols-2 gap-10 md:gap-12 items-center mb-16 sm:mb-20">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              Our Story
            </h2>
            <p className="text-gray-600 text-base sm:text-lg leading-relaxed mb-4">
              Founded in 2023, Mirpur Bazaar emerged from a simple idea: to
              create a dedicated online marketplace that truly serves the Mirpur
              community. We recognized the need for a platform where local
              businesses and residents could connect seamlessly.
            </p>
            <p className="text-gray-600 text-base sm:text-lg leading-relaxed mb-4">
              Starting with just 50 products and a handful of sellers, we have
              grown into a thriving marketplace with hundreds of vendors and
              thousands of satisfied customers. Our commitment to quality,
              affordability, and community has remained unwavering.
            </p>
            <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
              Today, Mirpur Bazaar is proud to be the go-to destination for
              shopping, supporting local entrepreneurs, and building a stronger
              community one transaction at a time.
            </p>
          </div>
          <div className="rounded-lg overflow-hidden shadow-lg">
            <img
              src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop"
              alt="Mirpur Bazaar Community"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 mb-16 sm:mb-20">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 sm:p-12 rounded-lg shadow-lg">
            <h3 className="text-2xl sm:text-3xl font-bold text-blue-900 mb-4">
              Our Mission
            </h3>
            <p className="text-blue-800 text-base sm:text-lg leading-relaxed">
              To create an inclusive, user-friendly online marketplace that
              empowers Mirpur community members to discover quality products,
              support local businesses, and build meaningful connections through
              commerce.
            </p>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-8 sm:p-12 rounded-lg shadow-lg">
            <h3 className="text-2xl sm:text-3xl font-bold text-purple-900 mb-4">
              Our Vision
            </h3>
            <p className="text-purple-800 text-base sm:text-lg leading-relaxed">
              To become the most trusted and preferred marketplace in the Mirpur
              community, setting new standards for customer service, seller
              support, and community engagement in online retail.
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mb-16 sm:mb-20 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg p-8 sm:p-12 shadow-lg">
          <Link
            href="/products"
            className="text-center hover:scale-105 transition-transform"
          >
            <p className="text-4xl sm:text-5xl font-bold mb-2">500+</p>
            <p className="text-blue-100 text-sm sm:text-base">
              Quality Products
            </p>
          </Link>
          <Link
            href="/auth/register"
            className="text-center hover:scale-105 transition-transform"
          >
            <p className="text-4xl sm:text-5xl font-bold mb-2">250+</p>
            <p className="text-blue-100 text-sm sm:text-base">
              Verified Sellers
            </p>
          </Link>
          <Link
            href="/auth/register"
            className="text-center hover:scale-105 transition-transform"
          >
            <p className="text-4xl sm:text-5xl font-bold mb-2">8K+</p>
            <p className="text-blue-100 text-sm sm:text-base">
              Happy Customers
            </p>
          </Link>
          <Link
            href="/products"
            className="text-center hover:scale-105 transition-transform"
          >
            <p className="text-4xl sm:text-5xl font-bold mb-2">50K+</p>
            <p className="text-blue-100 text-sm sm:text-base">
              Orders Delivered
            </p>
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gray-50 py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Mirpur Bazaar?
            </h2>
            <p className="text-lg sm:text-xl text-gray-600">
              We are committed to providing the best shopping experience
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            {features.map((feature, idx) => (
              <Link
                key={idx}
                href={feature.href}
                className="bg-white p-6 sm:p-8 rounded-lg shadow hover:shadow-lg transition group"
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm sm:text-base">
                  {feature.desc}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Meet Our Team
          </h2>
          <p className="text-lg sm:text-xl text-gray-600">
            Passionate professionals dedicated to your success
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          {team.map((member, idx) => (
            <div key={idx} className="text-center group">
              <div className="mb-4 overflow-hidden rounded-lg shadow-lg">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                {member.name}
              </h3>
              <p className="text-blue-600 font-semibold mb-2 text-sm sm:text-base">
                {member.role}
              </p>
              <p className="text-gray-600 text-sm">{member.bio}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              What Our Community Says
            </h2>
            <p className="text-lg sm:text-xl text-gray-600">
              Trusted by thousands of satisfied customers
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {testimonials.map((testimonial, idx) => (
              <div
                key={idx}
                className="bg-white p-6 sm:p-8 rounded-lg shadow-lg"
              >
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-xl">
                      ★
                    </span>
                  ))}
                </div>
                <p className="text-gray-700 text-base sm:text-lg mb-6 leading-relaxed">
                  &ldquo;{testimonial.text}&rdquo;
                </p>
                <div className="border-t pt-4">
                  <p className="font-bold text-gray-900">{testimonial.author}</p>
                  <p className="text-gray-600 text-sm">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Our Core Values
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          <Link
            href="/about"
            className="bg-blue-50 p-6 sm:p-8 rounded-lg text-center hover:bg-blue-100 transition group"
          >
            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">
              🤝
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
              Integrity
            </h3>
            <p className="text-gray-600 text-sm">
              Honest practices and transparent dealings with all stakeholders
            </p>
          </Link>
          <Link
            href="/products"
            className="bg-green-50 p-6 sm:p-8 rounded-lg text-center hover:bg-green-100 transition group"
          >
            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">
              🌟
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
              Excellence
            </h3>
            <p className="text-gray-600 text-sm">
              Committed to delivering the highest quality in everything we do
            </p>
          </Link>
          <Link
            href="/auth/register"
            className="bg-purple-50 p-6 sm:p-8 rounded-lg text-center hover:bg-purple-100 transition group"
          >
            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">
              🌍
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
              Community
            </h3>
            <p className="text-gray-600 text-sm">
              Building connections and supporting our local society
            </p>
          </Link>
          <Link
            href="/about"
            className="bg-orange-50 p-6 sm:p-8 rounded-lg text-center hover:bg-orange-100 transition group"
          >
            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">
              🚀
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
              Innovation
            </h3>
            <p className="text-gray-600 text-sm">
              Constantly improving and adapting to serve you better
            </p>
          </Link>
        </div>
      </div>

      {/* Contact Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-14 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Get In Touch</h2>
          <p className="text-lg sm:text-xl text-blue-100 mb-8">
            Have questions? We would love to hear from you!
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-8">
            <a
              href="mailto:info@mirpurbazaar.com"
              className="bg-blue-700 bg-opacity-50 p-6 rounded-lg backdrop-blur hover:bg-opacity-70 transition"
            >
              <p className="text-lg mb-2">📧 Email</p>
              <p className="text-xl sm:text-2xl font-bold">
                info@mirpurbazaar.com
              </p>
            </a>
            <a
              href="tel:+880212345678"
              className="bg-blue-700 bg-opacity-50 p-6 rounded-lg backdrop-blur hover:bg-opacity-70 transition"
            >
              <p className="text-lg mb-2">📱 Phone</p>
              <p className="text-xl sm:text-2xl font-bold">+880-2-1234-5678</p>
            </a>
            <Link
              href="/products"
              className="bg-blue-700 bg-opacity-50 p-6 rounded-lg backdrop-blur hover:bg-opacity-70 transition"
            >
              <p className="text-lg mb-2">📍 Location</p>
              <p className="text-xl sm:text-2xl font-bold">
                Mirpur, Dhaka, Bangladesh
              </p>
            </Link>
          </div>
          <div className="flex gap-4 justify-center">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-blue-600 w-12 h-12 flex items-center justify-center rounded-full hover:bg-blue-100 transition font-bold text-lg"
              aria-label="Facebook"
            >
              f
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-blue-600 w-12 h-12 flex items-center justify-center rounded-full hover:bg-blue-100 transition font-bold text-lg"
              aria-label="Twitter"
            >
              X
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-blue-600 w-12 h-12 flex items-center justify-center rounded-full hover:bg-blue-100 transition text-lg"
              aria-label="Instagram"
            >
              📷
            </a>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
          Ready to Join Mirpur Bazaar?
        </h2>
        <p className="text-lg sm:text-xl text-gray-600 mb-8">
          Start shopping or become a seller today
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/products"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition"
          >
            Start Shopping
          </Link>
          <Link
            href="/auth/register"
            className="border-2 border-blue-600 text-blue-600 font-bold py-3 px-8 rounded-lg hover:bg-blue-50 transition"
          >
            Become a Seller
          </Link>
        </div>
      </div>
    </div>
  );
}
