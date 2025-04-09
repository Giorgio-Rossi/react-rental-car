import { useState, useEffect } from "react";
import { jwtDecode } from 'jwt-decode';

const USER_KEY = 'auth-user';
const TOKEN_KEY = 'auth-token';

export const useStorage = () => {
    const [user, setUser] = useState(() => {
        const storedUser = sessionStorage.getItem(USER_KEY);
        return storedUser ? JSON.parse(storedUser) : {};
    });

    const [token, setToken] = useState(sessionStorage.getItem(TOKEN_KEY) || null);

    const clean = () => {
        sessionStorage.clear();
        setUser({});
        setToken(null);
    };

    const saveUser = (userData) => {
        sessionStorage.removeItem(USER_KEY);
        sessionStorage.setItem(USER_KEY, JSON.stringify(userData));
        setUser(userData);
    };
    

    const saveToken = (newToken) => {
        console.log(newToken.token)
        sessionStorage.removeItem(TOKEN_KEY)
        sessionStorage.setItem(TOKEN_KEY, newToken.token)
        localStorage.setItem(TOKEN_KEY, newToken.token);
        setToken(newToken.token);
    };

    const getToken = () => {
        return token || sessionStorage.getItem(TOKEN_KEY);
    };

    const getUser = () => {
        const storedUser = sessionStorage.getItem(USER_KEY);
        return storedUser ? JSON.parse(storedUser) : {};
    };

    const getUserType = () => {
        const currentToken = getToken();
        if (currentToken) {
            try {
                const decodedToken = jwtDecode(currentToken);
                return decodedToken.role || '';
            } catch (error) {
                console.error('Error decoding token', error);
                return '';
            }
        }
        return '';
    };

    const isLoggedIn = () => {
        return !!getToken();
    };

    useEffect(() => {
        const handleStorageChange = (e) => {
            if (e.key === USER_KEY) {
                setUser(e.newValue ? JSON.parse(e.newValue) : {});
            }
            if (e.key === TOKEN_KEY) {
                setToken(e.newValue);
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
        getUserType,
        isLoggedIn,
        currentUser: user,
        currentToken: token
    };
}
