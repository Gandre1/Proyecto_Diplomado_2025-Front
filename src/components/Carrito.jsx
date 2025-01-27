import React, { useEffect, useState } from 'react';
import api from '../services/api';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await api.get('/cart');
        setCartItems(response.data);
      } catch (error) {
        console.error('Error al cargar el carrito:', error);
      }
    };
    fetchCartItems();
  }, []);

  const handleRemoveItem = async (id) => {
    try {
      await api.delete(`/cart/${id}`);
      setCartItems(cartItems.filter((item) => item._id !== id));
    } catch (error) {
      console.error('Error al eliminar elemento del carrito:', error);
    }
  };

  const handleClearCart = async () => {
    try {
      await api.delete('/cart');
      setCartItems([]);
    } catch (error) {
      console.error('Error al limpiar el carrito:', error);
    }
  };

  return (
    <div>
      <h2>Carrito de Compras</h2>
      {cartItems.length > 0 ? (
        <ul>
          {cartItems.map((item) => (
            <li key={item._id}>
              <h4>{item.productDetails.name || 'Producto'}</h4>
              <p>Cantidad: {item.cantidad}</p>
              <p>Precio Total: ${item.precioTotal}</p>
              <button onClick={() => handleRemoveItem(item._id)}>Eliminar</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>El carrito está vacío</p>
      )}
      {cartItems.length > 0 && <button onClick={handleClearCart}>Limpiar Carrito</button>}
    </div>
  );
};

export default Cart;
