// src/api/axiosInstance.js
import axios from 'axios';
import log from '../utils/log';

// Function to get API URL based on environment
const baseURL = import.meta.env.VITE_API_URL;

// Create an Axios instance with baseURL
const axiosInstance = axios.create({
  baseURL,
});

// Attach the JWT token to every request if it exists
axiosInstance.interceptors.request.use(
  (config) => {
    // Retrieve the user object from localStorage
    const token = JSON.parse(localStorage.getItem('token'));
    log.info('token: ', token);

    if (token) {
      // Add the token to the Authorization header
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // Handle request error
    return Promise.reject(error);
  }
);

export default axiosInstance;
