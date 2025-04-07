import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useCar } from '../../hooks/useCar';
import Button from '../button/Button';
import './form-view-edit-car.css';

const FormViewEditCar = () => {
  const navigate = useNavigate();
  const { id } = useParams(); 
  const location = useLocation();
  const { user: loggedInUser } = useAuth();
  const { updateCar, getCar } = useCar();

  const [carData, setCarData] = useState(null);
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 
  const [title, setTitle] = useState('Dettagli auto');
  const statusOptions = ['Disponibile', 'Non disponibile', 'In manutenzione'];

  useEffect(() => {
    if (loggedInUser && loggedInUser.role !== 'ROLE_ADMIN') {
      navigate('/home');
      return; 
    }

    const loadCarData = async () => {
      setLoading(true);
      setError(null);
      const navigationData = location.state?.carData;

      if (navigationData) {
        console.log("Dati auto ricevuti dallo stato di navigazione:", navigationData);
        setCarData(navigationData);
        setLoading(false);
      } else {
        console.log("Nessun dato auto nello stato di navigazione, caricamento tramite ID:", id);
        try {
          if (id) {
            const fetchedCar = await getCar(id); 
            if (fetchedCar) {
              setCarData(fetchedCar);
            } else {
              throw new Error(`Auto con ID ${id} non trovata.`);
            }
          } else {
            throw new Error("ID auto mancante nell'URL.");
          }
        } catch (err) {
          console.error("Errore durante il caricamento dell'auto:", err);
          setError(err.message || 'Errore nel caricamento dei dati auto.');
        } finally {
          setLoading(false);
        }
      }
    };

    if (loggedInUser) {
        loadCarData();
    }

  }, [loggedInUser, navigate, id, getCar, location.state]); 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCarData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSaveChanges = async () => {
    if (carData) {
      setError(null); 
      try {
        await updateCar(carData); 
        console.log("Auto aggiornata con successo.");
        navigate('/manage-cars'); 
      } catch (error) {
        console.error('Errore durante l\'aggiornamento dell\'auto:', error);
        setError(error.message || 'Errore durante il salvataggio.'); 
      }
    }
  };

  const handleClose = () => {
    navigate('/manage-cars'); 
  };

  const objectKeys = (obj) => {
    return Object.keys(obj || {}); 
  };

  if (loading) {
    return <div className="form-container">Caricamento dati auto...</div>;
  }

  if (error && !carData) { 
    return (
      <div className="form-container error-message">
        <h3>Errore</h3>
        <p>{error}</p>
        <Button config={{ label: 'Indietro' }} onClick={handleClose} />
      </div>
    );
  }

  if (!carData) {
    return <div className="form-container">Nessun dato auto disponibile.</div>;
  }

  return (
    <div className="form-container">
      <h3>{title}</h3>
      {error && <p className="error-message" style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={(e) => e.preventDefault()}>
        {objectKeys(carData)
          .filter(key => key !== 'status' && key !== 'id')
          .map(key => (
            <div className="form-group" key={key}>
              <label htmlFor={key}>{key.charAt(0).toUpperCase() + key.slice(1)}</label>
              <input
                type="text"
                id={key}
                name={key}
                value={carData[key] || ''} 
                onChange={handleChange}
              />
            </div>
          ))}

        <div className="form-group">
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
      </form>
    </div>
  );
};

export default FormViewEditCar;