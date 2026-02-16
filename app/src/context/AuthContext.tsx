import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { AuthContextType, AuthState, User } from '@/types';

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Use relative path in production (Vercel) to avoid localhost issues
const API_URL = import.meta.env.PROD ? '/api' : (import.meta.env.VITE_API_URL || '/api');

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>(initialState);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const navigate = useNavigate();

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

  const login = useCallback(async (email: string, _password: string) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: _password })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Login failed');
      }

      const user = await response.json();

      localStorage.setItem('chasma_user', JSON.stringify(user));
      setState({
        user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }, []);

  const signup = useCallback(async (name: string, email: string, _password: string) => {
    try {
      const response = await fetch(`${API_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password: _password, role: 'reader' })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Signup failed');
      }

      const newUser = await response.json();

      // Automatically login after signup?
      // For now, just return success or login.
      // The original code updated registered users but didn't auto-login?
      // Ah, the original code added to `localStorage` but didn't `setState`.
      // It seems the UI expects the user to login after signup or maybe it auto-logins?
      // Let's match original behavior: just create user.
      // Wait, original: `localStorage.setItem('chasma_registered_users', ...)`
      // It didn't call `setState`. So no auto-login.
      
      return newUser;
    } catch (error) {
       console.error('Signup error:', error);
       throw error;
    }
  }, []);

  const updateProfile = useCallback(async (updates: Partial<User>) => {
    if (!state.user) return;

    try {
      const response = await fetch(`${API_URL}/users/${state.user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });

      if (!response.ok) throw new Error('Failed to update profile');

      const updatedUser = await response.json();
      const newUser = { ...state.user, ...updatedUser };
      
      localStorage.setItem('chasma_user', JSON.stringify(newUser));
      setState(prev => ({ ...prev, user: newUser }));
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  }, [state.user]);

  const logout = useCallback(() => {
    localStorage.removeItem('chasma_user');
    setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
    navigate('/');
  }, [navigate]);

  const openAuthModal = useCallback(() => setIsAuthModalOpen(true), []);
  const closeAuthModal = useCallback(() => setIsAuthModalOpen(false), []);

  return (
    <AuthContext.Provider value={{ 
      ...state, 
      login, 
      signup, 
      logout, 
      updateProfile,
      openAuthModal,
      closeAuthModal,
      isAuthModalOpen 
    }}>
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
