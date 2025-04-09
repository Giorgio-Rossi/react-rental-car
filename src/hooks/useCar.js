import { useState, useCallback } from "react";
import axios from "axios";

export const useCar = () => {
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const apiUrl = 'http://localhost:8080';

    const apiUrls = {
        addCar: `${apiUrl}/admin/add-car`,
        allCars: `${apiUrl}/api/cars/allcars`,
        editCar: `${apiUrl}/admin/edit-car`,
        deleteCar: `${apiUrl}/api/cars`
    };

    const getHeaders = useCallback(() => {
        const token = sessionStorage.getItem('auth-token');
        return {
          headers: {
            Authorization: `Bearer ${token}`
          }
        };
      }, []); 

      const getCars = useCallback(async () => {
        setLoading(true);
        try {
          const token = sessionStorage.getItem('auth-token');
          if (!token) throw new Error('Token non trovato');
      
          const response = await axios.get(apiUrls.allCars, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          
          setCars(response.data);
          return response.data;
        } catch (error) {
          setError(error);
          // if (error.response?.status === 403) {
          //   sessionStorage.removeItem('auth-token');
          // }
          throw error;
        } finally {
          setLoading(false);
        }
      }, [apiUrls.allCars]);

      
    const createCar = useCallback(async (car) => {
        setLoading(true);
        try {
            const response = await axios.post(
                apiUrls.addCar,
                { ...car, updatedAt: new Date().toISOString() },
                getHeaders()
            );
            setCars(prev => [...prev, response.data]);
            return response.data;
        } catch (error) {
            setError(error);
            throw error;
        } finally {
            setLoading(false);
        }
    }, [apiUrls.addCar, getHeaders]);

    const updateCar = useCallback(async (car) => {
        setLoading(true);
        try {
            const response = await axios.put(
                `${apiUrls.editCar}/${car.id}`,
                car,
                getHeaders()
            );
            setCars(prev => prev.map(c => c.id === car.id ? response.data : c));
            return response.data;
        } catch (err) {
            setError(err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [apiUrls.editCar, getHeaders]);

    const deleteCar = useCallback(async (id) => {
        setLoading(true);
        try {
            await axios.delete(`${apiUrls.deleteCar}/${id}`, getHeaders());
            setCars(prev => prev.filter(car => car.id !== id));
        } catch (error) {
            setError(error);
            throw error;
        } finally {
            setLoading(false);
        }
    }, [apiUrls.deleteCar, getHeaders]);

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