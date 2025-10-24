// src/contexts/SocketContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext'; // Import your Auth hook

// Define the shape of the context value
interface SocketContextType {
  socket: Socket | null;
  onlineUsers: string[]; // Array of user IDs
}

// Create the context
const SocketContext = createContext<SocketContextType | undefined>(undefined);

// Custom hook to use the socket context
export const useSocket = (): SocketContextType => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

// Define props for the provider
interface SocketProviderProps {
  children: ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const { user } = useAuth(); // Get the logged-in user from AuthContext

  useEffect(() => {
    if (user && user._id) {
      // User is logged in, create the socket connection
      const newSocket = io('http://localhost:8080', {
        // Pass the userId to the backend in the handshake query
        query: {
          userId: user._id,
        },
        withCredentials: true,
      });

      setSocket(newSocket);

      // --- Socket Event Listeners ---

      newSocket.on('connect', () => {
        console.log('Socket connected:', newSocket.id);
      });

      // Listen for the list of online users
      newSocket.on('getOnlineUsers', (users: string[]) => {
        setOnlineUsers(users);
      });

      newSocket.on('connect_error', (err) => {
        console.error('Socket connection error:', err.message);
      });

      // --- Cleanup Function ---
      // This runs when the component (or user session) unmounts
      return () => {
        newSocket.close();
        setSocket(null);
      };
    } else {
      // User is logged out
      if (socket) {
        socket.close(); // Close existing connection
        setSocket(null);
      }
    }
  }, [user]); // Re-run this effect when the user object changes

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};