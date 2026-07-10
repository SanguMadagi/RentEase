//import React from "react";
//import { Link } from "react-router-dom";
//import { Navbar as BootstrapNavbar, Nav, Container } from "react-bootstrap";
//import { useAuth } from "../context/AuthContext";
//import LogoutButton from "./Auth/LogoutButton";
//
//const Navbar = () => {
//  const { isAuthenticated } = useAuth();
//
//  return (
//    <BootstrapNavbar bg="primary" variant="dark" expand="lg" className="mb-4">
//      <Container>
//        <BootstrapNavbar.Brand as={Link} to="/">
//          🏠 RentEase
//        </BootstrapNavbar.Brand>
//        <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
//        <BootstrapNavbar.Collapse id="basic-navbar-nav">
//          <Nav className="me-auto">
//            <Nav.Link as={Link} to="/">
//              Products
//            </Nav.Link>
//            {isAuthenticated && (
//              <>
//                <Nav.Link as={Link} to="/add-product">
//                  Add Product
//                </Nav.Link>
//                {/* AI Assistant removed for main branch */}
//              </>
//            )}
//          </Nav>
//          <Nav>
//            {isAuthenticated ? (
//              <>
//                <Nav.Link as={Link} to="/profile">
//                  Profile
//                </Nav.Link>
//                <LogoutButton className="ms-2" />
//              </>
//            ) : (
//              <>
//                <Nav.Link as={Link} to="/login">
//                  Login
//                </Nav.Link>
//                <Nav.Link as={Link} to="/register">
//                  Register
//                </Nav.Link>
//              </>
//            )}
//          </Nav>
//        </BootstrapNavbar.Collapse>
//      </Container>
//    </BootstrapNavbar>
//  );
//};
//
//export default Navbar;

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LogoutButton from "./Auth/LogoutButton";

const Navbar = () => {
  const { isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-blue-600 text-white mb-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <Link to="/" className="text-xl font-bold">
            🏠 RentEase
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
                to="/"
                className="px-3 py-2 rounded hover:bg-blue-500 transition"
              >
                Products
              </Link>

              {isAuthenticated && (
                <Link
                  to="/add-product"
                  className="px-3 py-2 rounded hover:bg-blue-500 transition"
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
                    className="px-3 py-2 rounded hover:bg-blue-500 transition"
                  >
                    Profile
                  </Link>
                  <LogoutButton className="mt-2 lg:mt-0" />
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="px-3 py-2 rounded hover:bg-blue-500 transition"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="px-3 py-2 rounded hover:bg-blue-500 transition"
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
