/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createContext, useEffect, useState } from 'react';
import { User } from './../components/Interfaces/UserInterface';
import {
  fetchUserInfo,
  loginUser,
  logoutUser,
} from './../services/authService';
export const AuthContext = createContext<any>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const userData = await loginUser(email, password);
      console.log('User data after login:', userData);
      setUser(userData);
      return userData;
    } catch (error) {
      console.error('Error logging in user:', error);
      setUser(null);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await logoutUser();
    setUser(null);
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (token) {
          const userData = await fetchUserInfo();
          setUser(userData);
        }
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
