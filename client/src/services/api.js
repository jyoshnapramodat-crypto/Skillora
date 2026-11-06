import axios from 'axios';

// Base API URL configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 15000
});

// Key used in browser storage for JWT authentication token
export const TOKEN_STORAGE_KEY = 'skillora_auth_token';

// Helper to get stored auth token
export function getStoredToken() {
  try {
    return localStorage.getItem(TOKEN_STORAGE_KEY);
  } catch (err) {
    return null;
  }
}

// Helper to save auth token
export function setStoredToken(token) {
  try {
    if (token) {
      localStorage.setItem(TOKEN_STORAGE_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
    }
  } catch (err) {
    console.error('Error saving auth token:', err);
  }
}

// Helper to clear auth token on logout
export function clearStoredToken() {
  try {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  } catch (err) {
    console.error('Error clearing auth token:', err);
  }
}

// Request Interceptor: Attach JWT Bearer Token if available
api.interceptors.request.use(
  (config) => {
    const token = getStoredToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Format error messages
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const formattedMessage =
      error.response?.data?.message ||
      error.message ||
      'Unable to connect to Skillora server. Please ensure the backend is running.';
    error.message = formattedMessage;
    return Promise.reject(error);
  }
);

export default api;

