import React from 'react';
import { useNavigate } from 'react-router-dom';
import RegisterForm from '../components/RegisterForm';
import Navbar from '../layout/Navegacion';

const RegisterPage = () => {
  const navigate = useNavigate();


  const handleRegisterSuccess = () => {
    alert('¡Registro exitoso!');
    navigate('/'); 
  };
  
  return (
    <div>
      <Navbar/>
       <RegisterForm onRegisterSuccess={handleRegisterSuccess}/> 
    </div>
  );
};

export default RegisterPage;
