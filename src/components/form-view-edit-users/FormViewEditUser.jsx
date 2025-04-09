import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useUser } from '../../hooks/useUser';
import Button from '../button/Button';
import './form-view-edit-users.css';

const FormViewEditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { updateUser, getUser } = useUser();

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const roleOptions = ['ROLE_ADMIN', 'ROLE_USER'];

  useEffect(() => {
    const loadUserData = async () => {
      setLoading(true);
      setError(null);
      const navigationData = location.state?.userData;

      if (navigationData) {
        setUserData(navigationData);
        setLoading(false);
      } else {
        try {
          if (id) {
            const fetchedUser = await getUser(id);
            if (fetchedUser) {
              setUserData(fetchedUser);
            } else {
              throw new Error(`Utente con ID ${id} non trovato.`);
            }
          } else {
            throw new Error("ID utente mancante nell'URL.");
          }
        } catch (err) {
          console.error("Errore durante il caricamento dell'utente:", err);
          setError(err.message || 'Errore nel caricamento dei dati utente.');
        } finally {
          setLoading(false);
        }
      }
    };

    loadUserData();
  }, [id, getUser, location.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSaveChanges = async () => {
    if (userData) {
      setError(null);
      try {
        await updateUser(userData);
        navigate('/manage-users');
      } catch (error) {
        console.error('Errore durante l\'aggiornamento dell\'utente:', error);
        setError(error.message || 'Errore durante il salvataggio.');
      }
    }
  };

  const handleClose = () => {
    navigate('/manage-users');
  };

  const capitalize = (str) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const objectKeys = (obj) => {
    return Object.keys(obj || {});
  };

  if (loading) {
    return <div className="form-container">Caricamento dati utente...</div>;
  }

  if (error && !userData) {
    return (
      <div className="form-container error-message">
        <h3>Errore</h3>
        <p>{error}</p>
        <Button config={{ label: 'Indietro' }} onClick={handleClose} />
      </div>
    );
  }

  if (!userData) {
    return <div className="form-container">Nessun dato utente disponibile.</div>;
  }

  return (
    <div className="edit-user-container form-container">
      <h3>Modifica Utente</h3>
      {error && <p className="error-message" style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={(e) => e.preventDefault()}>
        {objectKeys(userData)
          .filter(key => key !== 'role' && key !== 'id' && key !== 'password')
          .map(key => (
            <div className="form-group" key={key}>
              <label htmlFor={key}>{capitalize(key)}</label>
              <input
                type={'text'}
                id={key}
                name={key}
                value={userData[key] || ''}
                onChange={handleChange}
                disabled={key === 'username'}
              />
            </div>
          ))}

        <div className="form-group">
          <label htmlFor="role">Ruolo utente</label>
          <select
            id="role"
            name="role"
            value={userData.role}
            onChange={handleChange}
          >
            {roleOptions.map(role => (
              <option key={role} value={role}>
                {role === 'ROLE_ADMIN' ? 'Admin' : 'User'}
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

export default FormViewEditUser;