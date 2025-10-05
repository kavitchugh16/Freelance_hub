import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';

interface AuthContextType {
  user: any;
  login: (data: { username: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
  register: (data: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Login function
  const login = async (data: { username: string; password: string }) => {
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:8080/api/auth/login', data);
      setUser(res.data.user); // backend should return { user: {...} }
    } catch (err: any) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
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

  // Register function
  const register = async (data: any) => {
    setLoading(true);
    try {
      let url = '';
      if (data.role === 'client') {
        url = 'http://localhost:8080/api/auth/register/client';
      } else {
        url = 'http://localhost:8080/api/auth/register/freelancer';
      }
      const res = await axios.post(url, data);

      if (res.status === 201 || res.status === 200) {
        // Optionally, automatically log in the user after registration
        // setUser(res.data.user); // Uncomment if backend returns user
      } else {
        throw new Error('Registration failed');
      }
    } catch (err: any) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, register }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
