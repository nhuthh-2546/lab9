'use client';

import React, { createContext, useContext, useState, useCallback, useMemo, type ReactNode } from 'react';
import { storage } from '@/lib/utils';
import { STORAGE_KEYS } from '@/lib/constants';
import type { User } from '@/types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, userData: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Custom hook to access auth context
 * @throws Error if used outside AuthProvider
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Initialize user from storage
 */
function getStoredUser(): User | null {
  const savedUser = storage.get(STORAGE_KEYS.USER);
  if (!savedUser) return null;
  
  try {
    return JSON.parse(savedUser) as User;
  } catch {
    return null;
  }
}

/**
 * Check if user has valid token
 */
function hasValidToken(): boolean {
  return !!storage.get(STORAGE_KEYS.TOKEN);
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(getStoredUser);
  const [isAuthenticated, setIsAuthenticated] = useState(hasValidToken);
  const [isLoading] = useState(false);

  const login = useCallback((token: string, userData: User) => {
    storage.set(STORAGE_KEYS.TOKEN, token);
    storage.set(STORAGE_KEYS.USER, JSON.stringify(userData));
    setUser(userData);
    setIsAuthenticated(true);
  }, []);

  const logout = useCallback(() => {
    storage.remove(STORAGE_KEYS.TOKEN);
    storage.remove(STORAGE_KEYS.USER);
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated,
      isLoading,
      login,
      logout,
    }),
    [user, isAuthenticated, isLoading, login, logout]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
