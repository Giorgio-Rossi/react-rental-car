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
  const { cars, fetchCars } = useCar();
  const { users, fetchUsers } = useUser();
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
      await fetchCars();
      await fetchUsers();

      if (user?.role === 'ROLE_ADMIN') {
        await fetchAdminRequests();
      } else if (user?.username) {
        await fetchUserRequests(user.username);
      }
    };

    loadData();
  }, [user]);

  const handleActionClick = async (action, row) => {
    if (action === 'Modifica') {
      navigate(`/edit-request/${row.id}`, { state: { requestData: row } });
    } else if (action === 'Cancella') {
      await deleteRequest(row.id);
    }
  };

  return (
    <div className="home-container">
      <div className="navbar-user">
        <span>Benvenuto, {user?.username}</span>
        <button onClick={logout}>Logout</button>
      </div>

      {user?.role && (
        <Navbar buttons={user.role === 'ROLE_ADMIN' ? buttonConfigsAdmin : buttonConfigsUser} />
      )}

      <Table
        config={user?.role === 'ROLE_CUSTOMER' ? tableCustomerConfig : tableAdminConfig}
        data={requests.map(request => ({
          ...request,
          fullName: users.find(u => u.id === request.userID)?.fullName || 'Unknown',
          start_reservation: request.startReservation ? formatDate(request.startReservation) : '',
          end_reservation: request.endReservation ? formatDate(request.endReservation) : '',
          carDetails: getCarDetails(request.carID, cars)
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
