import React, { createContext, useContext, useState, useCallback } from "react";
import { getAllProducts } from "../services/api";

const ProductContext = createContext();

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProducts must be used within a ProductProvider");
  }
  return context;
};

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Page search, filter, sorting, and scroll position state cache
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("default");
  const [scrollPosition, setScrollPosition] = useState(0);
  
  const [userLocation, setUserLocation] = useState({ lat: null, lon: null });
  const [lastFetched, setLastFetched] = useState(null);

  const fetchProducts = useCallback(async (lat, lon, isBackground = false) => {
    if (!isBackground) {
      setLoading(true);
    }
    setError(null);
    try {
      const data = await getAllProducts(lat, lon);
      const fetchedProducts = Array.isArray(data) ? data : [];
      setProducts(fetchedProducts);
      setLastFetched(Date.now());
    } catch (err) {
      console.error("Failed to fetch products:", err);
      if (!isBackground) {
        setError("Failed to load products. Please try again.");
      }
    } finally {
      if (!isBackground) {
        setLoading(false);
      }
    }
  }, []);

  const value = {
    products,
    setProducts,
    loading,
    setLoading,
    error,
    setError,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    sortBy,
    setSortBy,
    scrollPosition,
    setScrollPosition,
    userLocation,
    setUserLocation,
    lastFetched,
    setLastFetched,
    fetchProducts,
  };

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
};
export default ProductContext;
