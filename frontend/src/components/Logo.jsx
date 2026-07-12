import React from "react";

function Logo({ className = "h-8 w-8 text-blue-600", textClassName = "text-xl font-bold ml-2 text-slate-800", isLight = false }) {
  return (
    <div className="flex items-center">
      {/* Modern product rental logo: a box/package with circular sharing arrow */}
      <svg
        className={`${className} transition-transform duration-300 hover:rotate-12`}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Box outline */}
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        {/* Box inner flaps */}
        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
        <line x1="12" y1="22.08" x2="12" y2="12" />
        {/* Circular sharing arrow */}
        <path
          d="M17 17a5 5 0 0 1-5 5"
          strokeDasharray="2,2"
          className="animate-pulse"
        />
      </svg>
      <span className={`${textClassName} tracking-tight select-none`}>
        Rent<span className={isLight ? "text-white" : "text-blue-600"}>Ease</span>
      </span>
    </div>
  );
}

export default Logo;
