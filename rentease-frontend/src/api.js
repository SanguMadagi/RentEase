const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8080";
const BASE_URL = `${API_BASE_URL}/api/products`;

// 👇 Get JWT token (after login / OAuth)
const getToken = () => localStorage.getItem("token");

// Calculate distance between two coordinates (Haversine formula)
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; // Distance in km
};

export const getAllProducts = async (userLat = null, userLon = null) => {
  try {
    let url = BASE_URL;
    if (userLat !== null && userLon !== null) {
      url += `?userLat=${userLat}&userLon=${userLon}`;
    }
    
    const token = getToken();
    const headers = {
      "Content-Type": "application/json",
    };
    
    // Only add Authorization header if token exists
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    
    console.log('Fetching products from:', url); // Debug log
    
    const res = await fetch(url, {
      headers: headers,
    });
    
    console.log('Response status:', res.status); // Debug log
    
    if (!res.ok) {
      // If unauthorized (401), clear expired token
      if (res.status === 401) {
        localStorage.removeItem('token');
        console.log('Token expired or invalid, cleared from storage');
      }
      const errorText = await res.text();
      console.error('Error response:', errorText);
      throw new Error(`Failed to fetch products: ${res.status} ${res.statusText}`);
    }
    
    const data = await res.json();
    console.log('Products data:', data); // Debug log
    return data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

export const searchProducts = async (query, userLat = null, userLon = null) => {
  try {
    // URL encode the query to handle special characters
    const encodedQuery = encodeURIComponent(query);
    let url = `${BASE_URL}/search?name=${encodedQuery}`;
    if (userLat !== null && userLon !== null) {
      url += `&userLat=${userLat}&userLon=${userLon}`;
    }
    
    const res = await fetch(url, {
      headers: {
        "Authorization": `Bearer ${getToken()}`,
        "Content-Type": "application/json",
      },
    });
    
    if (!res.ok) {
      throw new Error(`Search failed: ${res.status} ${res.statusText}`);
    }
    
    return await res.json();
  } catch (error) {
    console.error("Error searching products:", error);
    throw error;
  }
};
