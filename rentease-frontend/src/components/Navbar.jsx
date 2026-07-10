import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LogoutButton from "./Auth/LogoutButton";
import Logo from "./Logo";

const Navbar = () => {
  const { isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-slate-200 shadow-sm fixed top-0 w-full z-50 h-16 flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex items-center justify-between h-12">
          {/* Logo Brand */}
          <Link to="/" className="flex items-center">
            <Logo textClassName="text-xl font-bold ml-2 text-slate-800" />
          </Link>

          {/* Desktop/Tablet Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/dashboard"
              className="text-slate-600 hover:text-blue-600 transition text-sm font-semibold py-2 px-1"
            >
              Explore
            </Link>

            {isAuthenticated && (
              <Link
                to="/add-product"
                className="text-slate-600 hover:text-blue-600 transition text-sm font-semibold py-2 px-1"
              >
                Lend Item
              </Link>
            )}

            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link
                  to="/profile"
                  className="text-slate-600 hover:text-blue-600 transition text-sm font-semibold py-2 px-1"
                >
                  My Profile
                </Link>
                <LogoutButton className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-4 py-2 rounded-lg text-sm transition" />
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-slate-600 hover:text-blue-600 transition text-sm font-semibold py-2 px-3 rounded-lg"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg text-sm shadow-sm transition"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger menu button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-600 hover:text-slate-900 focus:outline-none p-2"
              aria-label="Toggle menu"
            >
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer (Clean dropdown layout below navbar height) */}
      <div
        className={`md:hidden absolute top-16 left-0 w-full bg-white border-b border-slate-200 shadow-lg z-40 transition-all duration-300 ease-in-out ${
          isOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"
        }`}
      >
        <div className="px-4 pt-2 pb-4 space-y-2 flex flex-col">
          <Link
            to="/dashboard"
            onClick={() => setIsOpen(false)}
            className="text-slate-700 hover:bg-slate-50 hover:text-blue-600 px-3 py-2.5 rounded-lg text-sm font-semibold transition"
          >
            Explore Listings
          </Link>

          {isAuthenticated && (
            <Link
              to="/add-product"
              onClick={() => setIsOpen(false)}
              className="text-slate-700 hover:bg-slate-50 hover:text-blue-600 px-3 py-2.5 rounded-lg text-sm font-semibold transition"
            >
              Lend Item
            </Link>
          )}

          <hr className="border-slate-100 my-1" />

          {isAuthenticated ? (
            <div className="space-y-2 flex flex-col">
              <Link
                to="/profile"
                onClick={() => setIsOpen(false)}
                className="text-slate-700 hover:bg-slate-50 hover:text-blue-600 px-3 py-2.5 rounded-lg text-sm font-semibold transition"
              >
                My Profile
              </Link>
              <div className="px-3">
                <LogoutButton className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2.5 rounded-lg text-sm transition text-center" />
              </div>
            </div>
          ) : (
            <div className="space-y-2 flex flex-col px-3">
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="w-full border border-slate-200 text-slate-700 font-semibold py-2.5 rounded-lg text-sm hover:bg-slate-50 transition text-center"
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={() => setIsOpen(false)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg text-sm transition text-center shadow-sm"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
