// src/services/api.js
import axios from 'axios';
import { API_BASE_URL } from '../utils/constants'; // Ensure this constant is defined

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add the auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Or from Redux state, though local storage is common for initial setup
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling common errors (e.g., token expiration)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Example: If 401 Unauthorized, redirect to login
    if (error.response && error.response.status === 401) {
      // You might want to dispatch a Redux action here to log out the user
      // store.dispatch(logout()); // If you have a Redux store accessible
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/auth?expired=true'; // Redirect to login
    }
    return Promise.reject(error);
  }
);

export default api;