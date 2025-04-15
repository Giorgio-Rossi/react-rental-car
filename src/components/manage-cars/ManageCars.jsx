import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCar } from '../../hooks/useCar';
import { useAuth } from '../../hooks/useAuth';
import { Table } from '../table/table';
import './manage-cars.css';

const ManageCars = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cars, getCars, deleteCar, loading, error } = useCar();

  useEffect(() => {
    if (user && user.role !== 'ROLE_ADMIN') {
      navigate('/home');
      return;
    }

    if (user?.role === 'ROLE_ADMIN') {
      getCars();
    }
  }, [user, navigate, getCars]);

  const handleActionClick = async (action, data) => {
    if (action === 'Modifica') {
      navigate(`/edit-cars/${data.id}`, { state: { carData: data } });
    }
    if (action === 'Elimina') {
      try {
        await deleteCar(data.id);
      } catch (err) {
        console.error('Errore durante l\'eliminazione dell\'auto:', err);
      }
    }
  };

  const tableManageCars = {
    headers: [
      { key: 'id', columnName: 'ID', type: 'Number', ordinable: true, filtrable: true },
      { key: 'brand', columnName: 'Marca', type: 'String', ordinable: true, filtrable: true },
      { key: 'model', columnName: 'Modello', type: 'String', ordinable: true, filtrable: true },
      { key: 'licensePlate', columnName: 'Targa', type: 'String', ordinable: true, filtrable: true },
      { key: 'status', columnName: 'Stato', type: 'String', ordinable: true, filtrable: true },
    ],
    currentByDefault: { key: 'id', orderby: 'asc' },
    pagination: { itemsPerPage: 10, currentPage: 1 },
    actions: {
      actions: [
        { name: 'Modifica', visible: () => true },
        { name: 'Elimina', visible: () => true }
      ]
    }
  };

  if (loading) {
    return <p>Caricamento auto...</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>Errore nel caricamento delle auto: {error.message || 'Errore sconosciuto'}</p>;
  }

  return (
    <div className="manage-cars-container">
      <h2 className="title">Gestisci auto</h2>
      <Table
        config={tableManageCars}
        data={cars}
        onActionClick={({ action, row }) => handleActionClick(action, row)}
      />
    </div>
  );
};

export default ManageCars;
