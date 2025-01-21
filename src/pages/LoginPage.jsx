import React from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';
import Navbar from '../layout/Navegacion';

const LoginPage = () => {
  const navigate = useNavigate();

  const handleLoginSuccess = () => {
    const role = localStorage.getItem('role');
    navigate(role === 'admin' ? '/admin' : '/');
  };

  const handleRegisterSuccess = () => {
    alert('¡Registro exitoso!'); 
  };
  
  return (
    <div>
      <Navbar/>
      <LoginForm onLoginSuccess={handleLoginSuccess} />
      <div>
       <RegisterForm onRegisterSuccess={handleRegisterSuccess}/> 
      </div>
    </div>
  );
};

export default LoginPage;
