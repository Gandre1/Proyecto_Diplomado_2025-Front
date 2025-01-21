import React from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/LoginForm';
import Navbar from '../layout/Navegacion';

const LoginPage = () => {
  const navigate = useNavigate();

  const handleLoginSuccess = () => {
    const role = localStorage.getItem('role');
    navigate(role === 'admin' ? '/admin' : '/');
  };
  
  return (
    <div>
      <Navbar/>
      <LoginForm onLoginSuccess={handleLoginSuccess} />
    </div>
  );
};

export default LoginPage;
