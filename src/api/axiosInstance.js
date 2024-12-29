// src/api/axiosInstance.js
import axios from 'axios';

// Function to get API URL based on environment
const apiUrl = () => {
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:5000';
  } else {
    return 'https://lms-backend-ivory.vercel.app';
  }
};

// Create an Axios instance with baseURL
const axiosInstance = axios.create({
  baseURL: apiUrl(),
});

// Attach the JWT token to every request if it exists
axiosInstance.interceptors.request.use(
  (config) => {
    // Retrieve the user object from localStorage
    const user = JSON.parse(localStorage.getItem('user'));

    if (user && user.token) {
      // Add the token to the Authorization header
      config.headers['Authorization'] = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => {
    // Handle request error
    return Promise.reject(error);
  }
);

export default axiosInstance;
