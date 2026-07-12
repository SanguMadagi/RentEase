import React from "react";

function Logo({ className = "h-8 w-8 text-blue-600", textClassName = "text-xl font-bold ml-2 text-slate-800", isLight = false }) {
  return (
    <div className="flex items-center">
      {/* Modern product rental logo: a box/package with circular sharing arrow */}
      <img
        src="/logo.svg"
        alt="RentEase Logo"
        className={`${className} ${isLight ? "brightness-0 invert" : ""} transition-transform duration-300 hover:rotate-12`}
      />
      <span className={`${textClassName} tracking-tight select-none`}>
        Rent<span className={isLight ? "text-white" : "text-blue-600"}>Ease</span>
      </span>
    </div>
  );
}

export default Logo;
