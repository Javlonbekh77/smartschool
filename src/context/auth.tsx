'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import useLocalStorage from '@/hooks/use-local-storage';

type UserRole = 'admin' | 'visitor';
interface User {
  username: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ADMIN_USERNAME = 'Admin';
const ADMIN_PASSWORD = 'admin_7';
const VISITOR_USERNAME = 'Visitor';
const VISITOR_PASSWORD = 'visitor_07';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useLocalStorage<User | null>('user', null);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const login = useCallback((username: string, password: string) => {
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      setUser({ username: ADMIN_USERNAME, role: 'admin' });
    } else if (username === VISITOR_USERNAME && password === VISITOR_PASSWORD) {
      setUser({ username: VISITOR_USERNAME, role: 'visitor' });
    } else {
      throw new Error('Invalid username or password');
    }
  }, [setUser]);

  const logout = useCallback(() => {
    setUser(null);
    router.push('/login');
  }, [setUser, router]);

  const value = {
      user,
      login,
      logout
  }

  if (!isMounted) {
    return (
        <div className="flex h-screen w-full items-center justify-center">
            <div>Yuklanmoqda...</div>
        </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
