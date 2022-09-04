import React, { useState } from 'react';
import { Button, Paper, TextField } from '@material-ui/core';
import { login } from './networkCalls';

export const Login: React.FC = () => {

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  
  const inputStyle = {
    margin: 10,
  }

  const style = {
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translateY(-50%) translateX(-50%)',
    display: 'flex',
    flexDirection: 'column',
    width: '200px',
  }

  const handleClick = async () => {
    try {
      await login({username, password})
      window.location.reload()
    } catch (e) {
      alert("Login failed")
    }
  }

  return (
    <Paper style={style as React.CSSProperties}>
      <TextField
        value={username}
        onChange={e => setUsername(e.target.value)}
        style={inputStyle}
        label="Username"
        variant="outlined"
      />
      <TextField
        value={password}
        onChange={e => setPassword(e.target.value)}
        style={inputStyle}
        label="Password"
        variant="outlined"
        type={'password'}
      />
      <Button onClick={handleClick} style={inputStyle} variant='contained'>Login</Button>
    </Paper>
  );
};