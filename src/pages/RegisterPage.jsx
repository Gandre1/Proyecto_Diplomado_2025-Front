import React from 'react';
import { useNavigate } from 'react-router-dom';
import RegisterForm from '../components/RegisterForm';

const RegisterPage = () => {
  const navigate = useNavigate();

  const handleRegisterSuccess = (userData) => {
    alert('¡Registro exitoso!');

    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', userData.token);

    navigate('/');
  };

  return (
    <div>
      <RegisterForm onRegisterSuccess={handleRegisterSuccess} />
    </div>
  );
};

export default RegisterPage;
