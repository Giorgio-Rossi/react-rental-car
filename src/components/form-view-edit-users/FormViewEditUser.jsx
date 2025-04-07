import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useUser } from '../../hooks/useUser'; 
import Button from '../button/Button';
import './form-view-edit-users.css'; 

const FormViewEditUser = () => {
  const { id } = useParams(); L
  const navigate = useNavigate();
  const { updateUser, getUser } = useUser(); 
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 
  const roleOptions = ['ROLE_ADMIN', 'ROLE_USER']; 

  useEffect(() => {
    const loadUserData = async () => {
      setLoading(true);
      setError(null);
      const navigationData = history.state?.userData;

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
               throw new Error("Utente non trovato");
            }

          } else {
             throw new Error("ID utente mancante nell'URL");
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
  }, [id, getUser]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData(prevData => ({ ...prevData, [name]: value }));
  };


  const saveUser = async () => {
    if (userData) {
      try {
        await updateUser(userData); 
        navigate('/manage-users');
      } catch (error) {
        console.error('Errore durante l\'aggiornamento dell\'utente:', error);
        setError(error.message || 'Errore durante il salvataggio.');
      }
    }
  };

  const buttonConfig = [
    { label: 'Salva', action: saveUser },
    { label: 'Chiudi', action: () => navigate('/manage-users') },
  ];

  const capitalize = (str) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const objectKeys = (obj) => {
    return Object.keys(obj || {});
  };


  if (loading) {
    return <div>Caricamento dati utente...</div>;
  }

  if (error) {
      return <div style={{ color: 'red' }}>Errore: {error}</div>;
  }

  if (!userData) {
    return <div>Nessun dato utente disponibile.</div>;
  }


  return (
    <div className="edit-user-container"> 
      <h3>Modifica Utente</h3>
      <form onSubmit={(e) => e.preventDefault()}>
        {objectKeys(userData)
          .filter(key => key !== 'role' && key !== 'id') 
          .map(key => (
            <div className="form-group" key={key}>
              <label htmlFor={key}>{capitalize(key)}</label>
              <input
                type={key === 'password' ? 'password' : 'text'} 
                id={key}
                name={key}
                value={userData[key] || ''} 
                onChange={handleChange}
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

        {buttonConfig.map((button, index) => (
          <Button
            key={index}
            config={{ label: button.label }} 
            onClick={button.action} 
          />
        ))}
      </form>
    </div>
  );
};

export default FormViewEditUser;