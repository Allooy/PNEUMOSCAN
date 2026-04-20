import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import api from '../api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // ── 1. Restore session from localStorage ──────────────────────────────
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                if (decoded.exp * 1000 < Date.now()) {
                    logout();
                } else {
                    setUser({ email: decoded.sub, role: decoded.role, full_name: decoded.full_name });
                }
            } catch (error) {
                logout();
            }
        }

        // ── 2. Handle magic link hash fragment (#verified=true&access_token=…) ─
        const hash = window.location.hash.substring(1);
        if (hash) {
            const hashParams = new URLSearchParams(hash);
            const verified = hashParams.get('verified');
            const accessToken = hashParams.get('access_token');

            if (verified === 'true' && accessToken) {
                localStorage.setItem('token', accessToken);
                try {
                    const decoded = jwtDecode(accessToken);
                    setUser({ email: decoded.sub, role: decoded.role, full_name: decoded.full_name });
                } catch (e) {
                    console.error('Magic link JWT decode failed:', e);
                }
                // Remove token from URL so it's never bookmarked or visible in history
                window.history.replaceState(null, '', window.location.pathname);
                // Signal the Dashboard to show a welcome banner
                sessionStorage.setItem('justVerified', 'true');
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
