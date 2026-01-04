const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:8080";
const BASE_URL = `${API_BASE_URL}/api/products`;
const REVIEW_URL = `${API_BASE_URL}/api/reviews`;

// 👇 Get JWT token
const getToken = () => localStorage.getItem("token");

// Common headers including Authorization
const getHeaders = () => {
  const token = getToken();
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
};

// Calculate distance between two coordinates (Haversine)
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// --- PRODUCTS ---

export const getAllProducts = async (userLat = null, userLon = null) => {
  try {
    let url = BASE_URL;
    if (userLat !== null && userLon !== null)
      url += `?userLat=${userLat}&userLon=${userLon}`;
    const res = await fetch(url, { headers: getHeaders() });
    if (!res.ok) throw new Error(`Failed to fetch products: ${res.status}`);
    return await res.json();
  } catch (err) {
    throw err;
  }
};

export const searchProducts = async (query, userLat = null, userLon = null) => {
  try {
    if (!query) return await getAllProducts(userLat, userLon);
    const url = `${BASE_URL}/search?name=${encodeURIComponent(query)}${userLat && userLon ? `&userLat=${userLat}&userLon=${userLon}` : ""}`;
    const res = await fetch(url, { headers: getHeaders() });
    if (!res.ok) throw new Error(`Search failed: ${res.status}`);
    return await res.json();
  } catch (err) {
    throw err;
  }
};

export const getProductById = async (id) => {
  try {
    const res = await fetch(`${BASE_URL}/${id}`, { headers: getHeaders() });
    if (!res.ok)
      throw new Error(`Failed to fetch product ${id}: ${res.status}`);
    return await res.json();
  } catch (err) {
    throw err;
  }
};

export const addProduct = async (productData) => {
  try {
    const res = await fetch(BASE_URL, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(productData),
    });
    if (!res.ok) throw new Error(`Failed to add product: ${res.status}`);
    return await res.json();
  } catch (err) {
    throw err;
  }
};

export const updateProduct = async (id, productData) => {
  try {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(productData),
    });
    if (!res.ok) throw new Error(`Failed to update product: ${res.status}`);
    return await res.json();
  } catch (err) {
    throw err;
  }
};

// --- REVIEWS ---

export const getReviewsByProduct = async (productId) => {
  try {
    const res = await fetch(`${REVIEW_URL}/product/${productId}`, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error(`Failed to fetch reviews: ${res.status}`);
    return await res.json();
  } catch (err) {
    throw err;
  }
};

export const addReview = async ({ productId, rating, comment }) => {
  try {
    const res = await fetch(REVIEW_URL, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ productId, rating, comment }),
    });
    if (!res.ok) throw new Error(`Failed to add review: ${res.status}`);
    return await res.json();
  } catch (err) {
    throw err;
  }
};

// --- USER PROFILE ---

export const getUserProfile = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/profile`, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error(`Failed to fetch profile: ${res.status}`);
    return await res.json();
  } catch (err) {
    throw err;
  }
};
