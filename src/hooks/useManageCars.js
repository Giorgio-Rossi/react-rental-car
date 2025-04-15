import { useState, useCallback } from 'react';
import axiosIstance from '../context/axiosInterceptor';

export const useManageCars = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const apiUrl = 'http://localhost:8080/api/cars';
  const apiUrlCarRequests = 'http://localhost:8080/api/car-requests';

  const updateCar = useCallback(async (id, updatedCar) => {
    setLoading(true);
    try {
      const response = await axiosIstance.patch(
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

  const getAvailableCarsByDate = useCallback(async (start, end) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosIstance.get(`${apiUrlCarRequests}/available-cars`, {
        params: {
          start,
          end
        }
      });
      return response.data;
    } catch (err) {
      setError(err.message || 'Errore nel recupero auto disponibili');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiUrl]);

  return {
    cars,
    loading,
    error,
    updateCar,
    getAvailableCarsByDate
  };
};