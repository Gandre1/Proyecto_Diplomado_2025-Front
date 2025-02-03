import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import ProductsPage from '../pages/ProductsPage';
import AdminPage from '../pages/AdminPage';
import RegisterPage from '../pages/RegisterPage';
import LapidasPage from '../pages/LapidasPage';
import CarritoPage from '../pages/CarritoPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<ProductsPage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/admin' element={<AdminPage />} />
        <Route path='/registrarse' element={<RegisterPage />} />
        <Route path='/carrito' element={<CarritoPage />} />
        <Route path='/product/lapida/:id' element={<LapidasPage />} />
      </Routes>
    </Router>
  );
}

export default App;
