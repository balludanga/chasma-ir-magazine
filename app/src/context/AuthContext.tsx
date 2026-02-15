import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { User, AuthContextType, AuthState } from '@/types';
import { mockUsers } from '@/data/mockData';

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
    
    // Find user by email (in real app, validate password)
    const user = mockUsers.find(u => u.email === email);
    
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Check if user role matches expected role (for dedicated login pages)
    if (expectedRole && user.role !== expectedRole) {
      throw new Error(`This login is for ${expectedRole}s only. Please use the appropriate login page.`);
    }
    
    // Save to localStorage
    localStorage.setItem('chasma_user', JSON.stringify(user));
    
    setState({
      user,
      isAuthenticated: true,
      isLoading: false,
    });
  }, []);

  const signup = useCallback(async (name: string, email: string, _password: string, role: 'reader' | 'writer') => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Check if email already exists
    const existingUser = mockUsers.find(u => u.email === email);
    if (existingUser) {
      throw new Error('Email already registered');
    }
    
    // Create new user
    const newUser: User = {
      id: `user_${Date.now()}`,
      name,
      email,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
      role,
      joinedAt: new Date().toISOString().split('T')[0],
      subscribers: 0,
      isActive: true,
    };
    
    // Save to localStorage
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
