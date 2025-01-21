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
    <div className="card" style={{ width: '18rem', margin: '20px' }}>
      <div className="card-header">
      </div>
      <div className="card-body">
        <ul className="list-group list-group-flush">
          {products.map((product) => (
            <li key={product._id} className="list-group-item">
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <p>Precio: ${product.price}</p>
              <img src={product.imageUrl} alt={product.name} width="150" className="card-img-top" />
            </li>
          ))}
        </ul>
      </div>
      <div className="card-body">
        <a href="#" className="card-link">Ver más</a>
      </div>
    </div>
  );
};

export default ProductList;
