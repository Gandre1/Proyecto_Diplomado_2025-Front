import React, { useEffect, useState } from 'react';
import api from '../services/api';

const ProductList = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get('/products');
        setProducts(response.data);
      } catch (error) {
        console.error('Error al cargar productos:', error);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div>
      <h2>Lista de Productos</h2>
      <ul>
        {products.map((product) => (
          <li key={product._id}>
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <p>Precio: ${product.price}</p>
            <img src={product.imageUrl} alt={product.name} width="150" />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductList;
