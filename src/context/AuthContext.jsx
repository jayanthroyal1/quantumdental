import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token')); // Initialize with stored token
    const [loading, setLoading] = useState(true);

    // Configure axios base URL
    axios.defaults.baseURL = 'http://localhost:5000/api';

    useEffect(() => {
        const checkLoggedIn = async () => {
            const storedToken = localStorage.getItem('token');
            if (storedToken) {
                setToken(storedToken); // Ensure state is in sync
                // Here you might want to validate the token with the backend
                const storedUser = localStorage.getItem('user');
                if (storedUser) {
                    setUser(JSON.parse(storedUser));
                }
            }
            setLoading(false);
        };
        checkLoggedIn();

        // Listen for storage events to sync logout across tabs
        const handleStorageChange = (e) => {
            if (e.key === 'token' && e.newValue === null) {
                // Token removed in another tab -> Logout in this tab
                setToken(null);
                setUser(null);
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    const login = async (email, password) => {
        try {
            const res = await axios.post('/auth/login', { email, password });
            const { token, ...userData } = res.data;
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(userData));
            setToken(token); // Update state
            setUser(userData);
            return { success: true };
        } catch (error) {
            console.error("Login error", error);
            return { success: false, message: error.response?.data?.message || 'Login failed' };
        }
    };

    const signup = async (data) => {
        try {
            await axios.post('/auth/signup', data);
            // Do not auto-login. User must login manually.
            return { success: true };
        } catch (error) {
            console.error("Signup error", error);
            return { success: false, message: error.response?.data?.message || 'Signup failed' };
        }
    };

    const googleLogin = async (credential) => {
        try {
            const res = await axios.post('/auth/google', { credential });
            const { token, ...userData } = res.data;
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(userData));
            setToken(token); // Update state
            setUser(userData);
            return { success: true };
        } catch (error) {
            console.error("Google Login error", error);
            return { success: false, message: error.response?.data?.message || 'Google Login failed' };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null); // Clear state
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, login, signup, googleLogin, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
