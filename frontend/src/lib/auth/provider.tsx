'use client';

import React, { useState, useEffect } from 'react';
import { AuthContext } from '@/lib/auth/context';
import authService from '@/lib/auth/service';
import { User, AuthTokens } from '@/lib/auth/types';
import { useRouter } from 'next/navigation';
import axiosInstance from '@/lib/axiosInstance';
import { jwtDecode } from 'jwt-decode';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedTokensString = localStorage.getItem('user');
        
        if (storedTokensString) {
          const tokens: AuthTokens = JSON.parse(storedTokensString);

          if (!authService.isTokenExpired(tokens.accessToken)) {
            const userData = await fetchUserProfile(tokens.accessToken);
            if (isValidUser(userData)) {
              setUser(userData);
            }
          } else {
            const newAccessToken = await authService.refreshAccessToken();
            if (newAccessToken) {
              const userData = await fetchUserProfile(newAccessToken);
              if (isValidUser(userData)) {
                setUser(userData);
              }
            }
          }
        }
      } catch (error) {
        console.error('Erro ao inicializar autenticação:', error);
        localStorage.removeItem('user');
        document.cookie = 'accessToken=; path=/; max-age=0';
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const fetchUserProfile = async (token: string) => {
    try {
      const response = await axiosInstance.get('/users/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data.user;
    } catch (error) {
      console.error('Erro ao buscar perfil:', error);
      throw error;
    }
  };

  const extractUserFromToken = (token: string): Partial<User> => {
    try {
      const decoded = jwtDecode<{
        sub: string;
        role?: string;
        username?: string;
        email?: string;
      }>(token);

      return {
        id: decoded.sub,
        role: decoded.role,
        username: decoded.username || 'User',
        email: decoded.email || ''
      };
    } catch (error) {
      console.error('Error decoding token:', error);
      return {};
    }
  };

  const login = async (email: string, password: string) => {
    try {
      await authService.login({ email, password });
      
      const storedTokensString = localStorage.getItem('user');
      if (storedTokensString) {
        const tokens: AuthTokens = JSON.parse(storedTokensString);
        const extractedUser = extractUserFromToken(tokens.accessToken);
        
        if (isValidUser(extractedUser)) {
          setUser(extractedUser);
          router.push('/dashboard');
        } else {
          throw new Error('Invalid user data received');
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const signup = async (username: string, email: string, password: string) => {
    try {
      await authService.signup({ username, email, password });
      
      const storedTokensString = localStorage.getItem('user');
      if (storedTokensString) {
        const tokens: AuthTokens = JSON.parse(storedTokensString);
        const extractedUser = extractUserFromToken(tokens.accessToken);
        
        if (isValidUser(extractedUser)) {
          setUser(extractedUser);
          router.push('/dashboard');
        } else {
          throw new Error('Invalid user data received');
        }
      }
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
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
    typeof (data as User).id === 'string'
  );
};
