import { useState, useCallback } from 'react';
import axiosIstance from '../context/axiosInterceptor';

export const useCarRequest = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const apiUrl = 'http://localhost:8080';

  const fetchRequestsBase = useCallback(async (url, params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosIstance.get(url, { params });
      setRequests(response.data);
    } catch (err) {
      setError(err.message || 'Error fetching requests');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAdminRequests = useCallback(async () => {
    await fetchRequestsBase(`${apiUrl}/api/car-requests/all-requests`);
  }, [fetchRequestsBase, apiUrl]);

  const fetchUserRequests = useCallback(async (username) => {
    await fetchRequestsBase(
      `${apiUrl}/api/car-requests/get-request-by-username`,
      { username }
    );
  }, [fetchRequestsBase, apiUrl]);

  const deleteRequest = useCallback(async (requestId) => {
    setLoading(true);
    setError(null);
    try {
      await axiosIstance.delete(`${apiUrl}/api/car-requests/${requestId}`);
      setRequests(prev => prev.filter(req => req.id !== requestId));
    } catch (err) {
      setError(err.message || 'Error deleting request');
    } finally {
      setLoading(false);
    }
  }, [apiUrl]);

  const createRequest = useCallback(async (newRequest) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosIstance.post(
        `${apiUrl}/customer/add-request`,
        newRequest
      );
      setRequests(prev => [...prev, response.data]);
      return response.data;
    } catch (err) {
      setError(err.message || 'Error creating request');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiUrl]);

  const updateRequest = useCallback(async (requestId, updatedData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosIstance.patch(
        `${apiUrl}/api/car-requests/update-request/${requestId}`,
        updatedData
      );
      setRequests(prev =>
        prev.map(req => req.id === requestId ? response.data : req)
      );
      return response.data;
    } catch (err) {
      setError(err.message || 'Error updating request');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiUrl]);

  const updateRequestStatus = useCallback(async (requestId, newStatus) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosIstance.put(
        `${apiUrl}/admin/manage-request/${requestId}`,
        { status: newStatus }
      );
      setRequests(prev =>
        prev.map(req => req.id === requestId ? response.data : req)
      );
      return response.data;
    } catch (err) {
      setError(err.message || 'Error updating request status');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiUrl]);

  return {
    requests,
    loading,
    error,
    fetchAdminRequests,
    fetchUserRequests,
    deleteRequest,
    createRequest,
    updateRequest,
    updateRequestStatus,
    refreshRequests: fetchAdminRequests
  };
};