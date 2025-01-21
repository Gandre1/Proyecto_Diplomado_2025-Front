import React, { useState } from 'react';
import api from '../services/api';
import { setToken } from '../utils/auth';

const RegisterForm = ({ onRegisterSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [role] = useState('cliente'); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/users/register', { username, password, email, role });
      setToken(response.data.token);
      localStorage.setItem('role', response.data.role);
      onRegisterSuccess();
    } catch (error) {
      alert('Error al registrar: ' + error.response.data.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Registro</h2>
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
      <input
        type="email"
        placeholder="Correo Electrónico"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button type="submit">Registrarse</button>
    </form>
  );
};

export default RegisterForm;
