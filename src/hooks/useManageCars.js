import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

export const useManageCars = () => {
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const apiUrl = 'http://localhost:8080/api/cars';

    const getHeaders = useCallback(() => {
        const token = localStorage.getItem('auth_token');
        return {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };
    }, []);

    const getAllCars = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${apiUrl}/allcars`, getHeaders());  
            setCars(response.data);
            return response.data;
        } catch (err) {
            setError(err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [apiUrl, getHeaders]);

    const getCarById = useCallback(async (id) => { 
        setLoading(true);
        try {
            const response = await axios.get(`${apiUrl}/${id}`, getHeaders()); 
            return response.data;
        } catch (err) {
            setError(err);
            throw err;
            } finally {
                setLoading(false);
            }
    }, [apiUrl, getHeaders]);

    const updateCar = useCallback(async (id, updatedCar) => { 
        setLoading(true);
        try {
            const response = await axios.put(
                `${apiUrl}/${id}`,  
                updatedCar,
                getHeaders()
            );
            setCars(prev => prev.map(car =>
                car.id === id ? response.data : car
            ));
            return response.data;
        } catch (err) {
            setError(err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [apiUrl, getHeaders]);

    const getAvailableCarsByDate = useCallback(async (startDate, endDate) => { 
        setLoading(true);
        try {
            const response = await axios.get(`${apiUrl}/available-cars`, {  
                ...getHeaders(),
                params: { startDate, endDate }
            });
            return response.data;
        } catch (err) {
            setError(err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [apiUrl, getHeaders]);

    const getAvailableCars = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${apiUrl}/allcars`, getHeaders()); 
            return response.data;
        } catch (err) {
            setError(err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [apiUrl, getHeaders]);

    useEffect(() => {
        getAllCars();
    }, [getAllCars]);

    return {
        cars,
        loading,
        error,
        getAllCars,
        getCarById,
        updateCar,
        getAvailableCarsByDate,
        getAvailableCars
    };
};