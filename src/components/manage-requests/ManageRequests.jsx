import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CarRequestService } from '../../service/CarRequest.service';
import { UserService } from '../../service/user.service';
import { CarService } from '../../service/car.service.service';
import { AuthService } from '../../service/auth.service';
import { ManageCarsService } from '../../service/manage-cars.service';
import './manage-requests.css'

const ManageRequests = () => {
  const [requestsCar, setRequestsCar] = useState([]);
  const [users, setUsers] = useState([]);
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const navigate = useNavigate();
  const manageCarsService = new ManageCarsService();
  const carRequestService = new CarRequestService();
  const userService = new UserService();
  const authService = new AuthService();
  const carService = new CarService();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedCars = await manageCarsService.getAllCars();
        const fetchedUsers = await userService.getUsers();
        const fetchedRequests = await carRequestService.getRequests();

        const updatedRequests = fetchedRequests.map(request => {
          const user = fetchedUsers.find(u => u.id === request.userID);
          let carDetails = '';
          if (Array.isArray(request.carID)) {
            carDetails = request.carID.map(carID => {
              const car = fetchedCars.find(car => car.id === carID);
              return car ? car.licensePlate : 'Unknown';
            }).join(', ');
          } else {
            const car = fetchedCars.find(car => car.id === request.carID);
            carDetails = car ? (car.licensePlate ?? 'Unknown') : 'Unknown';
          }

          return {
            ...request,
            userFullName: user?.fullName || 'Unknown',
            start_reservation: request.startReservation ? new Date(request.startReservation).toLocaleDateString() : null,
            end_reservation: request.endReservation ? new Date(request.endReservation).toLocaleDateString() : null,
            carDetails: carDetails || 'Unknown'
          };
        });

        setRequestsCar(updatedRequests);
        setUsers(fetchedUsers);
        setCars(fetchedCars);
      } catch (error) {
        console.error('Errore durante il caricamento dei dati:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    const userRole = authService.getUserType();
    if (userRole !== 'ROLE_ADMIN') {
      navigate('/home');
    }
  }, [manageCarsService, userService, carRequestService, authService, navigate]);

  const handleActionClick = (action, data) => {
    if (action === 'Modifica') {
      navigate('/manage-request', { state: { userData: data } });
    } else if (action === 'Elimina') {
      carRequestService.deleteRequest(data.id).then(() => {
        setRequestsCar(requestsCar.filter(request => request.id !== data.id));
      }).catch(err => {
        console.error('Errore durante l\'eliminazione della richiesta:', err);
      });
    } else if (action === 'Approva') {
      updateRequest(data.id, 'APPROVATA');
    } else if (action === 'Rifiuta') {
      updateRequest(data.id, 'RIFIUTATA');
    }
  };

  const updateRequest = (id, status) => {
    const request = requestsCar.find(r => r.id === id);
    if (request) {
      carRequestService.updateRequestStatus(id, status).then(updatedRequest => {
        request.status = updatedRequest.status;
        setRequestsCar([...requestsCar]);
      });
    }
  };

  const tableConfig = {
    headers: [
      { key: 'id', columnName: 'ID', type: 'Number', ordinable: true },
      { key: 'fullName', columnName: 'Cliente', type: 'String' },
      { key: 'carDetails', columnName: 'Auto richiesta', type: 'String' },
      { key: 'status', columnName: 'Stato', type: 'String', ordinable: true, filtrable: true }
    ],
    currentByDefault: { key: 'id', orderby: 'asc' },
    pagination: { itemsPerPage: 10, currentPage: 1 },
    actions: {
      actions: [
        { name: 'Approva', visible: (row) => row.status !== 'Annullata' },
        { name: 'Rifiuta', visible: (row) => row.status !== 'Annullata' }
      ]
    }
  };

  const buttonConfigs = [
    {
      label: 'Approva',
      action: (id) => updateRequest(id, 'APPROVATA'),
      type: 'button',
      style: { color: 'white', backgroundColor: 'green', border: '1px solid green' }
    },
    {
      label: 'Rifiuta',
      action: (id) => updateRequest(id, 'RIFIUTATA'),
      type: 'button',
      style: { color: 'white', backgroundColor: 'red', border: '1px solid red' }
    }
  ];

  return (
    <div className="manage-requests-container">
      <h2>Gestione richieste</h2>
      {loading ? <p>Loading...</p> : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Cliente</th>
              <th>Auto richiesta</th>
              <th>Stato</th>
              <th>Azioni</th>
            </tr>
          </thead>
          <tbody>
            {requestsCar.map((request) => (
              <tr key={request.id}>
                <td>{request.id}</td>
                <td>{request.userFullName}</td>
                <td>{request.carDetails}</td>
                <td>{request.status}</td>
                <td>
                  {tableConfig.actions.actions.map((action) =>
                    action.visible(request) ? (
                      <button key={action.name} onClick={() => handleActionClick(action.name, request)}>
                        {action.name}
                      </button>
                    ) : null
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ManageRequests;
