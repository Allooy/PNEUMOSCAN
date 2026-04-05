import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import api from '../api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                // Check if expired
                if (decoded.exp * 1000 < Date.now()) {
                    logout();
                } else {
                    setUser({ email: decoded.sub, role: decoded.role, full_name: decoded.full_name });
                }
            } catch (error) {
                logout();
            }
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        const formData = new FormData();
        formData.append('username', email); // OAuth2 expects username
        formData.append('password', password);

        const response = await api.post('/auth/token', formData);
        const { access_token } = response.data;

        localStorage.setItem('token', access_token);
        const decoded = jwtDecode(access_token);
        setUser({ email: decoded.sub, role: decoded.role, full_name: decoded.full_name });
        return decoded;
    };

    const setToken = (newToken) => {
        localStorage.setItem('token', newToken);
        const decoded = jwtDecode(newToken);
        setUser({ email: decoded.sub, role: decoded.role, full_name: decoded.full_name });
    };

    const register = async (email, password, fullName, role) => {
        const response = await api.post('/auth/register', {
            email,
            password,
            full_name: fullName,
            role
        });
        return response.data;
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, register, setToken, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
