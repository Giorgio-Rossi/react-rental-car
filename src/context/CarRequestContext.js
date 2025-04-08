import { useState, useEffect } from "react";
import axios from "axios";

export const useCarRequest = () => {
    const [request, setRequest] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const apiUrl = 'http://localhost:8080';
    const endpoint = {
        allRequests: `${apiUrl}/api/car-requests/all-requests`,
        customer: `${apiUrl}/customer`,
        adminManage: `${apiUrl}/admin/manage-request`,
        base: `${apiUrl}/api/car-requests`
    }

    const getHeaders = useCallback(() => {
        const token = sessionStorage.getItem('auth-token');
        return {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };
    }, []);

    const createRequest = async (request) => {
        setLoading(true)
        try {
            const newRequest = {
                ...request,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }
            const response = await axios.post(
                `${endpoints.customer}/add-request`,
                payload,
                getHeaders()
            )
            setRequest(prev => [...prev, response.data])
            return response.data;

        } catch (error) {
            setError(error)
            throw error;
        } finally {
            setLoading(false)
        }
    }

    const updateRequestStatus = async (id, status) => {
        setLoading(true);
        try {
            const backendStatus = status.toUpperCase().replace(' ', '_');
            const response = await axios.put(
                `${endpoints.adminManage}/${id}`,
                { status: backendStatus },
                getHeaders()
            );
            setRequests(prev => prev.map(req =>
                req.id === id ? { ...req, status: response.data.status } : req
            ));
            return response.data;
        } catch (error) {
            setError(error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const updateRequest = async (request) => {
        setLoading(true);
        try {
            const response = await axios.put(
                `${endpoints.base}/update-request/${request.id}`,
                request,
                getHeaders()
            );
            setRequests(prev => prev.map(req => 
                req.id === request.id ? response.data : req
            ));
            return response.data;
        } catch (error) {
            setError(error);
            throw error;
        } finally {
            setLoading(false);
        }
    };


    const deleteRequest = async (id) => {
        setLoading(true);
        try {
            await axios.delete(`${endpoints.base}/${id}`, getHeaders());
            setRequests(prev => prev.filter(req => req.id !== id));
        } catch (error) {
            setError(error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const getRequests = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axios.get(endpoints.allRequests, getHeaders());
            setRequests(response.data);
            return response.data;
        } catch (error) {
            setError(error);
            throw error;
        } finally {
            setLoading(false);
        }
    }, [endpoints.allRequests, getHeaders]);

    const getRequestsByUsername = async (username) => {
        setLoading(true);
        try {
            const response = await axios.get(
                `${endpoints.base}/get-request-by-username`,
                {
                    ...getHeaders(),
                    params: { username }
                }
            );
            return response.data;
        } catch (error) {
            setError(error);
            throw error;
        } finally {
            setLoading(false);
        }
    };
  const canEditRequest = (row) => {
        return row.status !== 'Annullata';
    };

    const getLastRequestId = async () => {
        try {
            const response = await axios.get(
                `${endpoints.base}/last-request-id`,
                getHeaders()
            );
            return response.data;
        } catch (error) {
            setError(error);
            throw error;
        }
    };

    useEffect(() => {
        getRequests();
    }, [getRequests]);

    return {
        requests,
        loading,
        error,
        getRequests,
        createRequest,
        deleteRequest,
        getRequestsByUsername,
        updateRequestStatus,
        updateRequest,
        canEditRequest,
        getLastRequestId
    };
}