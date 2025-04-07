import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useCarRequest } from '../../hooks/useCarRequest.js';
import { useCar } from '../../hooks/useCar.js';
import { useUser } from '../../hooks/useUser';
import { Table } from '../table/table';
import Navbar from '../navbar/Navbar';
import { getButtonConfigsAdmin, getButtonConfigsUser, getTableAdminConfig, getTableCustomerConfig } from '../../config/home-config.js';
import './home.css';

const HomeComponent = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { cars, getCars } = useCar();
  const { users, getUsers } = useUser();
  const {
    requests,
    fetchAdminRequests,
    fetchUserRequests,
    deleteRequest,
    refreshRequests
  } = useCarRequest();

  const tableAdminConfig = getTableAdminConfig();
  const tableCustomerConfig = getTableCustomerConfig();
  const buttonConfigsAdmin = getButtonConfigsAdmin();
  const buttonConfigsUser = getButtonConfigsUser();

  useEffect(() => {
    const loadData = async () => {
      try {
        await getCars();
        await getUsers();

        if (user?.role === 'ROLE_ADMIN') {
          await fetchAdminRequests();
        } else if (user?.username) {
          await fetchUserRequests(user.username);
        }

      } catch (error) {
        console.error("Errore durante il caricamento dei dati:", error);
      }
    };

    if (user) { 
      loadData();
   };

  }, [user, getCars, fetchUsers, fetchAdminRequests, fetchUserRequests]);

  const handleActionClick = async (action, row) => {
    if (action === 'Modifica') {
      if(user?.role === 'ROLE_ADMIN'){
        navigate(`/edit-request/${row.id}`, { state: { requestData: row } });
      } else {
        navigate(`/edit-request/${row.id}`, { state: { requestData: row } });
      }
      
    } else if (action === 'Cancella') {
      await deleteRequest(row.id);
    }
  };

  const currentButtonConfigs = user?.role === 'ROLE_ADMIN' ? buttonConfigsAdmin : buttonConfigsUser;

  const handleNavButtonClick = (path) => {
    if (path) {
       navigate(path);
    }
  };

  return (
      <div className="home-container">
      <div className="navbar-user">
        <span>Benvenuto, {user?.username}</span>
        <button onClick={logout}>Logout</button>
      </div>

      {user?.role && (
        <Navbar
          buttons={currentButtonConfigs}
          onButtonClick={handleNavButtonClick} 
        />
      )}

      <Table
        config={user?.role === 'ROLE_CUSTOMER' ? tableCustomerConfig : tableAdminConfig}
        data={requests.map(request => ({
          ...request,
          fullName: users.find(u => u.id === request.userId)?.fullName || 'Sconosciuto', 
          start_reservation: request.startReservation ? formatDate(request.startReservation) : '',
          end_reservation: request.endReservation ? formatDate(request.endReservation) : '',
          carDetails: getCarDetails(request.carId, cars) 
        }))}
        onActionClick={({ action, row }) => handleActionClick(action, row)}
      />
    </div>
  );
};

const formatDate = (date) => new Date(date).toLocaleDateString('it-IT');

const getCarDetails = (carID, cars) => {
  if (Array.isArray(carID)) {
    return carID.map(id => cars.find(c => c.id === id)?.licensePlate || 'Unknown').join(', ');
  }
  return cars.find(c => c.id === carID)?.licensePlate || 'Unknown';
};

export default HomeComponent;
