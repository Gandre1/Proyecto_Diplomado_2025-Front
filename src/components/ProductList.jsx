import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
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
    <div className="row">
      {products.map((product) => (
        <div key={product._id} className="col-md-4 mb-4">
          <Link to={`/product` + product.url} className="btn">
            <div className="card" style={{ width: '18rem' }}>
              <img 
                src={api.defaults.baseURL + product.imagen}
                alt={product.nombre} 
                className="card-img-top" 
              />
              <div className="card-body">
                <h5 className="card-title">{product.nombre}</h5>
                <p>Precio: ${product.precio}</p>
              </div>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default ProductList;
