import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Home() {
  const { isAuthenticated } = useAuth();

  const mockShowcase = [
    {
      id: "1",
      name: "Cozy 2BHK Apartment",
      image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=400&q=80",
      price: "₹15,000 / month",
      location: "Indiranagar, Bangalore",
    },
    {
      id: "2",
      name: "Mountain Trekking Gear Kit",
      image: "https://images.unsplash.com/photo-1501555088652-021faa106b9b?auto=format&fit=crop&w=400&q=80",
      price: "₹450 / day",
      location: "HSR Layout, Bangalore",
    },
    {
      id: "3",
      name: "Premium DSLR Camera (Sony Alpha)",
      image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=400&q=80",
      price: "₹800 / day",
      location: "Koramangala, Bangalore",
    },
  ];

  return (
    <div className="bg-slate-50 min-h-screen font-sans">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 to-indigo-800 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 flex flex-col md:flex-row items-center relative z-10">
          <div className="w-full md:w-1/2 space-y-6 text-center md:text-left">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
              Rent anything, <br className="hidden lg:block"/>
              <span className="text-blue-200">right in your community.</span>
            </h1>
            <p className="text-lg text-blue-100 max-w-xl mx-auto md:mx-0">
              RentEase is the neighborhood rental marketplace. Find properties, gear, tools, and electronics nearby. Save money, reduce waste, and lend to trusted neighbors.
            </p>
            <div className="flex flex-col sm:flex-row justify-center md:justify-start gap-4">
              <Link
                to={isAuthenticated ? "/dashboard" : "/login"}
                className="px-8 py-4 bg-white text-blue-700 font-semibold rounded-lg shadow-lg hover:bg-blue-50 transition text-center"
              >
                Browse Listings
              </Link>
              <Link
                to={isAuthenticated ? "/add-product" : "/login"}
                className="px-8 py-4 border border-blue-300 text-white font-semibold rounded-lg hover:bg-blue-700/50 transition text-center"
              >
                List Your Item
              </Link>
            </div>
          </div>
          <div className="w-full md:w-1/2 mt-12 md:mt-0 flex justify-center">
            {/* Dynamic UI Graphic/Preview */}
            <div className="relative w-full max-w-md bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-2xl">
              <div className="absolute -top-3 -left-3 bg-green-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                ★ Highly Trusted
              </div>
              <img
                src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=500&q=80"
                alt="Premium Property"
                className="w-full h-56 object-cover rounded-xl mb-4"
              />
              <div className="flex justify-between items-center text-white">
                <div>
                  <h3 className="font-bold text-lg">Modern Villa Estate</h3>
                  <p className="text-xs text-blue-200">JP Nagar, Bangalore</p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-semibold text-green-300 block">Available Now</span>
                  <span className="font-bold text-lg">₹25,000 /mo</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,_var(--tw-gradient-stops))] from-blue-500/20 via-transparent to-transparent pointer-events-none"></div>
      </section>

      {/* Features Section */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-2">Why RentEase</h2>
          <h3 className="text-3xl sm:text-4xl font-bold text-slate-900 leading-tight">
            Designed for local sharing, built with security
          </h3>
          <p className="text-slate-500 mt-4">
            RentEase combines location-based search and identity verification to provide a smooth, dependable renting experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 hover:-translate-y-1 transition duration-300">
            <div className="bg-blue-50 text-blue-600 w-12 h-12 rounded-lg flex items-center justify-center text-2xl mb-6">
              📍
            </div>
            <h4 className="text-xl font-semibold text-slate-900 mb-3">Nearby Discoveries</h4>
            <p className="text-slate-500 text-sm leading-relaxed">
              Find items sorted by distance from your coordinates. Pick up rentals directly from lenders in your immediate neighborhood.
            </p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 hover:-translate-y-1 transition duration-300">
            <div className="bg-green-50 text-green-600 w-12 h-12 rounded-lg flex items-center justify-center text-2xl mb-6">
              🛡️
            </div>
            <h4 className="text-xl font-semibold text-slate-900 mb-3">Verified Profiles</h4>
            <p className="text-slate-500 text-sm leading-relaxed">
              Rent securely. Built-in digital Aadhaar checks and verified details make sure you are renting to and from verified residents.
            </p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 hover:-translate-y-1 transition duration-300">
            <div className="bg-yellow-50 text-yellow-600 w-12 h-12 rounded-lg flex items-center justify-center text-2xl mb-6">
              ✉️
            </div>
            <h4 className="text-xl font-semibold text-slate-900 mb-3">OTP Guided Inquiries</h4>
            <p className="text-slate-500 text-sm leading-relaxed">
              Sensitive actions, sign-ins, and passwords are protected by fast email-based OTP verification codes.
            </p>
          </div>
        </div>
      </section>

      {/* Property & Rental Showcase */}
      <section className="py-20 bg-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-2">Featured Listings</h2>
              <h3 className="text-3xl font-bold text-slate-900">Explore items available now</h3>
            </div>
            <Link
              to={isAuthenticated ? "/dashboard" : "/login"}
              className="text-blue-600 font-semibold text-sm hover:underline mt-4 sm:mt-0"
            >
              View all listings &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {mockShowcase.map((item) => (
              <div key={item.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition">
                <img src={item.image} alt={item.name} className="w-full h-48 object-cover"/>
                <div className="p-6">
                  <span className="text-xs font-bold text-slate-400 block mb-1">{item.location}</span>
                  <h4 className="font-semibold text-slate-900 text-lg mb-2">{item.name}</h4>
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-blue-600 font-bold">{item.price}</span>
                    <Link
                      to={isAuthenticated ? `/product/${item.id}` : "/login"}
                      className="px-4 py-2 bg-slate-100 text-slate-800 text-xs font-semibold rounded-lg hover:bg-blue-600 hover:text-white transition"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security Banner / Callout */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 text-center md:text-left">
            <h3 className="text-2xl md:text-3xl font-bold text-slate-900">Are you ready to monetize your unused assets?</h3>
            <p className="text-slate-600 text-sm max-w-xl">
              From power tools to camera rigs, vacation homes, and spare vehicles, start listing items safely in minutes and earn extra income.
            </p>
          </div>
          <Link
            to={isAuthenticated ? "/add-product" : "/login"}
            className="px-6 py-3.5 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition shrink-0"
          >
            Start Lending Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center space-x-2">
            <span className="text-white font-bold text-lg">🏠 RentEase</span>
          </div>
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <Link to={isAuthenticated ? "/dashboard" : "/login"} className="hover:text-white transition">Explore Listings</Link>
            <Link to={isAuthenticated ? "/profile" : "/login"} className="hover:text-white transition">My Profile</Link>
            <Link to="/register" className="hover:text-white transition">Sign Up</Link>
          </div>
          <div className="text-xs">
            &copy; 2026 RentEase Inc. Designed to build community-driven circular economies.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;
