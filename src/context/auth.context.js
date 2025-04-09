import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(sessionStorage.getItem('auth-token'));
    const [isLoading, setIsLoading] = useState(true);
    const apiUrl = 'http://localhost:8080';
    const navigate = useNavigate();

    useEffect(() => {
        const initializeUser = () => {
            const storedToken = sessionStorage.getItem('auth-token');
            if (storedToken) {
                try {
                    const decoded = jwtDecode(storedToken);
                    setUser({
                        id: decoded.id,
                        username: decoded.sub,
                        email: decoded.email,
                        role: decoded.role
                    });
                } catch (error) {
                    console.error("Errore nella decodifica del token:", error);
                    sessionStorage.removeItem('auth-token');
                    setToken(null);
                    setUser(null);
                } finally {
                    setIsLoading(false);
                }
            } else {
                setIsLoading(false);
            }
        };

        initializeUser();
    }, []);

    const login = async (username, password) => {
        setIsLoading(true);
        try {
            const response = await axios.post(`${apiUrl}/auth/login`, { username, password });
            const { token } = response.data;
            sessionStorage.setItem('auth-token', token);
            setToken(token);
            const decoded = jwtDecode(token);
            setUser({
                id: decoded.id,
                username: decoded.sub,
                email: decoded.email,
                role: decoded.role
            });
            return response.data;
        } catch (error) {
            throw (error);
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        setIsLoading(true);
        try {
            if (token) {
                await axios.delete(`${apiUrl}/auth/logout`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }
        } catch (error) {
            console.error('Error during logout:', error);
        } finally {
            sessionStorage.removeItem('auth-token');
            setToken(null);
            setUser(null);
            navigate('/login');
            setIsLoading(false);
        }
    }

    useEffect(() => {
        const handleStorageChange = (e) => {
            if (e.key === 'auth-token') {
                setToken(e.newValue);
                const storedToken = e.newValue;
                if (storedToken) {
                    try {
                        const decoded = jwtDecode(storedToken);
                        setUser({
                            id: decoded.id,
                            username: decoded.sub,
                            email: decoded.email,
                            role: decoded.role
                        });
                    } catch (error) {
                        console.error("Errore nella decodifica del token (storage change):", error);
                        sessionStorage.removeItem('auth-token');
                        setToken(null);
                        setUser(null);
                    }
                } else {
                    setUser(null);
                }
            }
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, [navigate]);

    const isLoggedIn = () => {
        return !!token;
    }

    const getUserType = () => {
        if (!token)
            return '';

        try {
            const decoded = jwtDecode(token);
            return decoded.role;
        } catch (error) {
            console.error('Error decoding token', error);
            return '';
        }
    }

    const value = {
        user,
        token,
        login,
        logout,
        isLoggedIn,
        getUserType,
        isLoading
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    return useContext(AuthContext);
}