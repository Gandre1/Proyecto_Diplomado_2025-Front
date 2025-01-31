import React, { useEffect, useState } from 'react';
import api from '../services/api';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await api.get('/carrito');
        setCartItems(response.data);
      } catch (error) {
        console.error('Error al cargar el carrito:', error);
      }
    };
    fetchCartItems();
  }, []);

  const handleRemoveItem = async (id) => {
    const isConfirmed = window.confirm('¿Estás seguro de que deseas eliminar este producto del carrito?');
    if (isConfirmed) {
      try {
        await api.delete(`/carrito/${id}`);
        setCartItems(cartItems.filter((item) => item._id !== id));
      } catch (error) {
        console.error('Error al eliminar elemento del carrito:', error);
      }
    }
  };

  const handleClearCart = async () => {
    const isConfirmed = window.confirm('¿Estás seguro de que deseas limpiar todo el carrito?');
    if (isConfirmed) {
      try {
        await api.delete('/carrito');
        setCartItems([]);
      } catch (error) {
        console.error('Error al limpiar el carrito:', error);
      }
    }
  };

  const handleQuantityChange = async (id, newQuantity) => {
    const updatedCartItems = cartItems.map((item) => {
      if (item._id === id) {
        const updatedItem = { ...item, cantidad: newQuantity, precioTotal: item.detallesProducto.precio * newQuantity };
        return updatedItem;
      }
      return item;
    });
    setCartItems(updatedCartItems);

    try {
      await api.put(`/carrito/${id}`, { cantidad: newQuantity, precioTotal: newQuantity * updatedCartItems.find(item => item._id === id).detallesProducto.precio });
    } catch (error) {
      console.error('Error al actualizar la cantidad en la base de datos:', error);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Carrito de Compras</h2>
      {cartItems.length > 0 ? (
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Detalles</th>
                <th>Cantidad</th>
                <th>Precio Total</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <tr key={item._id}>
                  <td>{item.nombreProducto}</td>
                  <td>
                    <strong>Nombre del Fallecido:</strong> {item.detallesProducto.nombreMuerto} <br />
                    <strong>Fecha de Nacimiento:</strong> {item.detallesProducto.fechaNacimiento} <br />
                    <strong>Fecha de Defunción:</strong> {item.detallesProducto.fechaDefuncion} <br />
                    <strong>Diseño:</strong> {item.detallesProducto.diseno} <br />
                    <strong>Precio:</strong> ${item.detallesProducto.precio}
                  </td>
                  <td>
                    <input
                      type="number"
                      min="1"
                      value={item.cantidad}
                      onChange={(e) => handleQuantityChange(item._id, parseInt(e.target.value, 10))}
                      className="form-control"
                    />
                  </td>
                  <td>${item.precioTotal}</td>
                  <td>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleRemoveItem(item._id)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button className="btn btn-warning" onClick={handleClearCart}>
            Limpiar Carrito
          </button>
        </div>
      ) : (
        <p>El carrito está vacío</p>
      )}
    </div>
  );
};

export default Cart;
