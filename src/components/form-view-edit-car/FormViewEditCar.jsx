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
  const { updateCar, getCarByCarId } = useCar();
  const [carData, setCarData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const title = 'Dettagli auto';
  const statusOptions = ['Disponibile', 'Non disponibile', 'In manutenzione'];

  useEffect(() => {
    if (loggedInUser?.role !== 'ROLE_ADMIN') {
      navigate('/home');
      return;
    }

    const loadCarData = async () => {
      setLoading(true);
      setError(null);
      try {
        const fetchedCar = await getCarByCarId(id);
        setCarData(fetchedCar);
      } catch (err) {
        console.error("Errore durante il caricamento dell'auto:", err);
        setError(err.message || 'Errore nel caricamento dei dati auto.');
      } finally {
        setLoading(false);
      }
    };

    if (loggedInUser) {
      loadCarData();
    }
  }, [loggedInUser, navigate, id, getCarByCarId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCarData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveChanges = async () => {
    try {
      await updateCar(carData);
      navigate('/manage-cars');
    } catch (err) {
      console.error('Errore aggiornamento auto:', err);
      setError(err.message || 'Errore durante il salvataggio.');
    }
  };

  const handleClose = () => {
    navigate('/manage-cars');
  }

  if (loading) return <div className="form-container">Caricamento dati auto...</div>;

  if (error && !carData) {
    return (
      <div className="form-container error-message">
        <h3>Errore</h3>
        <p>{error}</p>
        <Button config={{ label: 'Indietro' }} onClick={handleClose} />
      </div>
    );
  }

  if (!carData) return <div className="form-container">Nessun dato auto disponibile.</div>;

  return (
    <div className="form-container">
      <h3>{title}</h3>
      {error && <p className="error-message" style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={(e) => e.preventDefault()}>
        {Object.keys(carData)
          .filter(key => key !== 'status' && key !== 'id')
          .map(key => (
            <div key={key}>
              <label>{key}</label>
              <input
                type="text"
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
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
        <div className="form-actions">
          <Button config={{ label: 'Salva' }} onClick={handleSaveChanges} />
          <Button config={{ label: 'Chiudi' }} onClick={handleClose} />
        </div>
      </form>
    </div>
  );
};

export default FormViewEditCar;
