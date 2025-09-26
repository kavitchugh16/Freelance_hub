// src/services/api.ts

import axios from 'axios';

// Create a pre-configured Axios instance to communicate with the backend
const apiClient = axios.create({
  baseURL: 'http://localhost:8080/api', // The base URL for your backend server
  withCredentials: true, // This is crucial for sending cookies with requests
  headers: {
    'Content-Type': 'application/json',
  },
});

// Define a service object that exports functions for each API endpoint
export const api = {
  login: (credentials: any) => apiClient.post('/auth/login', credentials),
  // You will add other functions here, e.g., register, logout, getProjects, etc.
};

export default api;