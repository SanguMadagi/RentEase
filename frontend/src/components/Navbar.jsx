import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LogoutButton from "./Auth/LogoutButton";
import Logo from "./Logo";
import Button from "./Button";

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
          <div className="hidden md:flex items-center space-x-4">
            <Button
              to="/dashboard"
              variant="ghost"
              className="text-slate-600 hover:text-blue-600 text-sm font-semibold h-10 px-3"
            >
              Explore
            </Button>

            {isAuthenticated && (
              <Button
                to="/add-product"
                variant="ghost"
                className="text-slate-600 hover:text-blue-600 text-sm font-semibold h-10 px-3"
              >
                Lend Item
              </Button>
            )}

            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <Button
                  to="/profile"
                  variant="ghost"
                  className="text-slate-600 hover:text-blue-600 text-sm font-semibold h-10 px-3"
                >
                  My Profile
                </Button>
                <LogoutButton className="h-10 px-4" variant="outline" />
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Button
                  to="/login"
                  variant="ghost"
                  className="text-slate-600 hover:text-blue-600 text-sm font-semibold h-10 px-4"
                >
                  Login
                </Button>
                <Button
                  to="/register"
                  variant="primary"
                  className="h-10 px-4"
                >
                  Register
                </Button>
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
        <div className="px-4 pt-3 pb-5 space-y-3 flex flex-col">
          <Button
            to="/dashboard"
            variant="ghost"
            onClick={() => setIsOpen(false)}
            className="w-full text-slate-700 hover:text-blue-600 justify-start"
          >
            Explore Listings
          </Button>

          {isAuthenticated && (
            <Button
              to="/add-product"
              variant="ghost"
              onClick={() => setIsOpen(false)}
              className="w-full text-slate-700 hover:text-blue-600 justify-start"
            >
              Lend Item
            </Button>
          )}

          <hr className="border-slate-100 my-1" />

          {isAuthenticated ? (
            <div className="space-y-3 flex flex-col">
              <Button
                to="/profile"
                variant="ghost"
                onClick={() => setIsOpen(false)}
                className="w-full text-slate-700 hover:text-blue-600 justify-start"
              >
                My Profile
              </Button>
              <LogoutButton className="w-full" variant="outline" onClick={() => setIsOpen(false)} />
            </div>
          ) : (
            <div className="space-y-3 flex flex-col">
              <Button
                to="/login"
                variant="outline"
                onClick={() => setIsOpen(false)}
                className="w-full"
              >
                Login
              </Button>
              <Button
                to="/register"
                variant="primary"
                onClick={() => setIsOpen(false)}
                className="w-full"
              >
                Register
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
