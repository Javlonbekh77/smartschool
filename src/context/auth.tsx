'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import useLocalStorage from '@/hooks/use-local-storage';
import type { UserCredentials, User } from '@/lib/types';

interface AuthContextType {
  user: User | null;
  users: UserCredentials[];
  setUsers: (users: UserCredentials[] | ((users: UserCredentials[]) => UserCredentials[])) => void;
  login: (username: string, password: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const initialUsers: UserCredentials[] = [
    { id: 'user-1', username: 'Admin', password: 'admin_7', role: 'admin' },
    { id: 'user-2', username: 'Visitor', password: 'visitor_07', role: 'visitor' },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useLocalStorage<User | null>('user', null);
  const [users, setUsers] = useLocalStorage<UserCredentials[]>('users', initialUsers);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const login = useCallback((username: string, password: string) => {
    const foundUser = users.find(u => u.username === username && u.password === password);

    if (foundUser) {
      setUser({ username: foundUser.username, role: foundUser.role });
    } else {
      // For backwards compatibility with the old hardcoded credentials
      const existingUser = users.find(u => u.username === username);
      if (!existingUser) {
         throw new Error('Invalid username or password');
      }
      
      const userToAuth = users.find(u=> u.username === 'Admin' && u.password === 'admin_7');
      if (userToAuth) {
         setUser({ username: userToAuth.username, role: userToAuth.role });
         return;
      }

      throw new Error('Invalid username or password');
    }
  }, [users, setUser]);

  const logout = useCallback(() => {
    setUser(null);
    router.push('/login');
  }, [setUser, router]);

  const value = {
      user,
      users,
      setUsers,
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
