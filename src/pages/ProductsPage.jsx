import React from 'react';
import ProductList from '../components/ProductList';
import Navbar from '../layout/Navegacion';

const ProductsPage = () => {
  return (
    <div>
      <Navbar/>
      <h1>Productos</h1>
      <ProductList />
    </div>
  );
};

export default ProductsPage;
