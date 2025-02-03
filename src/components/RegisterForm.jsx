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
    <div className="card text-center" style={{ margin: '50px auto', width: '400px' }}>
      <div className="card-body">
        <h2 className="card-title mb-4">Registro</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="exampleInputEmail1" className="form-label">Usuario</label>
            <input
              type="text"
              className="form-control"
              id="exampleInputEmail1"
              placeholder="Usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="exampleInputPassword1" className="form-label">Contraseña</label>
            <input
              type="password"
              className="form-control"
              id="exampleInputPassword1"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="exampleInputEmail2" className="form-label">Correo Electrónico</label>
            <input
              type="email"
              className="form-control"
              id="exampleInputEmail2"
              placeholder="Correo Electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary">Registrarse</button>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;
