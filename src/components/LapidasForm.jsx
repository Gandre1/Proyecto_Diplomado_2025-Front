import React, { useState, useEffect } from 'react';
import api from '../services/api';

const LapidaForm = ({ product }) => {
  const [nombreMuerto, setNombreMuerto] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [fechaDefuncion, setFechaDefuncion] = useState('');
  const [numeroLocalizacion, setNumeroLocalizacion] = useState('');
  const [tiposLapida, setTiposLapida] = useState('');
  const [tiposDiseno, setTiposDiseno] = useState('');
  const [imagenUrl, setImagenUrl] = useState('/images/lapidas/default.jpg');
  const [lapidaOptions, setLapidaOptions] = useState({
    tiposLapida: [],
    tiposDiseno: [],
    imagePreviews: {},
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const response = await api.get('/lapidas/options');
        console.log('Opciones de lápidas:', response.data);
        setLapidaOptions(response.data);
      } catch (error) {
        console.error('Error al cargar opciones de lápidas:', error);
      }
    };
  
    fetchOptions();
  }, []);  
  
  
  useEffect(() => {
    if (tiposLapida && tiposDiseno && lapidaOptions.imagePreviews[tiposLapida]?.[tiposDiseno]) {
      const newImageUrl = lapidaOptions.imagePreviews[tiposLapida][tiposDiseno];
      console.log('Imagen seleccionada:', newImageUrl);
      setImagenUrl(newImageUrl);
    }
  }, [tiposLapida, tiposDiseno, lapidaOptions]);

  const handleAddToCart = async () => {
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
          <select
            className="form-control"
            value={tiposLapida}
            onChange={(e) => setTiposLapida(e.target.value)}
          >
            <option value="">Seleccione</option>
            {isLoading ? (
              <option value="">Cargando opciones...</option>
            ) : (
              lapidaOptions.tiposLapida.length > 0 ? (
                lapidaOptions.tiposLapida.map((tipo) => (
                  <option key={tipo} value={tipo}>
                    {tipo}
                  </option>
                ))
              ) : (
                <option value="">No hay opciones disponibles</option>
              )
            )}
          </select>
        </div>

        <div className="mb-3">
          <label>Diseño:</label>
          <select
            className="form-control"
            value={tiposDiseno}
            onChange={(e) => setTiposDiseno(e.target.value)}
          >
            <option value="">Seleccione</option>
            {isLoading ? (
              <option value="">Cargando opciones...</option>
            ) : (
              lapidaOptions.tiposDiseno.length > 0 ? (
                lapidaOptions.tiposDiseno.map((diseno) => (
                  <option key={diseno} value={diseno}>
                    {diseno}
                  </option>
                ))
              ) : (
                <option value="">No hay opciones disponibles</option>
              )
            )}
          </select>
        </div>

        <div className="mb-3">
          <label>Vista previa:</label>
          <img src={`http://localhost:5000${imagenUrl}`} alt="Vista previa" className="img-fluid" />
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
