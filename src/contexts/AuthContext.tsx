import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api'; // Correct path to the frontend API service
import type { User } from '../types'; 

// Define the data and functions that the context will provide
interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: any) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// The provider component that will wrap your entire application
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // On initial app load, check if user data exists in localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Function to handle user login
  const login = async (credentials: any) => {
    setLoading(true);
    try {
      const response = await api.login(credentials);
      const userData = response.data.user; // Assumes backend returns { user: {...} }
      setUser(userData);
      localStorage.setItem('currentUser', JSON.stringify(userData));
      
      // Redirect based on user's role
      navigate(userData.role === 'client' ? '/client-dashboard' : '/freelancer-dashboard');
    } catch (error) {
      console.error("Login failed:", error);
      throw error; // Re-throw the error to be handled by the Login page
    } finally {
      setLoading(false);
    }
  };

  // Function to handle user logout
  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
    navigate('/login');
  };

  const value = { user, loading, login, logout };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Custom hook to easily access the context in any component
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};