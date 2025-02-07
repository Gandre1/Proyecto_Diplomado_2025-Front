import React from 'react';
import ProductList from '../components/ProductList';

const ProductsPage = ({ searchQuery }) => { 
  return (
    <div>
      <h1>Productos</h1>
      <ProductList searchQuery={searchQuery} />
    </div>
  );
};

export default ProductsPage;
