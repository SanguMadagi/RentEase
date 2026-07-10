//import React, { useEffect } from "react";
//import {
//  BrowserRouter as Router,
//  Routes,
//  Route,
//  Navigate,
//} from "react-router-dom";
//import ErrorBoundary from "./ErrorBoundary";
//import { AuthProvider, useAuth } from "./context/AuthContext";
//import Navbar from "./components/Navbar";
//import ProtectedRoute from "./components/ProtectedRoute";
//
//// Pages
//import Login from "./pages/Login";
//import Register from "./pages/Register";
//import OtpVerification from "./pages/OtpVerification";
//import ProductList from "./pages/ProductList";
//import ProductDetails from "./pages/ProductDetails";
//import AddProduct from "./pages/AddProduct";
//import OAuthCallback from "./pages/OAuthCallback";
//import Profile from "./pages/Profile";
//import AadhaarVerification from "./pages/AadhaarVerification";
//import Payment from "./pages/Payment";
//import ForgotPassword from "./pages/ForgotPassword";
//import ResetPassword from "./pages/ResetPassword";
//import SetPassword from "./pages/SetPassword";
//
////import { ToastContainer, Toast } from "react-bootstrap";
//import * as sessionUtils from "./utils/session";
//
///* ---------------------------------------------------------
//   USER ACTIVITY TRACKER — MERGED FROM OLD VERSION
//----------------------------------------------------------*/
//function ActivityTracker() {
//  const { isAuthenticated, updateActivity, logout } = useAuth();
//
//  useEffect(() => {
//    if (!isAuthenticated) return;
//
//    const events = ["mousemove", "keydown", "click", "touchstart", "scroll"];
//    const handleActivity = () => updateActivity();
//
//    events.forEach((evt) =>
//      window.addEventListener(evt, handleActivity, { passive: true }),
//    );
//
//    const checkSession = () => {
//      if (!sessionUtils.isSessionValid()) {
//        logout("You were logged out due to inactivity. Please sign in again.");
//      }
//    };
//
//    checkSession();
//    const interval = setInterval(checkSession, 5 * 60 * 1000);
//    window.addEventListener("online", handleActivity);
//
//    return () => {
//      events.forEach((evt) => window.removeEventListener(evt, handleActivity));
//      clearInterval(interval);
//      window.removeEventListener("online", handleActivity);
//    };
//  }, [isAuthenticated, updateActivity, logout]);
//
//  return null;
//}
//
///* ---------------------------------------------------------
//   LOGOUT TOAST — MERGED FROM OLD VERSION
//----------------------------------------------------------*/
//function LogoutToast() {
//  const [show, setShow] = React.useState(false);
//  const [message, setMessage] = React.useState("");
//
//  useEffect(() => {
//    const savedMessage = sessionStorage.getItem("logoutMessage");
//    if (savedMessage) {
//      setMessage(savedMessage);
//      setShow(true);
//      sessionStorage.removeItem("logoutMessage");
//
//      setTimeout(() => setShow(false), 5000);
//    }
//  }, []);
//
//  return (
//    <ToastContainer position="top-end" className="p-3" style={{ zIndex: 9999 }}>
//      <Toast show={show} onClose={() => setShow(false)} bg="info">
//        <Toast.Header>
//          <strong className="me-auto">RentEase</strong>
//        </Toast.Header>
//        <Toast.Body>{message || "You have been logged out."}</Toast.Body>
//      </Toast>
//    </ToastContainer>
//  );
//}
//
///* ---------------------------------------------------------
//   APP ROUTES — MERGED CLEAN VERSION
//----------------------------------------------------------*/
//function AppRoutes() {
//  const { isAuthenticated, loading } = useAuth();
//
//  if (loading) {
//    return (
//      <div
//        className="d-flex justify-content-center align-items-center"
//        style={{ height: "100vh" }}
//      >
//        <div>Loading...</div>
//      </div>
//    );
//  }
//
//  return (
//    <>
//      <ActivityTracker />
//      <LogoutToast />
//      <Navbar />
//
//      <Routes>
//        {/* PUBLIC ROUTES */}
//        <Route
//          path="/login"
//          element={isAuthenticated ? <Navigate to="/" replace /> : <Login />}
//        />
//        <Route
//          path="/register"
//          element={isAuthenticated ? <Navigate to="/" replace /> : <Register />}
//        />
//        <Route path="/verify-otp" element={<OtpVerification />} />
//        <Route path="/oauth2/callback" element={<OAuthCallback />} />
//        <Route path="/forgot-password" element={<ForgotPassword />} />
//        <Route path="/reset-password" element={<ResetPassword />} />
//        <Route path="/set-password" element={<SetPassword />} />
//
//        {/* PROTECTED ROUTES */}
//        <Route
//          path="/"
//          element={
//            <ProtectedRoute>
//              <ProductList />
//            </ProtectedRoute>
//          }
//        />
//        <Route
//          path="/product/:id"
//          element={
//            <ProtectedRoute>
//              <ProductDetails />
//            </ProtectedRoute>
//          }
//        />
//        <Route
//          path="/add-product"
//          element={
//            <ProtectedRoute>
//              <AddProduct />
//            </ProtectedRoute>
//          }
//        />
//        <Route
//          path="/add-product/:id"
//          element={
//            <ProtectedRoute>
//              <AddProduct />
//            </ProtectedRoute>
//          }
//        />
//        <Route
//          path="/profile"
//          element={
//            <ProtectedRoute>
//              <Profile />
//            </ProtectedRoute>
//          }
//        />
//        <Route
//          path="/verify-aadhaar"
//          element={
//            <ProtectedRoute>
//              <AadhaarVerification />
//            </ProtectedRoute>
//          }
//        />
//        <Route
//          path="/payment"
//          element={
//            <ProtectedRoute>
//              <Payment />
//            </ProtectedRoute>
//          }
//        />
//
//        {/* FALLBACK */}
//        <Route
//          path="*"
//          element={<Navigate to={isAuthenticated ? "/" : "/login"} replace />}
//        />
//      </Routes>
//    </>
//  );
//}
//
///* ---------------------------------------------------------
//   MAIN APP WRAPPER
//----------------------------------------------------------*/
//function App() {
//  return (
//    <ErrorBoundary>
//      <Router>
//        <AuthProvider>
//          <AppRoutes />
//        </AuthProvider>
//      </Router>
//    </ErrorBoundary>
//  );
//}
//
//export default App;


import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import ErrorBoundary from "./ErrorBoundary";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <>
      <ActivityTracker />
      <LogoutToast />
      <Navbar />

      <Routes>
        {/* PUBLIC ROUTES */}
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/" replace /> : <Login />}
        />
        <Route
          path="/register"
          element={
            isAuthenticated ? <Navigate to="/" replace /> : <Register />
          }
        />
        <Route path="/verify-otp" element={<OtpVerification />} />
        <Route path="/oauth2/callback" element={<OAuthCallback />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/set-password" element={<SetPassword />} />

        {/* PROTECTED ROUTES */}
        <Route
          path="/"
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
          element={<Navigate to={isAuthenticated ? "/" : "/login"} replace />}
        />
      </Routes>
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
          <AppRoutes />
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
