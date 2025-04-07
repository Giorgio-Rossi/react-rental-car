import { useState, useCallback } from 'react';
import axios from 'axios';

export const useUser = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const apiUrl = 'http://localhost:8080';

    const apiUrls = {
        allUsers: `${apiUrl}/admin/users`,
        createUser: `${apiUrl}/admin/create-user`,
        updateUser: `${apiUrl}/admin/update-user`,
        deleteUser: `${apiUrl}/admin/delete-user`
    };

    const getHeaders = useCallback(() => ({
        headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`
        }
    }), []);

    const getUsers = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axios.get(apiUrls.allUsers, getHeaders());
            setUsers(response.data);
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    }, [apiUrls.allUsers, getHeaders]);

    const createUser = useCallback(async (user) => {
        setLoading(true);
        try {
            const response = await axios.post(apiUrls.createUser, user, getHeaders());
            setUsers(prev => [...prev, response.data]);
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    }, [apiUrls.createUser, getHeaders]);

    const updateUser = useCallback(async (user) => {
        setLoading(true);
        try {
            const response = await axios.put(`${apiUrls.updateUser}/${user.id}`, user, getHeaders());
            setUsers(prev => prev.map(u => u.id === user.id ? response.data : u));
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    }, [apiUrls.updateUser, getHeaders]);

    const deleteUser = useCallback(async (id) => {
        setLoading(true);
        try {
            await axios.delete(`${apiUrls.deleteUser}/${id}`, getHeaders());
            setUsers(prev => prev.filter(u => u.id !== id));
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    }, [apiUrls.deleteUser, getHeaders]);

    return {
        users,
        loading,
        error,
        getUsers,
        createUser,
        updateUser,
        deleteUser
    };
};