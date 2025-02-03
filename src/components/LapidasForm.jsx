import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';

const LapidaForm = () => {
  const { lapidaId } = useParams(); 
  const [lapida, setLapida] = useState(null);
  const [nombreMuerto, setNombreMuerto] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [fechaDefuncion, setFechaDefuncion] = useState('');
  const [disenoSeleccionado, setDisenoSeleccionado] = useState('');
  const [disenos, setDisenos] = useState([]);
  const [imagenDiseno, setImagenDiseno] = useState('');
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const formatDate = (date) => {
    if (!date) return '';
    const months = ["ENE", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL", "AGO", "SEP", "OCT", "NOV", "DIC"];
    const [year, month, day] = date.split('-');
    return `${months[parseInt(month) - 1]}. ${parseInt(day)} - ${year}`;
  };
    
  useEffect(() => {
    const fetchLapidaData = async () => {
      try {
        const response = await api.get(`/lapidas/${lapidaId}`);

        if (response.data.lapidas && response.data.lapidas.length > 0) {
          const lapidaSeleccionada = response.data.lapidas.find(lapida => lapida._id === lapidaId);
          setLapida(lapidaSeleccionada);
        } else {
          console.error('No se encontraron lápidas en la respuesta');
        }
  
        if (response.data.disenos && response.data.disenos.length > 0) {
          console.log('Diseños disponibles:', response.data.disenos);
          setDisenos(response.data.disenos);
        } else {
          console.error('No se encontraron diseños en la respuesta');
        }
  
      } catch (error) {
        console.error('Error al obtener los datos de la lápida:', error);
        setError('No se pudo obtener los detalles de la lápida');
      }
    };
  
    fetchLapidaData();
  }, [lapidaId]);
  
   

  useEffect(() => {
    if (disenoSeleccionado) {
      const diseno = disenos.find(d => d._id === disenoSeleccionado);
      if (diseno) {
        setImagenDiseno(diseno.imagen);
      }
    } else {
      setImagenDiseno('');
    }
  }, [disenoSeleccionado, disenos]);

  const agregarAlCarrito = async () => {
    if (!nombreMuerto || !fechaNacimiento || !fechaDefuncion || !disenoSeleccionado) {
      setError('Por favor complete todos los campos antes de agregar al carrito.');
      return;
    }
    setError('');
  
    if (lapida) {
      const diseno = disenos.find(d => d._id === disenoSeleccionado);
      const nombreDiseno = diseno ? diseno.nombre : '';
  
      const detallesProducto = {
        nombreMuerto,
        fechaNacimiento,
        fechaDefuncion,
        diseno: nombreDiseno,
        precio: lapida.precio,
      };
  
      const nombreProducto = lapida.nombre;
      const cantidad = 1;
      const precioTotal = lapida.precio * cantidad;
  
      try {
        await api.post('/carrito', {
          nombreProducto,
          detallesProducto,
          cantidad,
          precioTotal,
        });
        setShowModal(true);
      } catch (error) {
        console.error('Error al agregar al carrito:', error);
        alert('Error al agregar al carrito');
      }
    }
  };
  

  const handleModalAction = (action) => {
    if (action === 'goToCart') {
      navigate('/carrito');
    } else {
      navigate('/');
    }
    setShowModal(false);
  };

  if (!lapida) return <div>Cargando...</div>;

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-4">
          <div
            className="border p-3 position-relative text-center bg-light"
            style={{ borderRadius: '10px', overflow: 'hidden', position: 'relative' }}
          >
            <img
              src={api.defaults.baseURL + lapida.imagen}
              alt="Imagen de Lápida"
              style={{ width: '100%', height: 'auto', borderRadius: '10px' }}
            />
            {imagenDiseno && (
              <img
                src={`${api.defaults.baseURL}${imagenDiseno}`}
                alt="Imagen de Diseño"
                style={{
                  position: 'absolute',
                  top: 50,
                  left: 85,
                  width: '15%',
                  height: '15%',
                  objectFit: 'cover',
                  borderRadius: '10px',
                }}
              />
            )}
            <div
              className="position-absolute text-center"
              style={{
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '90%',
                color: '#000',
                fontWeight: 'bold',
                textShadow: '1px 1px 5px rgba(255, 255, 255, 0.8)',
                fontFamily: 'serif',
              }}
            >
              <h4>{nombreMuerto || 'Nombre del Fallecido'}</h4>
              <p>{fechaNacimiento ? `* ${formatDate(fechaNacimiento)}` : '* Fecha de Nacimiento'}</p>
              <p>{fechaDefuncion ? `† ${formatDate(fechaDefuncion)}` : '† Fecha de Defunción'}</p>
            </div>
          </div>
        </div>

        <div className="col-md-8">
          <div className="border p-4 bg-white" style={{ borderRadius: '10px' }}>
            <h3>Personalizar Lápida</h3>

            {error && <div className="alert alert-danger">{error}</div>}

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
              <label>Diseño:</label>
              <select
                className="form-control"
                value={disenoSeleccionado}
                onChange={(e) => setDisenoSeleccionado(e.target.value)}
              >
                <option value="">Seleccione</option>
                {disenos.map((diseno) => (
                  <option key={diseno._id} value={diseno._id}>
                    {diseno.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label>Precio: </label>
              <span style={{ marginLeft: '5px' }}>${lapida.precio}</span>
            </div>

            <button type="button" className="btn btn-primary" onClick={agregarAlCarrito}>
              Agregar al Carrito
            </button>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal fade show" tabIndex="-1" style={{ display: 'block' }} aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Producto Agregado</h5>
                <button type="button" className="close" onClick={() => setShowModal(false)} aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <p>¿Desea ir al carrito?</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => handleModalAction('goToCart')}>
                  Ir al Carrito
                </button>
                <button type="button" className="btn btn-primary" onClick={() => handleModalAction('goHome')}>
                  Volver al Inicio
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LapidaForm;
