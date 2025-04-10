import { useState, useCallback } from "react";
import axios from "axios";
import axiosIstance from "../context/axiosInterceptor";

export const useCar = () => {
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const apiUrl = 'http://localhost:8080';

    const apiUrls = {
        addCar: `${apiUrl}/admin/add-car`,
        allCars: `${apiUrl}/api/cars/allcars`,
        editCar: `${apiUrl}/admin/edit-car`,
        deleteCar: `${apiUrl}/api/car-requests`
    };

      const getCars = useCallback(async () => {
        setLoading(true);
        try {
          const response = await axiosIstance.get(apiUrls.allCars);
          setCars(response.data);
          return response.data;
        } catch (error) {
          setError(error);
          throw error;
        } finally {
          setLoading(false);
        }
      }, [apiUrls.allCars]);

      
    const createCar = useCallback(async (car) => {
        setLoading(true);
        try {
            const response = await axiosIstance.post(
                apiUrls.addCar,
                { ...car, updatedAt: new Date().toISOString() }
            );
            setCars(prev => [...prev, response.data]);
            return response.data;
        } catch (error) {
            setError(error);
            throw error;
        } finally {
            setLoading(false);
        }
    }, [apiUrls.addCar]);

    const updateCar = useCallback(async (car) => {
        setLoading(true);
        try {
            const response = await axiosIstance.put(
                `${apiUrls.editCar}/${car.id}`,
                car
            );
            setCars(prev => prev.map(c => c.id === car.id ? response.data : c));
            return response.data;
        } catch (err) {
            setError(err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [apiUrls.editCar]);

    const deleteCar = useCallback(async (id) => {
        setLoading(true);
        try {
            await axiosIstance.delete(`${apiUrls.deleteCar}/${id}`);
            setCars(prev => prev.filter(car => car.id !== id));
        } catch (error) {
            setError(error);
            throw error;
        } finally {
            setLoading(false);
        }
    }, [apiUrls.deleteCar]);

    return {
        cars,
        loading,
        error,
        createCar,
        updateCar,
        deleteCar,
        getCars
    };
};