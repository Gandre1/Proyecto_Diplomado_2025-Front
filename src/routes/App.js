import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import ProductsPage from '../pages/ProductsPage';
import AdminPage from '../pages/AdminPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<LoginPage />} />
        <Route path='/products' element={<ProductsPage />} />
        <Route path='/admin' element={<AdminPage />} />
      </Routes>
    </Router>
  );
}

export default App;
