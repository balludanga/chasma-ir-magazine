import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { User, AuthContextType, AuthState } from '@/types';

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>(initialState);

  // Check for saved session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('chasma_user');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setState({
          user,
          isAuthenticated: true,
          isLoading: false,
        });
      } catch {
        localStorage.removeItem('chasma_user');
        setState({ ...initialState, isLoading: false });
      }
    } else {
      setState({ ...initialState, isLoading: false });
    }
  }, []);

  const login = useCallback(async (email: string, _password: string, expectedRole?: 'reader' | 'writer' | 'admin') => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    const adminEmail = import.meta.env.VITE_ADMIN_EMAIL as string | undefined;
    const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD as string | undefined;
    const adminName = (import.meta.env.VITE_ADMIN_NAME as string | undefined) || 'Admin User';

    if (adminEmail && adminPassword && email === adminEmail && _password === adminPassword) {
      if (expectedRole && expectedRole !== 'admin') {
        throw new Error(`This login is for ${expectedRole}s only. Please use the appropriate login page.`);
      }
      const adminUser: User = {
        id: 'admin',
        name: adminName,
        email: adminEmail,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${adminEmail}`,
        role: 'admin',
        joinedAt: new Date().toISOString().split('T')[0],
        isActive: true,
      };
      localStorage.setItem('chasma_user', JSON.stringify(adminUser));
      setState({
        user: adminUser,
        isAuthenticated: true,
        isLoading: false,
      });
      return;
    }

    const savedUsers = localStorage.getItem('chasma_registered_users');
    const registered: User[] = savedUsers ? JSON.parse(savedUsers) : [];
    const found = registered.find(u => u.email === email);
    if (!found) {
      throw new Error('Invalid email or password');
    }
    if (expectedRole && found.role !== expectedRole) {
      throw new Error(`This login is for ${expectedRole}s only. Please use the appropriate login page.`);
    }
    localStorage.setItem('chasma_user', JSON.stringify(found));
    setState({
      user: found,
      isAuthenticated: true,
      isLoading: false,
    });
  }, []);

  const signup = useCallback(async (name: string, email: string, _password: string, role: 'reader' | 'writer') => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    const savedUsers = localStorage.getItem('chasma_registered_users');
    const registered: User[] = savedUsers ? JSON.parse(savedUsers) : [];
    const existingUser = registered.find(u => u.email === email);
    if (existingUser) {
      throw new Error('Email already registered');
    }
    const newUser: User = {
      id: `user_${Date.now()}`,
      name,
      email,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
      role,
      joinedAt: new Date().toISOString().split('T')[0],
      isActive: true,
    };
    const updated = [...registered, newUser];
    localStorage.setItem('chasma_registered_users', JSON.stringify(updated));
    localStorage.setItem('chasma_user', JSON.stringify(newUser));
    setState({
      user: newUser,
      isAuthenticated: true,
      isLoading: false,
    });
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('chasma_user');
    setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  }, []);

  const value: AuthContextType = {
    ...state,
    login,
    signup,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
