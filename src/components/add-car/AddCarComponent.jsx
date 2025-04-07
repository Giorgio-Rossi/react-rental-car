import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useCar } from '../../hooks/useCar';
import './add-car.css';

const AddCarComponent = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { createCar } = useCar();

  const [car, setCar] = useState({
    id: 0,
    brand: '',
    model: '',
    licensePlate: '',
    status: 'Disponibile',
    updatedAt: new Date().toISOString(),
  });

  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (user?.role !== 'ROLE_ADMIN') {
      navigate('/home');
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCar(prev => ({ ...prev, [name]: value }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
  };

  const isValid = car.brand && car.model && car.licensePlate && car.status;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (user?.role === 'ROLE_ADMIN') {
      try {
        await createCar(car);
        resetForm();
        navigate('/manage-cars');
      } catch (error) {
        console.error("Errore nel salvataggio dell'auto:", error);
      }
    } else {
      navigate('/home');
    }
  };

  const resetForm = () => {
    setCar({
      id: 0,
      brand: '',
      model: '',
      licensePlate: '',
      status: 'Disponibile',
      updatedAt: new Date().toISOString(),
    });
    setTouched({});
  };

  return (
    <div className="add-car-container">
      <h2>Aggiungi una nuova auto</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="brand">Marca</label>
          <input
            type="text"
            id="brand"
            name="brand"
            value={car.brand}
            onChange={handleChange}
            onBlur={handleBlur}
            required
          />
          {touched.brand && !car.brand && (
            <div className="error-message">Il campo "Marca" è obbligatorio.</div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="model">Modello</label>
          <input
            type="text"
            id="model"
            name="model"
            value={car.model}
            onChange={handleChange}
            onBlur={handleBlur}
            required
          />
          {touched.model && !car.model && (
            <div className="error-message">Il campo "Modello" è obbligatorio.</div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="licensePlate">Targa</label>
          <input
            type="text"
            id="licensePlate"
            name="licensePlate"
            value={car.licensePlate}
            onChange={handleChange}
            onBlur={handleBlur}
            required
          />
          {touched.licensePlate && !car.licensePlate && (
            <div className="error-message">Il campo "Targa" è obbligatorio.</div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="status">Stato</label>
          <select
            id="status"
            name="status"
            value={car.status}
            onChange={handleChange}
            onBlur={handleBlur}
            required
          >
            <option value="Disponibile">Disponibile</option>
            <option value="In uso">Non disponibile</option>
            <option value="Manutenzione">Manutenzione</option>
          </select>
          {touched.status && !car.status && (
            <div className="error-message">Il campo "Stato" è obbligatorio.</div>
          )}
        </div>

        <button type="submit" disabled={!isValid}>Aggiungi auto</button>
      </form>
    </div>
  );
};

export default AddCarComponent;
