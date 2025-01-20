import React, { useState } from 'react';
import api from '../services/api';

const AdminPanel = () => {
  const [productData, setProductData] = useState({
    name: '',
    description: '',
    price: '',
    imageUrl: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductData({ ...productData, [name]: value });
  };

  const handleAddProduct = async () => {
    try {
      await api.post('/products', productData);
      alert('Producto agregado correctamente');
    } catch (error) {
      alert('Error al agregar producto');
    }
  };

  return (
    <div>
      <h2>Panel de Administrador</h2>
      <input
        type="text"
        name="name"
        placeholder="Nombre"
        onChange={handleInputChange}
      />
      <input
        type="text"
        name="description"
        placeholder="Descripción"
        onChange={handleInputChange}
      />
      <input
        type="number"
        name="price"
        placeholder="Precio"
        onChange={handleInputChange}
      />
      <input
        type="text"
        name="imageUrl"
        placeholder="URL de la imagen"
        onChange={handleInputChange}
      />
      <button onClick={handleAddProduct}>Agregar Producto</button>
    </div>
  );
};

export default AdminPanel;
