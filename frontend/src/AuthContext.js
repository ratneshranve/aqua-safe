import React, { createContext, useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import API_URL from './config';


export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const localUser = localStorage.getItem('user');
      return localUser ? JSON.parse(localUser) : null;
    } catch (err) {
      console.error("AuthContext: Failed to parse user from localStorage", err);
      localStorage.removeItem('user');
      return null;
    }
  });
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
      const newSocket = io(API_URL);
      
      newSocket.on('connect', () => {
        newSocket.emit('joinRoom', { userId: user._id, role: user.role });
      });

      setSocket(newSocket);

      return () => newSocket.disconnect();
    } else {
      localStorage.removeItem('user');
      if (socket) {
        socket.disconnect();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, socket }}>
      {children}
    </AuthContext.Provider>
  );
};
