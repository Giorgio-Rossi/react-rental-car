import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table } from '../table/table';
import { useUser } from '../../hooks/useUser';
import { useAuth } from '../../hooks/useAuth';
import './manage-users.css';

const ManageUsers = () => {
  const navigate = useNavigate();
  const { user: loggedInUser } = useAuth();
  const { users, getUsers, deleteUser, loading, error, getUserByUserId } = useUser();

  useEffect(() => {
    if (!loggedInUser || loggedInUser.role !== 'ROLE_ADMIN') {
      navigate('/home');
      return;
    }
    getUsers();
  }, [loggedInUser, navigate, getUsers]);

  const handleActionClick = async ({ action, row: userData }) => {
    if (action === 'Modifica') {
      try {
        const userDetails = await getUserByUserId(userData.id);

        navigate(`/edit-user/${userData.id}`, { state: { userData: userDetails } });
      } catch (err) {
        console.error('Errore durante il recupero dell\'utente:', err);
      }
    } else if (action === 'Elimina') {
      const confirmDelete = window.confirm(`Sei sicuro di voler eliminare l'utente ${userData.username}?`);
      if (confirmDelete) {
        try {
          await deleteUser(userData.id);
        } catch (err) {
          console.error('Errore durante l\'eliminazione dell\'utente:', err);
        }
      }
    }
  };

  const tableManageUser = {
    headers: [
      { key: 'id', columnName: 'Id utente', type: 'Number', ordinable: true, filtrable: true },
      { key: 'username', columnName: 'Username', type: 'String', ordinable: true, filtrable: true },
      { key: 'fullName', columnName: 'Nome Completo', type: 'String', ordinable: true, filtrable: true },
      { key: 'email', columnName: 'Email', type: 'String', ordinable: true, filtrable: true },
      { key: 'role', columnName: 'Ruolo', type: 'String', ordinable: true, filtrable: true },
      { key: 'password', columnName: 'Password', type: 'String', ordinable: true, filtrable: true },
    ],
    currentByDefault: { key: 'id', orderby: 'asc' },
    pagination: { itemsPerPage: 10, currentPage: 1 },
    actions: {
      actions: [
        { name: 'Modifica', visible: () => true },
        { name: 'Elimina', visible: () => true }
      ]
    }
  };

  if (loading) {
    return <div className="manage-users-container"><p>Caricamento utenti...</p></div>;
  }

  if (error) {
    return <div className="manage-users-container"><p style={{ color: 'red' }}>Errore nel caricamento degli utenti: {error.message || 'Errore sconosciuto'}</p></div>;
  }

  return (
    <div className="manage-users-container">
      <h2 className="title">Gestisci utenti</h2>
      <Table
        config={tableManageUser}
        data={users}
        onActionClick={handleActionClick}
      />
    </div>
  );
};

export default ManageUsers;
