import { useState, useCallback } from 'react';
import axios from 'axios';
import axiosIstance from '../context/axiosInterceptor';

export const useUser = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const apiUrl = 'http://localhost:8080';

    const apiUrls = {
        allUsers: `${apiUrl}/users/alluser`,
        createUser: `${apiUrl}/admin/create-user`,
        updateUser: `${apiUrl}/admin/update-user`,
        deleteUser: `${apiUrl}/admin/delete-user`
    };

    const getUsers = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axiosIstance.get(apiUrls.allUsers);
            console.log(response.data)
            setUsers(response.data);
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    }, [apiUrls.allUsers]);

    const createUser = useCallback(async (user) => {
        setLoading(true);
        try {
            const response = await axiosIstance.post(apiUrls.createUser, user);
            setUsers(prev => [...prev, response.data]);
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    }, [apiUrls.createUser]);

    const updateUser = useCallback(async (user) => {
        setLoading(true);
        try {
            const response = await axiosIstance.put(`${apiUrls.updateUser}/${user.id}`, user);
            setUsers(prev => prev.map(u => u.id === user.id ? response.data : u));
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    }, [apiUrls.updateUser]);

    const deleteUser = useCallback(async (id) => {
        setLoading(true);
        try {
            await axiosIstance.delete(`${apiUrls.deleteUser}/${id}`);
            setUsers(prev => prev.filter(u => u.id !== id));
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    }, [apiUrls.deleteUser]);

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