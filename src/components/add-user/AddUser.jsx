import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useUser } from '../../hooks/useUser';
import './AddUser.css';

const AddUser = () => {
  const navigate = useNavigate();
  const { createUser } = useUser();
  const { user: loggedInUser } = useAuth();
  const [user, setUser] = useState({
    id: 0,
    username: '',
    fullName: '',
    email: '',
    role: 'CUSTOMER',
    password: '',
    created_at: new Date(),
    updated_at: new Date(),
  });

  useEffect(() => {
    if (loggedInUser?.role !== 'ROLE_ADMIN') {
      navigate('/home');
    }
  }, [loggedInUser, navigate]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const saveUser = async (e) => {
    e.preventDefault();
    try {
      const newUser = {
        ...user,
        created_at: new Date(),
        updated_at: new Date()
      };
      await createUser(newUser);
      navigate('/manage-users');
    } catch (error) {
      console.error('Errore nel salvataggio dell\'utente:', error);
      console.error('Status:', error.response?.status);
      console.error('Message:', error.message);
      if (error.response?.data) {
        console.error('Error Body:', error.response.data);
      }
    }
  };
  
  return (
    <div className="add-user-container">
      <h2>Aggiungi Utente</h2>
      <form onSubmit={saveUser} className="user-form">
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            name="username"
            value={user.username}
            onChange={handleChange}
            required
            id="username"
          />
        </div>

        <div className="form-group">
          <label htmlFor="fullName">Nome Completo:</label>
          <input
            type="text"
            name="fullName"
            value={user.fullName}
            onChange={handleChange}
            required
            id="fullName"
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            name="email"
            value={user.email}
            onChange={handleChange}
            required
            id="email"
          />
        </div>

        <div className="form-group">
          <label htmlFor="role">Ruolo:</label>
          <select
            name="role"
            value={user.role}
            onChange={handleChange}
            required
            id="role"
          >
            <option value="ROLE_ADMIN">Admin</option>
            <option value="ROLE_USER">User</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            name="password"
            value={user.password}
            onChange={handleChange}
            required
            id="password"
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            Salva
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate('/manage-users')}
          >
            Annulla
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddUser;