import React, { useEffect } from 'react'; 
import { useNavigate } from 'react-router-dom';
import { Table } from '../table/table'; 
import { useUser } from '../../hooks/useUser';
import { useAuth } from '../../hooks/useAuth'; 

import './manage-users.css'; 

const ManageUsers = () => {
  const navigate = useNavigate();

  const { user: loggedInUser } = useAuth(); 
  const { users, fetchUsers, deleteUser, loading, error } = useUser();

  useEffect(() => {
    if (loggedInUser && loggedInUser.role !== 'ROLE_ADMIN') {
      console.log("Utente non ADMIN, reindirizzamento a /home");
      navigate('/home');
      return; 
    }

 
    if (loggedInUser?.role === 'ROLE_ADMIN') {
        console.log("Caricamento utenti per admin...");
        fetchUsers(); 
    }

  }, [loggedInUser, navigate, fetchUsers]);

  const handleActionClick = async ({ action, row: userData }) => { 
    console.log(`Azione: ${action}, Utente ID: ${userData.id}`);
    if (action === 'Modifica') {
      navigate(`/edit-user/${userData.id}`, { state: { userData: userData } });
    } else if (action === 'Elimina') {
      if (window.confirm(`Sei sicuro di voler eliminare l'utente ${userData.username}?`)) {
        try {
          await deleteUser(userData.id);
          console.log(`Utente con id ${userData.id} eliminato.`);
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
        { name: 'Modifica', visible: (row) => true },
        { name: 'Elimina', visible: (row) => true }
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
      <div>
        <Table
          config={tableManageUser}
          data={users}
          onActionClick={handleActionClick}
        />
      </div>
    </div>
  );
};

export default ManageUsers;