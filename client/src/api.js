import axios from 'axios';
import { API_URL } from './config';

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_URL,
});

// Add request interceptor for authentication tokens if needed
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;