"use client"

import { createContext, useContext, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

type AuthContextType = {
  isLoggedIn: boolean;
  role: string;
  isSidebarOpen: boolean;
  login: (token: string, role: string) => void;
  logout: () => void;
  toggleSidebar: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  let initialLoggedIn = false;
  let initialRole = '';
  try {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      const storedRole = localStorage.getItem('role');
      if (token && storedRole) {
        initialLoggedIn = true;
        initialRole = storedRole;
      }
    }
  } catch (error) {
    console.error('Error accessing localStorage:', error);
    toast.error('Failed to initialize session. Please try again.');
  }

  const [isLoggedIn, setIsLoggedIn] = useState(initialLoggedIn);
  const [role, setRole] = useState(initialRole);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();

  const login = (token: string, role: string) => {
    try {
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
      setIsLoggedIn(true);
      setRole(role);
      router.push('/');
      toast.success('Signed in successfully');
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Sign-in failed. Please try again.');
    }
  };

  const logout = () => {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      setIsLoggedIn(false);
      setRole('');
      router.push('/login');
      toast.success('Signed out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Sign-out failed. Please try again.');
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, role, isSidebarOpen, login, logout, toggleSidebar }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}