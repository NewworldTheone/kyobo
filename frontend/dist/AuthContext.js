import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from './services/authService';
export const AuthContext = createContext(undefined);
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
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
                    }
                    else {
                        localStorage.removeItem('token');
                    }
                }
                catch (error) {
                    console.error('Error verifying token:', error);
                    localStorage.removeItem('token');
                    setIsAuthenticated(false);
                }
            }
            setLoading(false);
        };
        checkAuthStatus();
    }, []);
    const login = async (email, password) => {
        setLoading(true);
        try {
            const { user: loggedInUser, token } = await authService.login(email, password);
            localStorage.setItem('token', token);
            setUser(loggedInUser);
            setIsAuthenticated(true);
            window.location.href = '/'; // Redirect to dashboard or desired page
        }
        catch (error) {
            console.error('Login failed:', error);
            setIsAuthenticated(false); // Ensure isAuthenticated is false on login failure
            throw error; // Re-throw error to be caught by the login form
        }
        finally {
            setLoading(false);
        }
    };
    const logout = () => {
        authService.logout(); // This should clear the token from localStorage
        setUser(null);
        setIsAuthenticated(false);
        window.location.href = '/login'; // Redirect to login page
    };
    const value = {
        user,
        loading,
        isAuthenticated,
        login,
        logout,
    };
    return _jsx(AuthContext.Provider, { value: value, children: children });
}
export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
