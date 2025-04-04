import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Button from '../button/Button';

interface NavButton {
  label: string;
  action: () => void;
}

interface NavbarProps {
  buttons?: NavButton[];
  username?: string;
}

const Navbar: React.FC<NavbarProps> = ({ buttons = [], username }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      {buttons.map((button, index) => (
        <Button
          key={index}
          label={button.label}
          onClick={button.action}
        />
      ))}
      
      {username && (
        <div className="user-info">
          <span>Welcome, {username}</span>
          <Button 
            label="Logout" 
            onClick={handleLogout}
          />
        </div>
      )}
    </nav>
  );
};

export default Navbar;