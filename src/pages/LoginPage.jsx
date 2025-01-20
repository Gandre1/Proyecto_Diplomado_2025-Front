import React from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/LoginForm';

const LoginPage = () => {
  const navigate = useNavigate();

  const handleLoginSuccess = () => {
    const role = localStorage.getItem('role');
    navigate(role === 'admin' ? '/admin' : '/products');
  };

  return (
    <div>
      <LoginForm onLoginSuccess={handleLoginSuccess} />
    </div>
  );
};

export default LoginPage;
