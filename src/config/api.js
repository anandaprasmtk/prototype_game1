// API Configuration
// In development: uses localhost:3000
// In production: uses relative URL or VITE_API_URL env variable
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export default API_URL;
