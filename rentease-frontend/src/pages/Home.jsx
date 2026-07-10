import React from "react";
import { useAuth } from "../context/AuthContext";
import Logo from "../components/Logo";
import Button from "../components/Button";

function Home() {
  const { isAuthenticated } = useAuth();

  const mockCategories = [
    { name: "Properties & Homes", icon: "🏢", count: "120+ Listings" },
    { name: "Adventure & Outdoors", icon: "🏕️", count: "80+ Listings" },
    { name: "Camera & Electronics", icon: "📸", count: "150+ Listings" },
    { name: "Tools & Equipment", icon: "🛠️", count: "90+ Listings" },
    { name: "Vehicles & Transport", icon: "🚗", count: "40+ Listings" },
    { name: "Events & Party Gear", icon: "🎉", count: "70+ Listings" },
  ];

  const mockPopularProducts = [
    {
      id: "1",
      name: "Cozy 2BHK Apartment",
      image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=400&q=80",
      price: "₹15,000 / month",
      location: "Indiranagar, Bangalore",
      rating: "4.9",
      category: "Properties & Homes",
    },
    {
      id: "2",
      name: "Professional Hiking Gear Kit",
      image: "https://images.unsplash.com/photo-1501555088652-021faa106b9b?auto=format&fit=crop&w=400&q=80",
      price: "₹450 / day",
      location: "HSR Layout, Bangalore",
      rating: "4.8",
      category: "Adventure & Outdoors",
    },
    {
      id: "3",
      name: "Sony Alpha DSLR Camera",
      image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=400&q=80",
      price: "₹800 / day",
      location: "Koramangala, Bangalore",
      rating: "4.7",
      category: "Camera & Electronics",
    },
  ];

  const mockTestimonials = [
    {
      name: "Arjun Mehta",
      role: "Freelance Photographer",
      quote: "Renting a high-end lens from RentEase for my weekend shoot was super smooth. Saved a lot of money instead of buying it!",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&h=100&q=80",
    },
    {
      name: "Priya Sharma",
      role: "Digital Nomad",
      quote: "Found a beautifully furnished flat in Bangalore within an hour of browsing. The landlord verification process is so reassuring.",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&h=100&q=80",
    },
    {
      name: "Vikram Malhotra",
      role: "DIY Hobbyist",
      quote: "I had a heavy-duty lawn mower sitting unused in my garage. Listed it on RentEase and now it earns me consistent passive income!",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&h=100&q=80",
    },
  ];

  return (
    <div className="bg-slate-50 min-h-screen font-sans text-slate-800 antialiased overflow-x-hidden">
      
      {/* 1. Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white overflow-hidden py-24 md:py-36">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center relative z-10 gap-16">
          <div className="w-full lg:w-1/2 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-400/20 rounded-full px-4 py-1.5 text-xs font-semibold text-blue-300">
              <span className="flex h-2 w-2 rounded-full bg-blue-400 animate-ping"></span>
              The Neighborhood Rental Marketplace
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
              Don't Buy it. <br/>
              <span className="bg-gradient-to-r from-blue-400 to-indigo-300 bg-clip-text text-transparent">Rent it in Minutes.</span>
            </h1>
            <p className="text-lg text-slate-300 max-w-xl mx-auto lg:mx-0">
              RentEase lets you rent homes, trekking gears, cameras, tools, and vehicles directly from verified members in your area. Secure circular economy starts here.
            </p>
            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
              <Button
                to="/dashboard"
                variant="primary"
                className="px-8"
              >
                Browse Listings
              </Button>
              <Button
                to={isAuthenticated ? "/add-product" : "/login"}
                variant="outline"
                className="px-8 border-slate-700 hover:bg-slate-800 hover:text-white text-slate-200"
              >
                Start Lending Products
              </Button>
            </div>
          </div>
          <div className="w-full lg:w-1/2 flex justify-center relative">
            <div className="absolute -top-12 -left-12 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl"></div>
            {/* Glassmorphic Showcase Mockup */}
            <div className="relative w-full max-w-md bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 shadow-2xl">
              <div className="absolute -top-3 -right-3 bg-blue-600 text-white text-xs font-bold px-3.5 py-1.5 rounded-full shadow-lg">
                ★ Top Rated Gear
              </div>
              <img
                src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=500&q=80"
                alt="Product Showcase"
                className="w-full h-64 object-cover rounded-2xl mb-4"
              />
              <div className="flex justify-between items-center text-white">
                <div>
                  <h3 className="font-bold text-lg">Sony A7 IV DSLR Kit</h3>
                  <p className="text-xs text-slate-300">Koramangala, Bangalore</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-green-400 block mb-1">Available</span>
                  <span className="font-extrabold text-xl">₹800 <span className="text-xs font-normal">/day</span></span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>
      </section>

      {/* 2. Features Section */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-sm font-bold uppercase tracking-widest text-blue-600 mb-2">Designed for Safety</h2>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            How RentEase protects your experience
          </h3>
          <p className="text-slate-500 mt-4 text-base">
            We've built verified safety protocols right into our product listings to ensure you rent and lend with peace of mind.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition duration-300 flex flex-col justify-between">
            <div>
              <div className="bg-blue-50 text-blue-600 w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-6">
                📍
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-3">Distance Sorting</h4>
              <p className="text-slate-500 text-sm leading-relaxed">
                Rent from people nearby. We sort active items using the Haversine formula so you can pick them up quickly without shipping delays.
              </p>
            </div>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition duration-300 flex flex-col justify-between">
            <div>
              <div className="bg-indigo-50 text-indigo-600 w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-6">
                🛡️
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-3">Aadhaar Verification</h4>
              <p className="text-slate-500 text-sm leading-relaxed">
                Security is our priority. Users can complete simulated digital government identity checks to showcase a verified green badge on their listings.
              </p>
            </div>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition duration-300 flex flex-col justify-between">
            <div>
              <div className="bg-emerald-50 text-emerald-600 w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-6">
                🔒
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-3">OTP Sign-In Shield</h4>
              <p className="text-slate-500 text-sm leading-relaxed">
                Every sensitive profile change, registration, and log-in triggers a 6-digit verification code directly to your email, blocking bot entries.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Categories Section */}
      <section className="py-20 bg-slate-100/60 border-y border-slate-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-sm font-bold uppercase tracking-widest text-blue-600 mb-2">Flexible Catalog</h2>
            <h3 className="text-3xl font-bold text-slate-900 tracking-tight">Browse by Categories</h3>
            <p className="text-slate-500 mt-3 text-sm">Rent everything from real estate to professional DIY power tools.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {mockCategories.map((cat, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200/60 flex flex-col items-center text-center hover:shadow-md hover:border-blue-200 transition group cursor-pointer">
                <span className="text-3xl mb-4 group-hover:scale-110 transition duration-300">{cat.icon}</span>
                <h4 className="text-sm font-bold text-slate-800 mb-1">{cat.name}</h4>
                <span className="text-xs text-slate-400 font-medium">{cat.count}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Popular Products Section */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-16">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-widest text-blue-600 mb-2">Top Rentals</h2>
            <h3 className="text-3xl font-extrabold text-slate-900">Popular items in your area</h3>
          </div>
          <Button
            to="/dashboard"
            variant="ghost"
            className="text-blue-600 font-bold text-sm hover:underline mt-4 sm:mt-0 px-2 h-9"
          >
            See all listings &rarr;
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {mockPopularProducts.map((p) => (
            <div key={p.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-lg transition duration-300 flex flex-col justify-between group">
              <div className="relative overflow-hidden aspect-[4/3]">
                <img
                  src={p.image}
                  alt={p.name}
                  className="w-full h-full object-cover group-hover:scale-[1.03] transition duration-500"
                />
                <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-slate-800 text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full shadow-sm">
                  {p.category}
                </span>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <span className="text-slate-400 text-xs font-semibold block mb-1">📍 {p.location}</span>
                  <h4 className="font-bold text-slate-900 text-lg group-hover:text-blue-600 transition">{p.name}</h4>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-slate-50">
                  <div>
                    <span className="text-xs text-slate-400 block">Rental Price</span>
                    <span className="text-blue-600 font-extrabold text-lg">{p.price}</span>
                  </div>
                  <Button
                    to={isAuthenticated ? `/product/${p.id}` : "/login"}
                    variant="secondary"
                    className="h-10 px-4"
                  >
                    Rent Now
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. How it Works Section */}
      <section className="py-24 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-sm font-bold uppercase tracking-widest text-blue-400 mb-2">Simplicity First</h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight">How RentEase Works</h3>
            <p className="text-slate-400 mt-4 text-sm">Follow three easy steps to start renting or listing active products.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            <div className="text-center space-y-4 relative z-10">
              <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg mx-auto shadow-md">
                1
              </div>
              <h4 className="text-lg font-bold">Discover Items</h4>
              <p className="text-slate-400 text-sm leading-relaxed max-w-xs mx-auto">
                Explore local property lists and gears. Filter by distance or category to find exactly what you need.
              </p>
            </div>
            <div className="text-center space-y-4 relative z-10">
              <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg mx-auto shadow-md">
                2
              </div>
              <h4 className="text-lg font-bold">Verify & Reserve</h4>
              <p className="text-slate-400 text-sm leading-relaxed max-w-xs mx-auto">
                Confirm your identity via secure Aadhaar tags and send inquiries directly to the verified lender.
              </p>
            </div>
            <div className="text-center space-y-4 relative z-10">
              <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg mx-auto shadow-md">
                3
              </div>
              <h4 className="text-lg font-bold">Pick up & Return</h4>
              <p className="text-slate-400 text-sm leading-relaxed max-w-xs mx-auto">
                Coordinate pickup with your neighbor, use the product, and return it safely at the end of the term.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Why Choose RentEase Section */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-16">
        <div className="w-full lg:w-1/2">
          <img
            src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=600&q=80"
            alt="RentEase value proposition"
            className="rounded-3xl shadow-xl border border-slate-100 object-cover w-full h-96"
          />
        </div>
        <div className="w-full lg:w-1/2 space-y-6">
          <h2 className="text-sm font-bold uppercase tracking-widest text-blue-600">Monetize Your Assets</h2>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Stop buying things you only use once.
          </h3>
          <p className="text-slate-500 leading-relaxed text-base">
            RentEase supports local circular economies. Instead of spending thousands on items that gather dust in your closet, rent them for occasional use. If you own tools or gear, rent them out to offset their initial purchase cost.
          </p>
          <div className="space-y-3.5">
            <div className="flex items-start gap-3">
              <span className="text-blue-600 text-lg mt-0.5">✓</span>
              <div>
                <strong className="text-slate-800 text-sm block">Save Storage Space</strong>
                <span className="text-slate-500 text-xs">Rent camping gear, luggage, or tools only when required.</span>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-blue-600 text-lg mt-0.5">✓</span>
              <div>
                <strong className="text-slate-800 text-sm block">Earn Passive Income</strong>
                <span className="text-slate-500 text-xs">Lend cameras, properties, and equipment securely to verified neighbors.</span>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-blue-600 text-lg mt-0.5">✓</span>
              <div>
                <strong className="text-slate-800 text-sm block">Reduce Waste</strong>
                <span className="text-slate-500 text-xs">Help the environment by sharing resources and extending product life cycles.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Testimonials Section */}
      <section className="py-24 bg-slate-100/80 border-t border-slate-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-sm font-bold uppercase tracking-widest text-blue-600 mb-2">User Stories</h2>
            <h3 className="text-3xl font-bold text-slate-900 tracking-tight">What our members say</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {mockTestimonials.map((t, idx) => (
              <div key={idx} className="bg-white p-8 rounded-2xl border border-slate-200/40 shadow-sm flex flex-col justify-between">
                <p className="text-slate-500 italic text-sm leading-relaxed mb-6">
                  "{t.quote}"
                </p>
                <div className="flex items-center gap-4">
                  <img src={t.avatar} alt={t.name} className="w-11 h-11 rounded-full object-cover"/>
                  <div>
                    <h5 className="font-bold text-slate-800 text-sm">{t.name}</h5>
                    <span className="text-slate-400 text-xs">{t.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Call To Action Section */}
      <section className="py-24 bg-gradient-to-br from-blue-600 to-indigo-850 text-white text-center relative overflow-hidden">
        <div className="max-w-3xl mx-auto px-4 relative z-10 space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold">Ready to start renting smart?</h2>
          <p className="text-blue-100 text-base max-w-xl mx-auto">
            Join thousands of neighbors who are already saving money and earning income listing active properties and goods.
          </p>
          <div className="pt-4">
            <Button
              to="/register"
              variant="outline"
              className="bg-white hover:bg-slate-100 text-blue-700 border-none font-bold"
            >
              Create Free Account
            </Button>
          </div>
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-indigo-500/20 via-transparent to-transparent pointer-events-none"></div>
      </section>

      {/* 9. Footer Section */}
      <footer className="bg-slate-900 text-slate-400 py-16 border-t border-slate-800 text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-4">
            <Logo textClassName="text-xl font-bold ml-2 text-white" />
            <p className="text-xs text-slate-500 leading-relaxed">
              RentEase is a localized marketplace connecting neighbors for peer-to-peer asset and property renting, fostering zero-waste community economies.
            </p>
          </div>
          <div>
            <h5 className="text-white font-bold mb-4 uppercase tracking-wider text-xs">Discover</h5>
            <ul className="space-y-2 text-xs">
              <li><Link to="/dashboard" className="hover:text-white transition">Explore Listings</Link></li>
              <li><Link to="/register" className="hover:text-white transition">Become a Lender</Link></li>
              <li><Link to="/login" className="hover:text-white transition">Browse Categories</Link></li>
            </ul>
          </div>
          <div>
            <h5 className="text-white font-bold mb-4 uppercase tracking-wider text-xs">Legal</h5>
            <ul className="space-y-2 text-xs">
              <li><Link to="/" className="hover:text-white transition">Terms of Service</Link></li>
              <li><Link to="/" className="hover:text-white transition">Privacy Policy</Link></li>
              <li><Link to="/" className="hover:text-white transition">Lending Guidelines</Link></li>
            </ul>
          </div>
          <div>
            <h5 className="text-white font-bold mb-4 uppercase tracking-wider text-xs">Contact</h5>
            <p className="text-xs text-slate-500 leading-relaxed">
              Have questions? Reach out to our community support at <span className="text-slate-300">support@rentease.com</span>
            </p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <span>&copy; 2026 RentEase Inc. All rights reserved.</span>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white transition">Twitter</a>
            <a href="#" className="hover:text-white transition">GitHub</a>
            <a href="#" className="hover:text-white transition">LinkedIn</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;
