import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table } from '../table/table';
import { UserService } from '../../service/user.service';
import { AuthService } from '../../service/auth.service';
import './manage-users.css'

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const userService = new UserService();
  const authService = new AuthService();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const fetchedUsers = await userService.getUsers();
        setUsers(fetchedUsers);
      } catch (err) {
        console.error('Errore durante il caricamento degli utenti:', err);
      }
    };

    fetchUsers();

    const userRole = authService.getUserType();
    if (userRole !== 'ROLE_ADMIN') {
      navigate('/home');
    }
  }, [navigate, userService, authService]);

  const handleActionClick = (action, data) => {
    if (action === 'Modifica') {
      navigate('/edit-user', { state: { userData: data } });
    }

    if (action === 'Elimina') {
      userService.deleteUser(data.id).then(() => {
        setUsers(users.filter(user => user.id !== data.id));
      }).catch(err => {
        console.error('Errore durante l\'eliminazione dell\'utente:', err);
      });
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
        {
          name: 'Modifica',
          visible: (row) => true,
        },
        {
          name: 'Elimina',
          visible: (row) => true,
        }
      ]
    }
  };

  return (
    <div>
      <div className="title">Gestisci utenti</div>
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
