import axios from 'axios';

// Determine API URL based strictly on Vite Environment Variables
// In Vercel, you will set VITE_API_URL to your live backend domain
const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
    baseURL: apiUrl,
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        // Bypass Ngrok free tier browser warning
        config.headers['ngrok-skip-browser-warning'] = 'true';
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Do not redirect if the failure was specifically on the login endpoint itself
            // This prevents the page from refreshing and losing the login error state/modal
            const isAuthRequest = error.config?.url === '/auth/token' || error.config?.url?.includes('/auth/token');
            if (!isAuthRequest) {
                localStorage.removeItem('token');
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;
