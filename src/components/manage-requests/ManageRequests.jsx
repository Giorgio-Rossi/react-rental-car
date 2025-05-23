import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCarRequest } from '../../hooks/useCarRequest';
import { useUser } from '../../hooks/useUser';
import { useCar } from '../../hooks/useCar';
import { useAuth } from '../../hooks/useAuth';
import { processRequests } from '../../utils/processRequests';

import './manage-requests.css';

const ManageRequests = () => {
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth();
  const { requests, fetchAdminRequests, updateRequestStatus, loading: requestsLoading, error: requestsError } = useCarRequest();
  const { users, getUsers, loading: usersLoading, error: usersError } = useUser();
  const { cars, getCars, loading: carsLoading, error: carsError } = useCar();

  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      navigate('/login');
      return;
    }

    if (user && user.role !== 'ROLE_ADMIN') {
      navigate('/home');
      return;
    }

    if (user?.role === 'ROLE_ADMIN' && !dataLoaded) {
      fetchAdminRequests();
      getUsers();
      getCars();
      setDataLoaded(true);
    }

  }, [user, navigate, fetchAdminRequests, getUsers, getCars, dataLoaded, authLoading]);

  
  const processedRequests = useMemo(() => {
    return processRequests(requests, users, cars);
  }, [requests, users, cars]);

  
  const handleActionClick = async (action, requestData) => {
    const requestId = requestData.id;
    let newStatus = '';

    if (action === 'Approva') {
      newStatus = 'APPROVATA';
    } else if (action === 'Rifiuta') {
      newStatus = 'RIFIUTATA';
    } else if (action === 'Modifica') {
      navigate(`/edit-request/${requestId}`, { state: { requestData: requestData } });
      return;
    } else if (action === 'Elimina') {
      return;
    }

    if (newStatus) {
      try {
        await updateRequestStatus(requestId, newStatus);
        fetchAdminRequests();
      } catch (error) {
        console.error(`Errore durante l'aggiornamento dello stato a ${newStatus}:`, error);
      }
    }
  };

  const isLoading = authLoading || requestsLoading || usersLoading || carsLoading;
  const combinedError = requestsError || usersError || carsError;

  const tableConfig = {
    actions: [
      { name: 'Approva', visible: (row) => row.status !== 'Annullata' && row.status !== 'APPROVATA' && row.status !== 'RIFIUTATA' },
      { name: 'Rifiuta', visible: (row) => row.status !== 'Annullata' && row.status !== 'APPROVATA' && row.status !== 'RIFIUTATA' },
    ]
  };

  if (isLoading) {
    return <div className="manage-requests-container"><p>Caricamento dati...</p></div>;
  }

  if (combinedError) {
    return <div className="manage-requests-container"><p style={{ color: 'red' }}>Errore nel caricamento: {combinedError.message || 'Errore sconosciuto'}</p></div>;
  }


  return (
    <div className="manage-requests-container">
      <h2>Gestione richieste</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Cliente</th>
            <th>Auto richiesta</th>
            <th>Stato</th>
            <th>Data Inizio</th>
            <th>Data Fine</th>
            <th>Azioni</th>
          </tr>
        </thead>
        <tbody>
          {processedRequests.length > 0 ? (
            processedRequests.map((request) => (
              <tr key={request.id}>
                <td>{request.id}</td>
                <td>{request.userFullName}</td>
                <td>{request.carDetails}</td>
                <td>{request.status}</td>
                <td>{request.startReservation ? new Date(request.startReservation).toLocaleDateString('it-IT') : '-'}</td>
                <td>{request.endReservation ? new Date(request.endReservation).toLocaleDateString('it-IT') : '-'}</td>
                <td>
                  {tableConfig.actions
                    .filter(action => action.visible(request))
                    .map((action) => (
                      <button
                        key={action.name}
                        onClick={() => handleActionClick(action.name, request)}
                        style={action.name === 'Approva' ?
                          { backgroundColor: 'green', color: 'white', marginRight: '5px' } :
                          { backgroundColor: 'red', color: 'white' }}
                      >
                        {action.name}
                      </button>
                    ))}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7">Nessuna richiesta trovata.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ManageRequests;
