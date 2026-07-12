import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Logo from "../components/Logo";
import Button from "../components/Button";

function Home() {
  const { isAuthenticated } = useAuth();

  const rentalCategories = [
    { name: "Electronics", icon: "💻", desc: "High-performance laptops, tablets, and computing gear." },
    { name: "Cameras", icon: "📸", desc: "Professional DSLRs, action cameras, and specialized lenses." },
    { name: "Wearables", icon: "⌚", desc: "Smartwatches, trackers, and modern wearable tech." },
    { name: "Tools", icon: "🛠️", desc: "Power drills, DIY toolkits, and home improvement equipment." },
    { name: "Furniture", icon: "🪑", desc: "Desks, ergonomic chairs, and temporary home setups." },
    { name: "Vehicles", icon: "🚗", desc: "Bicycles, electric scooters, and local transport options." },
    { name: "Home Appliances", icon: "🔌", desc: "Mixers, blenders, vacuum cleaners, and appliances." },
  ];

  return (
    <div className="bg-slate-50 min-h-screen font-sans text-slate-800 antialiased overflow-x-hidden">
      
      {/* Custom Embedded CSS for Premium Animations */}
      <style>{`
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }
        @keyframes float-medium {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes float-fast {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }
        @keyframes rotate-slow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.4; filter: drop-shadow(0 0 1px rgba(59, 130, 246, 0.2)); }
          50% { opacity: 0.8; filter: drop-shadow(0 0 10px rgba(59, 130, 246, 0.4)); }
        }
        @keyframes dash {
          to {
            stroke-dashoffset: -20;
          }
        }
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(16px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-float-1 { animation: float-slow 6s ease-in-out infinite; }
        .animate-float-2 { animation: float-medium 7s ease-in-out infinite 1s; }
        .animate-float-3 { animation: float-fast 5s ease-in-out infinite 0.5s; }
        .animate-float-4 { animation: float-slow 8s ease-in-out infinite 2s; }
        .animate-float-5 { animation: float-medium 6s ease-in-out infinite 1.5s; }
        .animate-float-6 { animation: float-fast 7s ease-in-out infinite 2.5s; }
        .animate-rotate-ring { transform-origin: center; animation: rotate-slow 24s linear infinite; }
        .animate-pulse-glow { animation: pulse-glow 3s ease-in-out infinite; }
        .animate-dash-line { stroke-dasharray: 5, 5; animation: dash 2.5s linear infinite; }
        .animate-hero-left { animation: fade-in-up 0.9s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>

      {/* 1. Hero Section */}
      <section className="relative bg-white border-b border-slate-100 py-20 md:py-32 overflow-hidden">
        {/* Very light radial gradient background behind the illustration */}
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-blue-500/5 to-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-16 relative z-10">
          <div className="w-full lg:w-1/2 space-y-7 text-center lg:text-left animate-hero-left">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] text-slate-900">
              Rent Anything <br/>
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Around You.</span>
            </h1>
            <p className="text-base sm:text-lg text-slate-500 max-w-lg mx-auto lg:mx-0 leading-relaxed font-normal">
              RentEase connects you with verified neighbors in your locality to share and rent everyday items—from cameras and laptops to bicycles and home appliances.
            </p>
            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 pt-1">
              <Button
                to="/dashboard"
                variant="primary"
                className="px-8 shadow-md shadow-blue-500/10 hover:shadow-lg hover:shadow-blue-500/20 transform hover:-translate-y-0.5 active:translate-y-0 transition duration-200"
              >
                Browse Products
              </Button>
              <Button
                to={isAuthenticated ? "/add-product" : "/login"}
                variant="outline"
                className="px-8 border-slate-200 hover:bg-slate-50 transform hover:-translate-y-0.5 active:translate-y-0 transition duration-200"
              >
                List Your Product
              </Button>
            </div>
          </div>

          <div className="w-full lg:w-1/2 flex justify-center relative">
            {/* Premium modern interactive layout */}
            <div className="relative w-full max-w-sm aspect-square flex items-center justify-center">
              
              {/* Background Concentric Rings & Dashed Connections */}
              <svg viewBox="0 0 400 400" className="w-full h-full text-blue-500/20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="hub-gradient" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#3B82F6" />
                    <stop offset="100%" stopColor="#6366F1" />
                  </linearGradient>
                  <linearGradient id="line-gradient" x1="0" y1="0" x2="400" y2="400">
                    <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#6366F1" stopOpacity="0.25" />
                  </linearGradient>
                </defs>
                
                {/* Concentric rotating dashes */}
                <circle cx="200" cy="200" r="115" stroke="url(#line-gradient)" strokeWidth="1.5" strokeDasharray="5 5" className="animate-rotate-ring" />
                <circle cx="200" cy="200" r="135" stroke="url(#line-gradient)" strokeWidth="1" strokeDasharray="3 9" className="animate-rotate-ring" style={{ animationDirection: 'reverse', animationDuration: '30s' }} />
                
                {/* Dashed flowing lines showing connections */}
                <line x1="200" y1="200" x2="200" y2="60" stroke="#3B82F6" strokeWidth="1.5" className="animate-dash-line opacity-30" />
                <line x1="200" y1="200" x2="295" y2="145" stroke="#3B82F6" strokeWidth="1.5" className="animate-dash-line opacity-30" />
                <line x1="200" y1="200" x2="295" y2="255" stroke="#3B82F6" strokeWidth="1.5" className="animate-dash-line opacity-30" />
                <line x1="200" y1="200" x2="200" y2="340" stroke="#3B82F6" strokeWidth="1.5" className="animate-dash-line opacity-30" />
                <line x1="200" y1="200" x2="105" y2="255" stroke="#3B82F6" strokeWidth="1.5" className="animate-dash-line opacity-30" />
                <line x1="200" y1="200" x2="105" y2="145" stroke="#3B82F6" strokeWidth="1.5" className="animate-dash-line opacity-30" />
                
                {/* Central Hub with pulsing glow */}
                <g className="animate-pulse-glow">
                  <circle cx="200" cy="200" r="32" fill="url(#hub-gradient)" />
                  <circle cx="200" cy="200" r="39" stroke="#3B82F6" strokeWidth="1.5" strokeOpacity="0.4" />
                  <text x="200" y="206" textAnchor="middle" fill="white" fontWeight="900" fontSize="13" fontFamily="system-ui">RE</text>
                </g>
              </svg>
              
              {/* Floating Glassmorphic Badges containing Everyday Items */}
              {/* 1. Laptop (💻) - top */}
              <div className="absolute top-[35px] left-[175px] w-[50px] h-[50px] bg-white/75 backdrop-blur-md border border-slate-200/80 rounded-2xl flex items-center justify-center shadow-lg animate-float-1 hover:scale-110 hover:shadow-xl transition cursor-pointer select-none">
                <span className="text-xl">💻</span>
              </div>
              
              {/* 2. Camera (📸) - top right */}
              <div className="absolute top-[120px] right-[40px] w-[50px] h-[50px] bg-white/75 backdrop-blur-md border border-slate-200/80 rounded-2xl flex items-center justify-center shadow-lg animate-float-2 hover:scale-110 hover:shadow-xl transition cursor-pointer select-none">
                <span className="text-xl">📸</span>
              </div>
              
              {/* 3. Chair (🪑) - bottom right */}
              <div className="absolute bottom-[120px] right-[40px] w-[50px] h-[50px] bg-white/75 backdrop-blur-md border border-slate-200/80 rounded-2xl flex items-center justify-center shadow-lg animate-float-3 hover:scale-110 hover:shadow-xl transition cursor-pointer select-none">
                <span className="text-xl">🪑</span>
              </div>
              
              {/* 4. Watch (⌚) - bottom */}
              <div className="absolute bottom-[35px] left-[175px] w-[50px] h-[50px] bg-white/75 backdrop-blur-md border border-slate-200/80 rounded-2xl flex items-center justify-center shadow-lg animate-float-4 hover:scale-110 hover:shadow-xl transition cursor-pointer select-none">
                <span className="text-xl">⌚</span>
              </div>
              
              {/* 5. Bicycle (🚲) - bottom left */}
              <div className="absolute bottom-[120px] left-[40px] w-[50px] h-[50px] bg-white/75 backdrop-blur-md border border-slate-200/80 rounded-2xl flex items-center justify-center shadow-lg animate-float-5 hover:scale-110 hover:shadow-xl transition cursor-pointer select-none">
                <span className="text-xl">🚲</span>
              </div>
              
              {/* 6. Tools (🔨) - top left */}
              <div className="absolute top-[120px] left-[40px] w-[50px] h-[50px] bg-white/75 backdrop-blur-md border border-slate-200/80 rounded-2xl flex items-center justify-center shadow-lg animate-float-6 hover:scale-110 hover:shadow-xl transition cursor-pointer select-none">
                <span className="text-xl">🔨</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. What can you rent Section */}
      <section className="py-24 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <h2 className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-2.5">Catalog</h2>
            <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">What can you rent?</h3>
            <p className="text-slate-500 text-sm mt-3 leading-relaxed">
              Explore everyday high-value items available for rent in your immediate vicinity.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {rentalCategories.map((cat, idx) => (
              <div
                key={idx}
                className="bg-slate-50 p-6 rounded-2xl border border-slate-200/50 flex flex-col items-center sm:items-start text-center sm:text-left hover:bg-white hover:shadow-lg hover:border-blue-300 transition duration-300 group cursor-pointer"
              >
                <span className="text-4xl mb-4 group-hover:scale-110 transition duration-200">{cat.icon}</span>
                <span className="text-sm font-bold text-slate-800 mb-2">{cat.name}</span>
                <p className="text-slate-500 text-xs leading-relaxed">{cat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. How RentEase Works Section */}
      <section className="py-24 bg-slate-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2.5">Process</h2>
            <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">How RentEase Works</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="bg-white p-8 rounded-2xl border border-slate-200/50 text-center space-y-4 shadow-sm hover:shadow-md transition">
              <div className="bg-blue-50 w-12 h-12 rounded-full flex items-center justify-center text-xl mx-auto border border-blue-100">
                ✍️
              </div>
              <h4 className="text-base font-bold text-slate-900">List your item</h4>
              <p className="text-slate-500 text-xs leading-relaxed max-w-xs mx-auto">
                Snap some pictures, describe its condition, specify your locality, and select your daily rental rate.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl border border-slate-200/50 text-center space-y-4 shadow-sm hover:shadow-md transition">
              <div className="bg-blue-50 w-12 h-12 rounded-full flex items-center justify-center text-xl mx-auto border border-blue-100">
                🔍
              </div>
              <h4 className="text-base font-bold text-slate-900">Discover nearby rentals</h4>
              <p className="text-slate-500 text-xs leading-relaxed max-w-xs mx-auto">
                Explore listings offered in your immediate locality. Filter by category, keywords, or coordinate distance.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl border border-slate-200/50 text-center space-y-4 shadow-sm hover:shadow-md transition">
              <div className="bg-blue-50 w-12 h-12 rounded-full flex items-center justify-center text-xl mx-auto border border-blue-100">
                🛡️
              </div>
              <h4 className="text-base font-bold text-slate-900">Rent safely</h4>
              <p className="text-slate-500 text-xs leading-relaxed max-w-xs mx-auto">
                Book secure rentals, get coordinate contact details for the owner, and pick up your item locally.
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* 4. Minimalist Footer */}
      <footer className="bg-white text-slate-400 py-6 border-t border-slate-100 text-xs text-center">
        <p className="text-slate-400 font-normal">© RentEase</p>
      </footer>
    </div>
  );
}

export default Home;
