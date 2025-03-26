'use client';

import React, { useState, useEffect } from 'react';
import { AuthContext } from './context';
import AuthService from './service';
import { User } from './types';
import { useRouter } from 'next/navigation';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const parsedUser: unknown = JSON.parse(storedUser);

          if (isValidUser(parsedUser)) {
            setUser(parsedUser);
          } else {
            localStorage.removeItem('user');
          }
        }
      } catch {
        localStorage.removeItem('user');
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const userData: unknown = await AuthService.login({ email, password });

      if (isValidUser(userData)) {
        setUser(userData);
        router.push('/dashboard');
      } else {
        throw new Error('Invalid user data received');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const signup = async (username: string, email: string, password: string) => {
    try {
      const userData: unknown = await AuthService.signup({ username, email, password });

      if (isValidUser(userData)) {
        setUser(userData);
        router.push('/dashboard');
      } else {
        throw new Error('Invalid user data received');
      }
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  };

  const logout = () => {
    AuthService.logout();
    setUser(null);
    router.push('/login');
  };

  if (isLoading) {
    return null; 
  }

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        login, 
        signup, 
        logout, 
        isAuthenticated: !!user,
        isLoading 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const isValidUser = (data: unknown): data is User => {
  return (
    typeof data === 'object' &&
    data !== null &&
    'id' in data &&
    'username' in data &&
    'email' in data &&
    typeof (data as User).id === 'string' &&
    typeof (data as User).username === 'string' &&
    typeof (data as User).email === 'string'
  );
};
