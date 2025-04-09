import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import axiosIstance from '../context/axiosInterceptor';

export const useManageCars = () => {
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const apiUrl = 'http://localhost:8080/api/cars';

    const getAllCars = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axiosIstance.get(`${apiUrl}/allcars`);
            setCars(response.data);
            return response.data;
        } catch (err) {
            setError(err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [apiUrl]);

    const getCarById = useCallback(async (id) => {
        setLoading(true);
        try {
            const response = await axiosIstance.get(`${apiUrl}/${id}`);
            return response.data;
        } catch (err) {
            setError(err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [apiUrl]);

    const updateCar = useCallback(async (id, updatedCar) => {
        setLoading(true);
        try {
            const response = await axiosIstance.put(
                `${apiUrl}/${id}`,
                updatedCar
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
    }, [apiUrl]);

    const getAvailableCarsByDate = useCallback(async (startDate, endDate) => {
        setLoading(true);
        try {
            const response = await axiosIstance.get(`${apiUrl}/available-cars`, {
                params: { startDate, endDate }
            });
            return response.data;
        } catch (err) {
            setError(err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [apiUrl]);

    const getAvailableCars = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axiosIstance.get(`${apiUrl}/allcars`);
            return response.data;
        } catch (err) {
            setError(err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [apiUrl]);

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