/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react';
import * as authService from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (token && !user) {
        authService.getProfile()
            .then(data => setUser(data))
            .catch(() => logout());
        }
    }, [token, user]);

    const login = async (credentials) => {
        setLoading(true);
        setError(null);
        try {
        const data = await authService.login(credentials);
        setUser(data.user);
        setToken(data.accessToken);
        localStorage.setItem('token', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        } catch (err) {
        if (err.response?.status === 429) {
            setError('Too many login attempts. Please wait 15 minutes before trying again.');
        } else {
            setError(err.response?.data?.message || err.message || 'Login failed');
        }
        throw err;
        } finally {
        setLoading(false);
        }
    };

    const register = async (userData) => {
        setLoading(true);
        setError(null);
        try {
        const data = await authService.register(userData);
        setUser(data.user);
        setToken(data.accessToken);
        localStorage.setItem('token', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        } catch (err) {
        if (err.response?.status === 429) {
            setError('Too many registration attempts. Please wait 15 minutes before trying again.');
        } else {
            setError(err.response?.data?.message || err.message || 'Registration failed');
        }
        throw err;
        } finally {
        setLoading(false);
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, error, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
