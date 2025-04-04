import axios, { Axios } from "axios";
import { useAuth } from "./auth.context";

const api = axios.create({
    baseURL: 'http://localhost:8080',
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request Interceptor
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('auth_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config
    }, (error) => {
        return Promise.reject(error)
    }
)

// Response Interceptor
api.interceptors.request.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        const { logout, refreshToken } = useAuth();

        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const newToken = await refreshToken();
                axios.defaults.headers.common['Authorization'] = `Bearer ${newToken};`;
                originalRequest.headers['Authorization'] = `Bearer ${newToken};`;
                return api(originalRequest);

            } catch (refreshError) {
                logout();
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
)