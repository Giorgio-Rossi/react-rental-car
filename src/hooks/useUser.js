import { useState, useCallback } from 'react';
import axios from 'axios';

export const useUser = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const apiUrl = 'http://localhost:8080/users';
    const apiUrlSaveUser = 'http://localhost:8080/admin/edit-user';

    const getHeaders = useCallback(() => {
        const token = localStorage.getItem('auth_token');
        return {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };
    }, []);

    const updateUser = async (user) => {
        setLoading(true);
        try {
            const response = await axios.put(
                `${apiUrlSaveUser}/${user.id}`,
                user,
                getHeaders()
            );
            setUsers(prev => prev.map(u => u.id === user.id ? response.data : u));
            return response.data;
        } catch (error) {
            setError(error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const getUserById = async (id) => {
        setLoading(true);
        try {
            const response = await axios.get(
                `${apiUrl}/${id}`,
                getHeaders()
            );
            return response.data;
        } catch (error) {
            setError(error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const deleteUser = async (id) => {
        setLoading(true);
        try {
            const response = await axios.delete(
                `${apiUrl}/${id}`,
                getHeaders()
            );
            setUsers(prev => prev.filter(user => user.id !== id));
            return response.data;
        } catch (error) {
            setError(error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const editUser = async () => {
        setLoading(true);
        try {
            const response = await axios.get(
                apiUrl,
                getHeaders()
            );
            setUsers(response.data);
            return response.data;
        } catch (error) {
            setError(error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const getUsers = async () => {
        setLoading(true);
        try {
            const response = await axios.get(
                `${apiUrl}/alluser`,
                getHeaders()
            );
            setUsers(response.data);
            return response.data;
        } catch (error) {
            setError(error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const getUserByUsername = async (username) => {
        setLoading(true);
        try {
            const response = await axios.get(
                `${apiUrl}/get-user-by-username`,
                {
                    ...getHeaders(),
                    params: { username }
                }
            );
            return response.data;
        } catch (error) {
            setError(error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    return {
        users,
        loading,
        error,
        updateUser,
        getUserById,
        deleteUser,
        editUser,
        getUsers,
        getUserByUsername
    };
};
