import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CarService } from '../../service/car.service.service';
import { ManageCarsService } from '../../service/manage-cars.service';
import { Table } from '../table/table'; 

const ManageCars = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const carService = new CarService();
  const manageCarsService = new ManageCarsService();

  useEffect(() => {
    const userRole = localStorage.getItem('userRole'); 
    if (userRole !== 'ROLE_ADMIN') {
      navigate('/home');
    }

    loadCars();
  }, [navigate]);

  const loadCars = async () => {
    try {
      const fetchedCars = await manageCarsService.getAllCars();
      setCars(fetchedCars);
    } catch (error) {
      console.error('Errore durante il caricamento delle auto:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleActionClick = (action, data) => {
    if (action === 'Modifica') {
      navigate(`/edit-cars/${data.id}`, { state: { carData: data } });
    }
    if (action === 'Elimina') {
      carService.deleteCar(data.id).then(() => {
        setCars(cars.filter(car => car.id !== data.id));
      }).catch(err => {
        console.error('Errore durante l\'eliminazione dell\'auto:', err);
      });
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

  return (
    <div className="manage-cars-container">
      <h2 className="title">Gestisci auto</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <Table
          config={tableManageCars}
          data={cars}
          clickAction={handleActionClick}
        />
      )}
    </div>
  );
};

export default ManageCars;
