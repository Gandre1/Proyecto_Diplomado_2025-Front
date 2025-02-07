import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import ProductsPage from '../pages/ProductsPage';
import AdminPage from '../pages/AdminPage';
import RegisterPage from '../pages/RegisterPage';
import LapidasPage from '../pages/LapidasPage';
import CarritoPage from '../pages/CarritoPage';
import Navbar from '../layout/Navegacion';

function App() {

  const [searchQuery, setSearchQuery] = useState("");

  return (
    <Router>
      <Navbar setSearchQuery={setSearchQuery} />
      <Routes>
        <Route path='/' element={<ProductsPage searchQuery={searchQuery} />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/admin' element={<AdminPage />} />
        <Route path='/registrarse' element={<RegisterPage />} />
        <Route path='/carrito' element={<CarritoPage />} />
        <Route path='/product/lapida/:lapidaId' element={<LapidasPage />} />
      </Routes>
    </Router>
  );
}

export default App;
