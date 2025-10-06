// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// Set axios defaults once to automatically send cookies (credentials) with all API calls
axios.defaults.withCredentials = true; 
const API_BASE_URL = 'http://localhost:8080/api/auth';

interface AuthContextType {
  user: any;
  loading: boolean;
  login: (data: { username: string; password: string }) => Promise<any>;
  logout: () => Promise<void>;
  register: (data: any) => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  // 🔑 IMPORTANT: Start as true to prevent rendering the app before session check is done
  const [loading, setLoading] = useState(true); 

    // 🔑 NEW: Function to check for an existing HTTP-only cookie session
  const checkUserSession = async () => {
    try {
      // Hits the new protected backend route using the existing HTTP-only cookie
      const res = await axios.get(`${API_BASE_URL}/session`); 
      
      if (res.data.user) {
        setUser(res.data.user); // Session found, set user
      }
    } catch (err) {
      // This will catch 401/403 (No token/Invalid token)
      // The error is expected when no cookie is present, so we keep the user null
      console.log('No active session found.');
      setUser(null);
    } finally {
      setLoading(false); // Session check complete, stop loading
    }
  };

  // 🔑 NEW: Run session check once when the component mounts
  useEffect(() => {
    checkUserSession();
  }, []);


  // LOGIN (Updated to use API_BASE_URL)
  const login = async (data: { username: string; password: string }) => {
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/login`, data);

      if (!res.data.user) {
        throw new Error('User not found');
      }

      setUser(res.data.user); // Save logged-in user
      return res.data.user;   
    } catch (err: any) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // LOGOUT (Updated to use API_BASE_URL)
  const logout = async () => {
    setLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/logout`);
      setUser(null);
    } catch (err) {
      console.error('Logout failed', err);
    } finally {
      setLoading(false);
    }
  };

  // REGISTER (Updated to use API_BASE_URL)
  const register = async (data: any) => {
    setLoading(true);
    try {
      const url =
        data.role === 'client'
          ? `${API_BASE_URL}/register/client`
          : `${API_BASE_URL}/register/freelancer`;

      const res = await axios.post(url, data);

      if (res.status === 201 || res.status === 200) {
        return res.data;
      } else {
        throw new Error(res.data?.message || 'Registration failed');
      }
    } catch (err: any) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // 🔑 Prevent rendering children until session check is done
  if (loading) {
    // You should wrap your whole app with AuthProvider and put a simple loading screen here
    return <div className="loading-screen">Authenticating session...</div>; 
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

// CUSTOM HOOK
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};