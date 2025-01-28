import React, { useState, useEffect } from 'react';
import api from '../services/api';

const LapidaForm = ({ product }) => {
  const [nombreMuerto, setNombreMuerto] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [fechaDefuncion, setFechaDefuncion] = useState('');
  const [numeroLocalizacion, setNumeroLocalizacion] = useState('');
  const [tiposLapida, setTiposLapida] = useState([]);
  const [tiposDiseno, setTiposDiseno] = useState([]);
  const [tipoSeleccionado, setTipoSeleccionado] = useState('');
  const [disenoSeleccionado, setDisenoSeleccionado] = useState('');
  const [imagenVistaPrevia, setImagenVistaPrevia] = useState('');
  const API_URL = "http://localhost:5000/api";

  useEffect(() => {
    const fetchLapidaOptions = async () => {
      try {
        const response = await api.get('/lapidas/options');
        setTiposLapida(response.data);
        setTiposDiseno(response.data); 
      } catch (error) {
        console.error('Error al obtener los datos de lápidas:', error);
      }
    };
    fetchLapidaOptions();
  }, []);
   
  useEffect(() => {
    const tipo = tiposLapida.find(lapida => lapida.tipoLapida._id === tipoSeleccionado);
    if (tipo) {
      setTiposDiseno(tipo.disenos);
    }
  }, [tipoSeleccionado, tiposLapida]);

  useEffect(() => {
    const diseno = tiposDiseno.find(diseno => diseno._id === disenoSeleccionado);
    if (diseno) {
      setImagenVistaPrevia(diseno.imagen);
      console.log('Imagen de diseño:', diseno.imagen)
    }
  }, [disenoSeleccionado, tiposDiseno]);
  
  const handleAddToCart = async () => {
    if (!nombreMuerto || !fechaNacimiento || !fechaDefuncion || !numeroLocalizacion) {
      alert('Por favor, completa todos los campos obligatorios.');
      return;
    }
    try {
      const lapidaDetails = {
        nombreMuerto,
        fechaNacimiento,
        fechaDefuncion,
        numeroLocalizacion,
        tiposLapida,
        tiposDiseno,
        precio: product.precio,
      };
  
      await api.post('/carrito', {
        productType: 'lapida',
        productId: product._id,
        productDetails: lapidaDetails,
        cantidad: 1,
      });
  
      alert('Lápida personalizada agregada al carrito');
    } catch (error) {
      console.error('Error al agregar al carrito:', error);
    }
  };  

  return (
    <div className="container">
      <form className="form-group">
        <h3>Personalizar Lápida</h3>
        
        <div className="mb-3">
          <label>Nombre del fallecido:</label>
          <input
            type="text"
            className="form-control"
            placeholder="Nombre del fallecido"
            value={nombreMuerto}
            onChange={(e) => setNombreMuerto(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label>Fecha de nacimiento:</label>
          <input
            type="date"
            className="form-control"
            value={fechaNacimiento}
            onChange={(e) => setFechaNacimiento(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label>Fecha de defunción:</label>
          <input
            type="date"
            className="form-control"
            value={fechaDefuncion}
            onChange={(e) => setFechaDefuncion(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label>Número de localización:</label>
          <input
            type="text"
            className="form-control"
            placeholder="Número de localización"
            value={numeroLocalizacion}
            onChange={(e) => setNumeroLocalizacion(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label>Tipo de lápida:</label>
          <select className="form-control" value={tipoSeleccionado} onChange={(e) => setTipoSeleccionado(e.target.value)}>
            <option value="">Seleccione</option>
            {tiposLapida.map((lapida) => (
              <option key={lapida.tipoLapida._id} value={lapida.tipoLapida._id}>
                {lapida.tipoLapida.nombre}
              </option>
            ))}
          </select>
          {tipoSeleccionado && (
            <div className="mt-2">
              <img 
                src={API_URL + tiposLapida.find(lapida => lapida.tipoLapida._id === tipoSeleccionado)?.tipoLapida.imagen || '/images/lapidas/default.jpg'} 
                alt="Vista previa tipo lápida"
                style={{ width: '200px', height: 'auto' }}
              />
            </div>
          )}
        </div>

        <div className="mb-3">
          <label>Diseño:</label>
          <select className="form-control" value={disenoSeleccionado} onChange={(e) => setDisenoSeleccionado(e.target.value)}>
            <option value="">Seleccione</option>
            {tiposDiseno.map((diseno) => (
              <option key={diseno._id} value={diseno._id}>
                {diseno.nombre}
              </option>
            ))}
          </select>
          {disenoSeleccionado && (
            <div className="mt-2">
              <img 
                src={API_URL + imagenVistaPrevia || '/images/lapidas/default.jpg'}
                alt="Vista previa diseño" 
                style={{ width: '200px', height: 'auto' }}
              />
            </div>
          )}
        </div>

        <button
          type="button"
          className="btn btn-primary"
          onClick={handleAddToCart}
          disabled={!tiposLapida || !tiposDiseno}
        >
          Agregar al Carrito
        </button>
      </form>
    </div>
  );
};

export default LapidaForm;
