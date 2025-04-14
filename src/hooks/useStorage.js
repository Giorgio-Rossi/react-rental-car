import { useState, useEffect } from "react";
import { jwtDecode } from 'jwt-decode';

const USER_KEY = 'auth-user';
const TOKEN_KEY = 'auth-token';

export const useStorage = () => {
    const [user, setUser] = useState(() => {
        const storedUser = sessionStorage.getItem(USER_KEY);
        return storedUser ? JSON.parse(storedUser) : null;
    });

    const [token, setToken] = useState(sessionStorage.getItem(TOKEN_KEY) || null);

    const clean = () => {
        sessionStorage.removeItem(USER_KEY);
        sessionStorage.removeItem(TOKEN_KEY);
        setUser(null);
        setToken(null);
    };

    const saveUser = (userData) => {
        sessionStorage.setItem(USER_KEY, JSON.stringify(userData));
        setUser(userData);
    };

    const saveToken = (newToken) => {
        sessionStorage.setItem(TOKEN_KEY, newToken);
        setToken(newToken);

        try {
            const decoded = jwtDecode(newToken);
            saveUser({
                id: decoded.id,
                username: decoded.sub,
                role: decoded.role
            });

        } catch (error) {
            console.error("Token decoding failed:", error);
            clean();
        }
    };

    const getToken = () => token;

    const getUser = () => {
        return user
    };

    const isLoggedIn = () => !!token;

    useEffect(() => {
        const handleStorageChange = (e) => {
            if (e.key === TOKEN_KEY) {
                const newToken = e.newValue;
                setToken(newToken);
                if (newToken) {
                    try {
                        const decoded = jwtDecode(newToken);
                        saveUser({
                            id: decoded.id,
                            username: decoded.sub,
                            role: decoded.role
                        });
                    } catch (error) {
                        console.error("Token decoding failed:", error);
                        clean();
                    }
                } else {
                    setUser(null);
                }
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    return {
        clean,
        saveUser,
        saveToken,
        getToken,
        getUser,
        isLoggedIn
    };
};