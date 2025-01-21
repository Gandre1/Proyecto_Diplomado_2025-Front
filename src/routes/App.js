import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import ProductsPage from '../pages/ProductsPage';
import AdminPage from '../pages/AdminPage';
import RegisterPage from '../pages/RegisterPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<ProductsPage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/admin' element={<AdminPage />} />
        <Route path='/registrarse' element={<RegisterPage />} />
      </Routes>
    </Router>
  );
}

export default App;
