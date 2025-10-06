// src/services/api.ts
import axios from 'axios';

const API_URL = 'http://localhost:8080/api/auth';

const api = {
  register: async (data: any) => {
    // Decide endpoint based on role
    const endpoint = data.role === 'freelancer' 
      ? '/register/freelancer' 
      : '/register/client';

    return axios.post(API_URL + endpoint, data, { withCredentials: true });
  },

  login: async (data: any) => {
    return axios.post(API_URL + '/login', data, { withCredentials: true });
  },

  logout: async () => {
    return axios.post(API_URL + '/logout', {}, { withCredentials: true });
  },
};

export default api;
