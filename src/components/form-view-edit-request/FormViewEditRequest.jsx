import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCarRequest } from '../../hooks/useCarRequest'; 
import { useCar } from '../../hooks/useCar'; 
import Button from '../button/Button'; 
import './form-view-edit-request.css'; 

const FormViewEditRequest = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { updateRequest } = useCarRequest();
  const { cars, getCars } = useCar(); 
  const [requestData, setRequestData] = useState(null);
  const [title, setTitle] = useState('Dettaglio Richiesta');
  const [availableCars, setAvailableCars] = useState([]);


  useEffect(() => {
    const loadData = async () => {
      await getCars(); 
      const navigationData = history.state?.requestData;

      if (navigationData) {
        setRequestData(prevData => ({
          ...navigationData,
          startReservation: convertToDateInputFormat(navigationData.startReservation),
          endReservation: convertToDateInputFormat(navigationData.endReservation)
        }));

      } else {
          console.warn("Nessun dato di navigazione ricevuto per la richiesta con id:", id);
      }
    };

    loadData();
  }, [getCars, id, navigate]);


  useEffect(() => {
    if (cars && cars.length > 0) {
      setAvailableCars(cars);
    }
  }, [cars]);


  const convertToDateInputFormat = (date) => {
    if (!date) return '';
    const d = new Date(date);
    const year = d.getFullYear();
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();

    if (month.length < 2)
      month = '0' + month;
    if (day.length < 2)
      day = '0' + day;

    return [year, month, day].join('-');
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    setRequestData({ ...requestData, [name]: value });
  };

  const saveRequest = async () => {
    if (requestData) {
      try {
        const updatedRequest = {
          ...requestData,
          startReservation: new Date(requestData.startReservation).toISOString(),
          endReservation: new Date(requestData.endReservation).toISOString()
        };
        await updateRequest(id, updatedRequest);
        navigate('/home');
      } catch (error) {
        console.error('Errore durante il salvataggio:', error);
      }
    }
  };

  const objectKeys = (obj) => {
    return Object.keys(obj || {});
  };

  const buttonConfig = [
    { label: 'Salva', action: saveRequest },
    { label: 'Chiudi', action: () => navigate('/home') },
  ];


  if (!requestData) {
    return <div>Caricamento...</div>;
  }


  return (
    <div className="form-container">
      <h3>{title}</h3>
      <form>
        {objectKeys(requestData).map(key => (
          <React.Fragment key={key}>
            {key === 'carId' ? (
              <div className="form-group">
                <label htmlFor="car">Seleziona Auto</label>
                <select
                  name="carId"
                  value={requestData[key]}
                  onChange={handleChange}
                  required
                >
                  {availableCars.map(car => (
                    <option key={car.id} value={car.id}>
                      {car.brand} - {car.model}
                    </option>
                  ))}
                </select>
              </div>
            ) : key !== 'id' && key !== 'carId' ? (
              <div className="form-group">
                <label>{key}</label>
                <input
                  type="text"
                  name={key}
                  value={requestData[key]}
                  onChange={handleChange}
                  disabled={key !== 'startReservation' && key !== 'endReservation'}
                />
              </div>
            ) : null}
          </React.Fragment>
        ))}
      </form>

      {buttonConfig.map((button, index) => (
        <Button
          key={index}
          config={{ label: button.label, action: button.action }}
          onClick={button.action}
        />
      ))}
    </div>
  );
};

export default FormViewEditRequest;