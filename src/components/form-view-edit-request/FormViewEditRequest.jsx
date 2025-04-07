import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useCarRequest } from '../../hooks/useCarRequest';
import { useCar } from '../../hooks/useCar';
import Button from '../button/Button';
import './form-view-edit-request.css';

const FormViewEditRequest = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { updateRequest, getRequest } = useCarRequest(); 
  const { cars, getCars } = useCar();

  const [requestData, setRequestData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [title, setTitle] = useState('Dettaglio Richiesta');
  const [availableCars, setAvailableCars] = useState([]);

  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      setError(null);
      try {
        await getCars();
        const navigationData = location.state?.requestData;

        if (navigationData) {
          setRequestData(prevData => ({
            ...navigationData,
            startReservation: convertToDateInputFormat(navigationData.startReservation),
            endReservation: convertToDateInputFormat(navigationData.endReservation)
          }));
          setLoading(false);
        } else if (id && getRequest) {
          const fetchedRequest = await getRequest(id);
          if (fetchedRequest) {
             setRequestData(prevData => ({
                ...fetchedRequest,
                startReservation: convertToDateInputFormat(fetchedRequest.startReservation),
                endReservation: convertToDateInputFormat(fetchedRequest.endReservation)
             }));
          } else {
            throw new Error(`Richiesta con ID ${id} non trovata.`);
          }
          setLoading(false);
        } else {
            throw new Error("ID richiesta mancante o funzione getRequest non disponibile.");
        }
      } catch (err) {
         console.error("Errore durante il caricamento dei dati della richiesta:", err);
         setError(err.message || 'Errore nel caricamento dei dati.');
         setLoading(false);
      }
    };

    loadInitialData();
  }, [id, getCars, getRequest, location.state]);

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
        let month = '' + (d.getMonth() + 1);
        let day = '' + d.getDate();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return [year, month, day].join('-');
    } catch (e) {
        console.error("Error formatting date:", date, e);
        return '';
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRequestData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleSaveChanges = async () => {
    if (requestData) {
      setError(null);
      try {
        const requestToSend = {
          ...requestData,
          startReservation: requestData.startReservation ? new Date(requestData.startReservation).toISOString() : null,
          endReservation: requestData.endReservation ? new Date(requestData.endReservation).toISOString() : null
        };
        await updateRequest(id, requestToSend);
        navigate('/home');
      } catch (error) {
        console.error('Errore durante il salvataggio:', error);
        setError(error.message || 'Errore durante il salvataggio.');
      }
    }
  };

  const handleClose = () => {
    navigate('/home');
  };

  const objectKeys = (obj) => {
    return Object.keys(obj || {});
  };

  if (loading) {
    return <div className="form-container">Caricamento...</div>;
  }

  if (error && !requestData) {
     return (
       <div className="form-container error-message">
         <h3>Errore</h3>
         <p>{error}</p>
         <Button config={{ label: 'Indietro' }} onClick={handleClose} />
       </div>
     );
  }

  if (!requestData) {
    return <div className="form-container">Nessun dato richiesta disponibile.</div>;
  }

  return (
    <div className="form-container">
      <h3>{title}</h3>
       {error && <p className="error-message" style={{color: 'red'}}>{error}</p>}

      <form onSubmit={(e) => e.preventDefault()}>
        {objectKeys(requestData)
            .filter(key => key !== 'id')
            .map(key => {
                if (key === 'carId' || key === 'carID') {
                    return (
                        <div className="form-group" key="carIdSelect">
                            <label htmlFor="car">Seleziona Auto</label>
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
                        <div className="form-group" key={key}>
                            <label htmlFor={key}>{key === 'startReservation' ? 'Data Inizio' : 'Data Fine'}</label>
                            <input
                                type="date"
                                id={key}
                                name={key}
                                value={requestData[key] || ''} 
                                onChange={handleChange}
                                required
                            />
                        </div>
                    );
                } else if (key !== 'userId' && key !== 'userID' && key !== 'status' && key !== 'userFullName' && key !== 'carDetails') {
                    return (
                        <div className="form-group" key={key}>
                            <label htmlFor={key}>{key.charAt(0).toUpperCase() + key.slice(1)}</label>
                            <input
                            type="text"
                            id={key}
                            name={key}
                            value={requestData[key] || ''}
                            onChange={handleChange}
                            />
                        </div>
                    );
                }
                return null; // Non renderizzare altri campi come userId, status, etc.
        })}
      </form>

      <div className="form-actions">
        <Button
          config={{ label: 'Salva' }}
          onClick={handleSaveChanges}
        />
        <Button
          config={{ label: 'Chiudi' }}
          onClick={handleClose}
        />
      </div>
    </div>
  );
};

export default FormViewEditRequest;