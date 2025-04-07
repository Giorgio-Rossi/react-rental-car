import { useState, useEffect, useCallback } from 'react';

export const useCarRequest = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


  const fetchRequestsBase = useCallback(async (url) => {  
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Failed to fetch requests from ${url}`);
      const data = await response.json();
      setRequests(data);
    } catch (err) {
      setError(err.message || 'Error fetching requests');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAdminRequests = useCallback(async () => {
    await fetchRequestsBase('/api/requests');
  }, [fetchRequestsBase]);


  const fetchUserRequests = useCallback(async (username) => {
    await fetchRequestsBase(`/api/requests?user=${username}`);
  }, [fetchRequestsBase]);


  const deleteRequest = useCallback(async (requestId) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/requests/${requestId}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to delete request');
      setRequests(prev => prev.filter(req => req.id !== requestId));
    } catch (err) {
      setError(err.message || 'Error deleting request');
    } finally {
      setLoading(false);
    }
  }, []);

  const createRequest = useCallback(async (newRequest) => {
    try {
      setLoading(true);
      const response = await fetch('/api/requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newRequest)
      });

      if (!response.ok) throw new Error('Failed to create request');
      const data = await response.json();
      setRequests(prev => [...prev, data]);
      return data;
    } catch (err) {
      setError(err.message || 'Error creating request');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateRequest = useCallback(async (requestId, updatedData) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/requests/${requestId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedData)
      });

      if (!response.ok) throw new Error('Failed to update request');
      const data = await response.json();
      setRequests(prev => prev.map(req => req.id === requestId ? data : req));
      return data;
    } catch (err) {
      setError(err.message || 'Error updating request');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);



  return {
    requests,
    loading,
    error,
    fetchAdminRequests,
    fetchUserRequests,
    deleteRequest,
    createRequest,
    updateRequest,
    refreshRequests: fetchAdminRequests 
  };
};