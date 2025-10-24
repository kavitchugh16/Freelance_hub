// src/services/api.ts
import axios from 'axios';

// Create a central axios instance
const api = axios.create({
  baseURL: 'http://localhost:8080/api', // The base URL for all API calls
  withCredentials: true, // Automatically send cookies with every request
});

// === AUTHENTICATION ===
// ... (registerUser, loginUser, logoutUser, checkSession functions are here) ...
export const registerUser = (data: any) => {
  const endpoint = data.role === 'freelancer' 
    ? '/auth/register/freelancer' 
    : '/auth/register/client';
  return api.post(endpoint, data);
};

export const loginUser = (data: any) => {
  return api.post('/auth/login', data);
};

export const logoutUser = () => {
  return api.post('/auth/logout');
};

export const checkSession = () => {
  return api.get('/auth/session');
};


// === CHAT API ===
// ... (getConversations, getMessages, getOrCreateConversation functions are here) ...
export const getConversations = () => {
  return api.get('/chat/conversations');
};

export const getMessages = (conversationId: string) => {
  return api.get(`/chat/messages/${conversationId}`);
};

export const getOrCreateConversation = (recipientId: string) => {
  return api.post('/chat/conversations', { recipientId });
};


// === PROJECTS ===
// ... (getProjects, getProjectById functions are here) ...
export const getProjects = (query: string = "") => {
  return api.get(`/projects?${query}`);
};

export const getProjectById = (id: string) => {
  return api.get(`/projects/${id}`);
};

// === USERS ===
// --- ADD THIS NEW FUNCTION ---
/**
 * Searches for users by username or full name
 * @param query The search term
 */
export const searchUsers = (query: string) => {
  return api.get(`/users/search?q=${query}`);
};

// Export the instance if you need to use it directly
export default api;