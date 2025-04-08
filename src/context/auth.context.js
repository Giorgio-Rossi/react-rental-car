import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(sessionStorage.getItem('auth-token'));
    const navigate = useNavigate();
    const apiUrl = 'http://localhost:8080';

    useEffect(() => {

        if (token) {
            const decoded = jwtDecode(token);
            setUser({
                id: decoded.id,
                username: decoded.sub,
                email: decoded.email,
                role: decoded.role
            })
        }
    }, [token]);

    const login = async (username, password) => {
        try {
            const response = await axios.post(`${apiUrl}/auth/login`, { username, password });
            const { token } = response.data;
            sessionStorage.setItem('auth-token', token);
            setToken(token)
            const decoded = jwtDecode(token);
            setUser({
                id: decoded.id,
                username: decoded.sub,
                email: decoded.email,
                role: decoded.role
            })
            return response.data;
        } catch (error) {
            throw (error);
        }
    };

    const logout = async () => {
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
            navigate('login');
        }
    }

    useEffect(() => {
        const handleStorageChange = (e) => {
            if (e.key === 'auth-token') {
                setToken(e.newValue);
            }
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

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

    // const refreshToken = async () => {
    //     try {
    //         const response = await axios.post(`${apiUrl}/auth/refresh`, {});
    //         const { token } = response.data;
    //         setToken(token)
    //         localStorage.setItem('auth_token', token);
    //         return token;
    //     } catch (error) {
    //         logout();
    //         throw error;
    //     }
    // }

    const value = {
        user,
        token,
        login,
        logout,
        isLoggedIn,
        getUserType,
        // refreshToken
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    return useContext(AuthContext);
}