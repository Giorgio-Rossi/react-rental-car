import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCarRequest } from '../../hooks/useCarRequest';
import { useUser } from '../../hooks/useUser';
import { useCar } from '../../hooks/useCar';
import { useAuth } from '../../hooks/useAuth'; 

import './manage-requests.css';


const ManageRequests = () => {
  const navigate = useNavigate();

  const { user } = useAuth(); 
  const { requests, fetchAdminRequests, updateRequest, loading: requestsLoading, error: requestsError } = useCarRequest();
  const { users, fetchUsers, loading: usersLoading, error: usersError } = useUser();
  const { cars, getCars, loading: carsLoading, error: carsError } = useCar();

  useEffect(() => {
    if (user && user.role !== 'ROLE_ADMIN') {
      console.log("Utente non ADMIN, reindirizzamento a /home");
      navigate('/home');
      return; 
    }

    if (user?.role === 'ROLE_ADMIN') {
        console.log("Caricamento dati per admin...");
        fetchAdminRequests(); 
        fetchUsers();         
        getCars();            
    }
  
  }, [user, navigate, fetchAdminRequests, fetchUsers, getCars]);


  const processedRequests = useMemo(() => {
    if (!requests || !users || !cars) {
      return []; 
    }

    console.log("Processamento richieste...");
    return requests.map(request => {
      const userDetail = users.find(u => u.id === (request.userId || request.userID));
      let carDetails = 'Sconosciuta';
      if (request.carId || request.carID) {
        const carIdValue = request.carId || request.carID;
        if (Array.isArray(carIdValue)) {
            carDetails = carIdValue.map(id => cars.find(c => c.id === id)?.licensePlate || 'ID Sconosciuto')
                                  .filter(Boolean).join(', ') || 'Nessuna Targa';
        } else {
            carDetails = cars.find(c => c.id === carIdValue)?.licensePlate || 'Sconosciuta';
        }
      }


      return {
        ...request,
        userFullName: userDetail?.fullName || 'Sconosciuto',
        carDetails: carDetails,
  
      };
    });
  }, [requests, users, cars]); 



  const handleActionClick = async (action, requestData) => {
    console.log(`Azione: ${action}, Richiesta ID: ${requestData.id}`);
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
        console.warn("Azione Elimina non implementata con hook.");
        return;
    }


    if (newStatus) {
      try {
        await updateRequest(requestId, { status: newStatus });
        console.log(`Richiesta ${requestId} aggiornata a ${newStatus}`);
      } catch (error) {
        console.error(`Errore durante l'aggiornamento dello stato a ${newStatus}:`, error);
      }
    }
  };

  const isLoading = requestsLoading || usersLoading || carsLoading;
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