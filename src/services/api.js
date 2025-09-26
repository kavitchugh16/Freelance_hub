// client/src/services/api.js

import axios from 'axios';

// Create an Axios instance with a base URL.
// All requests made with this instance will be prefixed with '/api'.
// In development, this will be proxied to your backend server (e.g., http://localhost:5000/api).
const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to add the auth token to every request if it exists.
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken'); // Or wherever you store your token
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


// --- API Functions ---

export const api = {
  // === Auth ===
  login: (credentials) => apiClient.post('/auth/login', credentials),
  register: (userData) => apiClient.post('/auth/register', userData),

  // === Projects ===
  getAllProjects: () => apiClient.get('/projects'),
  getProjectById: (id) => apiClient.get(`/projects/${id}`),
  createProject: (projectData) => apiClient.post('/projects', projectData),

  // === Bids ===
  getBidsForProject: (projectId) => apiClient.get(`/projects/${projectId}/bids`),
  submitBid: (projectId, bidData) => apiClient.post(`/projects/${projectId}/bids`, bidData),

  // === User Profile ===
  getUserProfile: (userId) => apiClient.get(`/users/${userId}`),
  updateUserProfile: (userId, profileData) => apiClient.put(`/users/${userId}`, profileData),
  
  // === Milestones ===
  getMilestonesForProject: (projectId) => apiClient.get(`/projects/${projectId}/milestones`),
  updateMilestone: (milestoneId, status) => apiClient.patch(`/milestones/${milestoneId}`, { status }),
  
  // === Wallet/Payments ===
  getWalletBalance: () => apiClient.get('/wallet/balance'),
  getTransactions: () => apiClient.get('/wallet/transactions'),
};

export default api;