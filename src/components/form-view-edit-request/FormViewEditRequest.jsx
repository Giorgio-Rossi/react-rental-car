import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCarRequest } from '../../hooks/useCarRequest';
import { useCar } from '../../hooks/useCar';
import Button from '../button/Button';
import './form-view-edit-request.css';

const FormViewEditRequest = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { updateRequest, getRequest } = useCarRequest();
  const { cars, getCars } = useCar();

  const [requestData, setRequestData] = useState(null);
  const [availableCars, setAvailableCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [title] = useState('Dettaglio Richiesta');

  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      setError(null);
      try {
        await getCars();
        const fetchedRequest = await getRequest(id);
        setRequestData({
          ...fetchedRequest,
          startReservation: convertToDateInputFormat(fetchedRequest.startReservation),
          endReservation: convertToDateInputFormat(fetchedRequest.endReservation)
        });
      } catch (err) {
        console.error("Errore durante il caricamento:", err);
        setError(err.message || 'Errore nel caricamento dei dati.');
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, [id, getCars, getRequest]);

  useEffect(() => {
    if (cars && cars.length > 0) {
      setAvailableCars(cars);
    }
  }, [cars]);

  const convertToDateInputFormat = (date) => {
    if (!date) return '';
    try {
      const d = new Date(date);
      if (isNaN(d.getTime())) return '';
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    } catch (e) {
      console.error("Errore nella formattazione della data:", date, e);
      return '';
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRequestData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveChanges = async () => {
    if (!requestData) return;

    setError(null);
    try {
      const requestToSend = {
        ...requestData,
        startReservation: requestData.startReservation ? new Date(requestData.startReservation).toISOString() : null,
        endReservation: requestData.endReservation ? new Date(requestData.endReservation).toISOString() : null
      };
      await updateRequest(id, requestToSend);
      navigate('/home');
    } catch (err) {
      console.error('Errore durante il salvataggio:', err);
      setError(err.message || 'Errore durante il salvataggio.');
    }
  };

  const handleClose = () => navigate('/home');

  if (loading) return <div className="form-container">Caricamento...</div>;

  if (error && !requestData) {
    return (
      <div className="form-container error-message">
        <h3>Errore</h3>
        <p>{error}</p>
        <Button config={{ label: 'Indietro' }} onClick={handleClose} />
      </div>
    );
  }

  if (!requestData) return <div className="form-container">Nessun dato richiesta disponibile.</div>;

  return (
    <div>
    <h3>{title}</h3>
    {error && <p style={{ color: 'red' }}>{error}</p>}

    <form onSubmit={(e) => e.preventDefault()}>
      {Object.keys(requestData)
        .filter(key => key !== 'id')
        .map(key => {
          if (key === 'carId' || key === 'carID') {
            return (
              <div key="carIdSelect">
                <label>Seleziona Auto</label>
                <select
                  name="carId"
                  value={requestData.carId || requestData.carID || ''}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>-- Seleziona un'auto --</option>
                  {availableCars.map(car => (
                    <option key={car.id} value={car.id}>
                      {car.brand} - {car.model} ({car.licensePlate})
                    </option>
                  ))}
                </select>
              </div>
            );
          } else if (key === 'startReservation' || key === 'endReservation') {
            return (
              <div key={key}>
                <label>{key === 'startReservation' ? 'Data Inizio' : 'Data Fine'}</label>
                <input
                  type="date"
                  name={key}
                  value={requestData[key] || ''}
                  onChange={handleChange}
                  required
                />
              </div>
            );
          } else if (!['userId', 'userID', 'status', 'userFullName', 'carDetails'].includes(key)) {
            return (
              <div key={key}>
                <label>{key}</label>
                <input
                  type="text"
                  name={key}
                  value={requestData[key] || ''}
                  onChange={handleChange}
                />
              </div>
            );
          }
          return null;
        })}
    </form>

    <div>
      <Button config={{ label: 'Salva' }} onClick={handleSaveChanges} />
      <Button config={{ label: 'Chiudi' }} onClick={handleClose} />
    </div>
  </div>
  );
};

export default FormViewEditRequest;
