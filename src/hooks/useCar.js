import { useState, useEffect, useCallback } from "react";
import axios from "axios";

export const useCar = () => {
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const apiUrl = 'http://localhost:8080';

    const apiUrls = {
        addCar: `${apiUrl}/admin/add-car`,
        lastId: `${apiUrl}/admin/last-car-id`,
        allCars: `${apiUrl}/api/cars/allcars`,
        editCar: `${apiUrl}/admin/edit-car`,
        deleteCar: `${apiUrl}/api/cars`
    };

    const getHeaders = useCallback(() => {
        const token = localStorage.getItem('auth_token');
        return {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };
    }, []);

    const createCar = async (car) => {
        setLoading(true);
        try {
            const NewCar = {
                ...car,
                updatedAt: newDate().toISOString()
            };
            const reponse = await axios.post(apiUrls.addCar, NewCar, getHeaders());
            setCars(prev => [...prev, response.data]);
            return reponse.data;

        } catch (error) {
            setError(error)
            throw error
        } finally {
            setLoading(false);
        }
    }

    const updateCar = async (car) => {
        setLoading(true)
        try {
            const reponse = await axios.put (
                `${apiUrls.editCar}/$car.id`,
                car,
                getHeaders()
            );
            setCars(prev => prev.map(c => c.id === car.id ? response.data : c))
            return response.data;
            
        } catch (err) {
            setError(error);
            throw error;
        } finally {
            setLoading(false)
        }
    }

    const deleteCar = async (id) => {
        setLoading(true)
        try {
            const response = await axios.delete (
                `${apiUrls.deleteCar}/${id}`,
                getHeaders()
            );
            setCars(prev => prev.filter(car => car.id !== id));
            return response.data
        } catch (error) {
            setError(error)
            throw error;
        } finally {
            setLoading(false)
        }
    }

    const getCars = useCallback(async () => {
        setLoading(true)
         try {
            const response = await axios.get(apiUrls.allCars, getHeaders());
            setCars(response.data)
            return response.data;
         } catch (error) {
            setError(error)
            throw error
         } finally {
            setLoading(false)
         }
    }, [apiUrls.allCars, getHeaders]);

    useEffect( ()=> {
        getCars();
    }, [getCars]);

    return {
        cars,
        loading,
        error,
        createCar,
        updateCar,
        deleteCar,
        getCars
    }
    

}