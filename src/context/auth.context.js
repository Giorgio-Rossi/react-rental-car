import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('auth_token'));
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
            localStorage.setItem('auth_token', token);
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
            localStorage.removeItem('auth_token');
            setToken(null);
            setUser(null);
            navigate('login');
        }
    }

    const isLoggedIn = () => {
        return !!token; // converto in booleano e verifico il valore
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

    const refreshToken = async () => {
        try {
            const rsponde = await axios.post(`${apiUrl}/auth/refresh`, {});
            const { token } = response.data;
            setToken(token)
            localStorage.setItem('auth_token', token);
            return token;
        } catch (error) {
            logout();
            throw error;
        }
    }

    const value = {
        user,
        token,
        login,
        logout,
        isLoggedIn,
        getUserType,
        refreshToken
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    return useContext(AuthContext);

}