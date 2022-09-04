import { Button } from '@material-ui/core';
import React from 'react';

export const LogoutButton: React.FC = () => {

  const logoutButtonStyle = {
    position: 'absolute',
    right: '5px',
    top: '5px',
  } as React.CSSProperties

  const handleClick = () => {
    localStorage.setItem('token', '')
    window.location.reload()
  }

  return (
    <Button style={logoutButtonStyle} onClick={handleClick}>
      Logout
    </Button>
  );
};