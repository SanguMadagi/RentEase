import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LogoutButton from "./Auth/LogoutButton";

const Navbar = () => {
  const { isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-blue-600 text-white mb-4 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <Link to="/" className="text-xl font-bold flex items-center space-x-2 hover:opacity-90 transition">
            <span>🏠 RentEase</span>
          </Link>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white focus:outline-none"
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

          {/* Links */}
          <div
            className={`flex-1 justify-between items-center w-full lg:flex lg:w-auto ${
              isOpen ? "block" : "hidden"
            }`}
          >
            <div className="flex flex-col lg:flex-row lg:space-x-4">
              <Link
                to="/dashboard"
                className="px-3 py-2 rounded hover:bg-blue-500 transition text-sm font-medium"
              >
                Explore Products
              </Link>

              {isAuthenticated && (
                <Link
                  to="/add-product"
                  className="px-3 py-2 rounded hover:bg-blue-500 transition text-sm font-medium"
                >
                  Add Product
                </Link>
              )}
            </div>

            <div className="flex flex-col lg:flex-row lg:space-x-4 mt-2 lg:mt-0">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/profile"
                    className="px-3 py-2 rounded hover:bg-blue-500 transition text-sm font-medium"
                  >
                    Profile
                  </Link>
                  <LogoutButton className="mt-2 lg:mt-0 text-sm font-medium" />
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="px-3 py-2 rounded hover:bg-blue-500 transition text-sm font-medium"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="px-3 py-2 rounded hover:bg-blue-500 transition text-sm font-medium"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
