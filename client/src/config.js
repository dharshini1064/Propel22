// API Configuration
const getApiUrl = () => {
  // For production on Render or other platforms
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }
  
  // For local development
  return process.env.NODE_ENV === 'production'
    ? '' // Empty string for relative URLs in production (same domain)
    : 'http://localhost:5000';
};

export const API_URL = getApiUrl();