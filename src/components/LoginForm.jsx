import React, { useState } from 'react';
import api from '../services/api';
import { setToken } from '../utils/auth';

const LoginForm = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/users/login', { username, password });
      setToken(response.data.token);
      localStorage.setItem('role', response.data.role);
      onLoginSuccess();
    } catch (error) {
      alert('Error al iniciar sesión: ' + error.response.data.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Iniciar Sesión</h2>
      <input
        type="text"
        placeholder="Usuario"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Iniciar Sesión</button>
    </form>
  );
};

export default LoginForm;
