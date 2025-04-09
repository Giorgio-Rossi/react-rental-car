import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import './navbar.css';

const Navbar = ({ buttons = [], onButtonClick, username }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-links">
        {buttons.map((button, index) => (
          <button
            key={index}
            onClick={() => onButtonClick(button.path)}
          >
            {button.label}
          </button>

        ))}
      </div>

      {username && (
        <div className="navbar-user">
          <span>Benvenuto, {username}</span>

          <button onClick={handleLogout}>
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;