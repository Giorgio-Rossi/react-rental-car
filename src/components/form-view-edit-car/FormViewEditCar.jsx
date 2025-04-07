import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth'; 
import { useCar } from '../../hooks/useCar'; 
import Button from '../button/Button';
import './form-view-edit-car.css';

const FormViewEditCar = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user: loggedInUser } = useAuth();
  const { updateCar } = useCar();
  const [carData, setCarData] = useState(null);
  const [title, setTitle] = useState('Dettagli auto');
  const statusOptions = ['Disponibile', 'Non disponibile', 'In manutenzione'];

  useEffect(() => {
    if (loggedInUser?.role !== 'ROLE_ADMIN') {
      navigate('/home');
      return;
    }

    const navigationData = history.state?.carData; 
    if (navigationData) {
      setCarData(navigationData);
    } else {
      console.warn("Nessun dato di navigazione ricevuto per l'auto con id:", id);
    
    }
  }, [loggedInUser, navigate, id]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setCarData({ ...carData, [name]: value });
  };

  const saveCar = async () => {
    if (carData) {
      try {
        await updateCar(carData);
        navigate('/manage-cars');
      } catch (error) {
        console.error('Errore durante l\'aggiornamento dell\'auto:', error);
      }
    }
  };

  const buttonConfig = [
    { label: 'Salva', action: saveCar },
    { label: 'Chiudi', action: () => navigate('/manage-cars') },
  ];

  const objectKeys = (obj) => {
    return Object.keys(obj || {}); 
  };

  if (!carData) {
    return <div>Caricamento...</div>; 
  }

  return (
    <div className="form-container">
      <h3>{title}</h3>
      <form>
        {objectKeys(carData).map(key => (
          key !== 'status' && key !== 'id' ? (
            <div className="form-group" key={key}>
              <label>{key}</label>
              <input
                type="text"
                name={key}
                value={carData[key]}
                onChange={handleChange}
              />
            </div>
          ) : key === 'status' ? (
            <div key="status">
              <label htmlFor="status">Stato macchina</label>
              <select
                id="status"
                name="status"
                value={carData.status}
                onChange={handleChange}
              >
                {statusOptions.map(status => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          ) : null 
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

export default FormViewEditCar;