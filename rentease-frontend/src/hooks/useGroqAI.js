/**
 * Custom hook for Groq AI API integration
 * Calls backend endpoints that use free Groq models
 */
import { useState } from 'react';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

const useGroqAI = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getToken = () => localStorage.getItem('token');

    const makeRequest = async (endpoint, body) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`,
                },
                body: JSON.stringify(body),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ error: 'Request failed' }));
                throw new Error(errorData.error || 'Request failed');
            }

            return await response.json();
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    /**
     * Generate product description from keywords
     */
    const generateProductDescription = async (keywords) => {
        try {
            const data = await makeRequest('/api/ai/product-description', { keywords });
            return data.description;
        } catch (err) {
            throw new Error('Failed to generate description: ' + err.message);
        }
    };

    /**
     * Clean and format address
     */
    const cleanAddress = async (rawAddress) => {
        try {
            const data = await makeRequest('/api/ai/clean-address', { address: rawAddress });
            return data.cleanedAddress;
        } catch (err) {
            throw new Error('Failed to clean address: ' + err.message);
        }
    };

    /**
     * Detect spam or inappropriate content
     */
    const detectSpam = async (text) => {
        try {
            const data = await makeRequest('/api/ai/spam-detect', { text });
            return data.isSpam;
        } catch (err) {
            throw new Error('Failed to detect spam: ' + err.message);
        }
    };

    /**
     * Generate semantic search query
     */
    const smartSearch = async (userQuery) => {
        try {
            const data = await makeRequest('/api/ai/search', { query: userQuery });
            return data;
        } catch (err) {
            throw new Error('Failed to process search: ' + err.message);
        }
    };

    /**
     * Detect product from image
     */
    const detectProductImage = async (base64Image) => {
        try {
            const data = await makeRequest('/api/ai/image-detect', { image: base64Image });
            return data;
        } catch (err) {
            throw new Error('Failed to detect product: ' + err.message);
        }
    };

    return {
        loading,
        error,
        generateProductDescription,
        cleanAddress,
        detectSpam,
        smartSearch,
        detectProductImage,
    };
};

export default useGroqAI;


