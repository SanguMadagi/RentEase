import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import ErrorBoundary from "./ErrorBoundary";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ProductProvider } from "./context/ProductContext";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import OtpVerification from "./pages/OtpVerification";
import ProductList from "./pages/ProductList";
import ProductDetails from "./pages/ProductDetails";
import AddProduct from "./pages/AddProduct";
import OAuthCallback from "./pages/OAuthCallback";
import Profile from "./pages/Profile";
import AadhaarVerification from "./pages/AadhaarVerification";
import Payment from "./pages/Payment";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import SetPassword from "./pages/SetPassword";

import * as sessionUtils from "./utils/session";

/* ---------------------------------------------------------
   USER ACTIVITY TRACKER
----------------------------------------------------------*/
function ActivityTracker() {
  const { isAuthenticated, updateActivity, logout } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) return;

    const events = ["mousemove", "keydown", "click", "touchstart", "scroll"];
    const handleActivity = () => updateActivity();

    events.forEach((evt) =>
      window.addEventListener(evt, handleActivity, { passive: true })
    );

    const checkSession = () => {
      if (!sessionUtils.isSessionValid()) {
        logout("You were logged out due to inactivity. Please sign in again.");
      }
    };

    checkSession();
    const interval = setInterval(checkSession, 5 * 60 * 1000);
    window.addEventListener("online", handleActivity);

    return () => {
      events.forEach((evt) => window.removeEventListener(evt, handleActivity));
      clearInterval(interval);
      window.removeEventListener("online", handleActivity);
    };
  }, [isAuthenticated, updateActivity, logout]);

  return null;
}

/* ---------------------------------------------------------
   LOGOUT TOAST — Tailwind version
----------------------------------------------------------*/
function LogoutToast() {
  const [show, setShow] = React.useState(false);
  const [message, setMessage] = React.useState("");

  useEffect(() => {
    const savedMessage = sessionStorage.getItem("logoutMessage");
    if (savedMessage) {
      setMessage(savedMessage);
      setShow(true);
      sessionStorage.removeItem("logoutMessage");

      setTimeout(() => setShow(false), 5000);
    }
  }, []);

  if (!show) return null;

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded shadow-lg animate-fade-in">
        <div className="flex justify-between items-center">
          <strong className="font-bold">RentEase</strong>
          <button
            onClick={() => setShow(false)}
            className="ml-4 text-blue-700 font-bold"
          >
            ×
          </button>
        </div>
        <div className="mt-2">{message || "You have been logged out."}</div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------
   APP ROUTES
----------------------------------------------------------*/
function AppRoutes() {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Auth pages should not show the Navbar
  const authPaths = [
    "/login",
    "/register",
    "/verify-otp",
    "/forgot-password",
    "/reset-password",
    "/set-password",
    "/oauth2/callback",
  ];
  const showNavbar = !authPaths.includes(location.pathname);

  return (
    <>
      <ActivityTracker />
      <LogoutToast />
      {showNavbar && <Navbar />}
      <div className={showNavbar ? "pt-16" : ""}>
        <Routes>
          {/* PUBLIC ROUTES */}
          <Route path="/" element={<Home />} />
          <Route
            path="/login"
            element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />}
          />
          <Route
            path="/register"
            element={
              isAuthenticated ? <Navigate to="/dashboard" replace /> : <Register />
            }
          />
          <Route path="/verify-otp" element={<OtpVerification />} />
          <Route path="/oauth2/callback" element={<OAuthCallback />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/set-password" element={<SetPassword />} />

          {/* PROTECTED ROUTES */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <ProductList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/product/:id"
            element={
              <ProtectedRoute>
                <ProductDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add-product"
            element={
              <ProtectedRoute>
                <AddProduct />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add-product/:id"
            element={
              <ProtectedRoute>
                <AddProduct />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/verify-aadhaar"
            element={
              <ProtectedRoute>
                <AadhaarVerification />
              </ProtectedRoute>
            }
          />
          <Route
            path="/payment"
            element={
              <ProtectedRoute>
                <Payment />
              </ProtectedRoute>
            }
          />

          {/* FALLBACK */}
          <Route
            path="*"
            element={<Navigate to={isAuthenticated ? "/dashboard" : "/"} replace />}
          />
        </Routes>
      </div>
    </>
  );
}

/* ---------------------------------------------------------
   MAIN APP WRAPPER
----------------------------------------------------------*/
function App() {
  return (
    <ErrorBoundary>
      <Router>
        <AuthProvider>
          <ProductProvider>
            <AppRoutes />
          </ProductProvider>
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
