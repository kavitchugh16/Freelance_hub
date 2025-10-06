// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';

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
  const [loading, setLoading] = useState(false);

  
  // LOGIN
const login = async (data: { username: string; password: string }) => {
  setLoading(true);
  try {
    const res = await axios.post('http://localhost:8080/api/auth/login', data);

    if (!res.data.user) {
      throw new Error('User not found');
    }

    setUser(res.data.user); // Save logged-in user
    return res.data.user;   // <-- return user for Login.tsx
  } catch (err: any) {
    throw err;
  } finally {
    setLoading(false);
  }
};

  // LOGOUT
  const logout = async () => {
    setLoading(true);
    try {
      await axios.post('http://localhost:8080/api/auth/logout');
      setUser(null);
    } catch (err) {
      console.error('Logout failed', err);
    } finally {
      setLoading(false);
    }
  };

  // REGISTER
  const register = async (data: any) => {
    setLoading(true);
    try {
      const url =
        data.role === 'client'
          ? 'http://localhost:8080/api/auth/register/client'
          : 'http://localhost:8080/api/auth/register/freelancer';

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
