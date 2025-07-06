import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from './services/authService';
import { User } from './types/user';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}



export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // Optionally, verify token with backend here or decode to get user info
          // For now, assume token presence means authenticated for initial load
          // A more robust solution would be to verify the token with the backend
          const currentUser = await authService.getCurrentUser(); // Assuming authService has a method to get current user
          if (currentUser) {
            setUser(currentUser);
            setIsAuthenticated(true);
          } else {
            localStorage.removeItem('token');
          }
        } catch (error) {
          console.error('Error verifying token:', error);
          localStorage.removeItem('token');
          setIsAuthenticated(false);
        }
      }
      setLoading(false);
    };
    checkAuthStatus();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { user: loggedInUser, token } = await authService.login(email, password);
      localStorage.setItem('token', token);
      setUser(loggedInUser);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Login failed:', error);
      setIsAuthenticated(false); // Ensure isAuthenticated is false on login failure
      throw error; // Re-throw error to be caught by the login form
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout(); // This should clear the token from localStorage
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
