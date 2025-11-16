import React from 'react';
import { Button } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';

const LogoutButton = ({ variant = 'outline-light', className = '' }) => {
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <Button 
      variant={variant} 
      onClick={handleLogout}
      className={className}
    >
      Logout
    </Button>
  );
};

export default LogoutButton;

