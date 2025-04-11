import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import axiosIstance from "./axiosInterceptor";
import { useStorage } from '../hooks/useStorage';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const { 
        saveToken, 
        clean, 
        getUser, 
        getToken, 
        isLoggedIn: storageIsLoggedIn,
        getUserType: storageGetUserType,
        currentUser,
        currentToken
    } = useStorage();
    
    const [user, setUser] = useState(currentUser);
    const [token, setToken] = useState(currentToken);
    const [isLoading, setIsLoading] = useState(true);
    const apiUrl = 'http://localhost:8080';
    const navigate = useNavigate();

    useEffect(() => {
        setUser(currentUser);
        setToken(currentToken);
    }, [currentUser, currentToken]);

    useEffect(() => {
        if (currentToken) setIsLoading(false);
        else setIsLoading(false);
    }, []);

    const login = async (username, password) => {
        setIsLoading(true);
        try {
            const response = await axios.post(`${apiUrl}/auth/login`, { username, password });
            saveToken(response.data.token); 
            return response.data;
        } catch (error) {
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        setIsLoading(true);
        try {
            if (token) {
                await axiosIstance.delete(`${apiUrl}/auth/logout`);
            }
        } catch (error) {
            console.error('Error during logout:', error);
        } finally {
            clean(); 
            navigate('/login');
            setIsLoading(false);
        }
    };

    const value = {
        user,
        token,
        login,
        logout,
        isLoggedIn: storageIsLoggedIn,
        getUserType: storageGetUserType,
        isLoading
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);