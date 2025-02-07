import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';

const LapidaForm = () => {
  const { lapidaId } = useParams(); 
  const [lapida, setLapida] = useState(null);
  const [nombreFallecido, setNombreFallecido] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [fechaDefuncion, setFechaDefuncion] = useState('');
  const [disenoSeleccionado, setDisenoSeleccionado] = useState('');
  const [disenos, setDisenos] = useState([]);
  const [imagenDiseno, setImagenDiseno] = useState('');
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [colorSeleccionado, setColorSeleccionado] = useState('');
  const [imagenLapida, setImagenLapida] = useState('');
  
  const [tamanoSeleccionado, setTamanoSeleccionado] = useState('');
  const [precioTamano, setPrecioTamano] = useState(0);

  const navigate = useNavigate();

  const formatDate = (date) => {
    if (!date) return '';
    const months = ["ENE", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL", "AGO", "SEP", "OCT", "NOV", "DIC"];
    const [year, month, day] = date.split('-');
    return `${months[parseInt(month) - 1]}. ${parseInt(day)} - ${year}`;
  };
  
  const [posicionesTexto, setPosicionesTexto] = useState({
    nombre: { x: 50, y: -335 }, 
    fechaNacimiento: { x: 22, y: -190 },
    fechaDefuncion: { x: 85, y: -190 }
  });
  
  useEffect(() => {
    const fetchLapidaData = async () => {
      try {
        const lapidaResponse = await api.get(`/lapidas/${lapidaId}`);
        if (lapidaResponse.data) {
          setLapida(lapidaResponse.data);
  
          if (lapidaResponse.data.opciones.length > 0) {
            setColorSeleccionado(lapidaResponse.data.opciones[0].color);
            setImagenLapida(lapidaResponse.data.opciones[0].imagen);
            setTamanoSeleccionado(lapidaResponse.data.opciones[0].tamanosxPrecios[0].tamano);
            setPrecioTamano(lapidaResponse.data.opciones[0].tamanosxPrecios[0].precio);
          }
  
          if (lapidaResponse.data.posicionesTexto) {
            setPosicionesTexto(lapidaResponse.data.posicionesTexto);
          }
        } else {
          console.error('No se encontraron lápidas en la respuesta');
        }
  
        const disenosResponse = await api.get(`/lapidas/diseno`);
        if (disenosResponse.data.length > 0) {
          setDisenos(disenosResponse.data);
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
  
  const handleColorChange = (e) => {
    const color = e.target.value;
    setColorSeleccionado(color);
    const opcion = lapida.opciones.find(op => op.color === color);
    if (opcion) {
      setImagenLapida(opcion.imagen);
      setTamanoSeleccionado(opcion.tamanosxPrecios[0].tamano);  
      setPrecioTamano(opcion.tamanosxPrecios[0].precio);
    }
  };

  const handleTamanoChange = (e) => {
    const tamano = e.target.value;
    setTamanoSeleccionado(tamano);
    const opcion = lapida.opciones.find(op => op.color === colorSeleccionado);
    const tamanoSeleccionado = opcion.tamanosxPrecios.find(t => t.tamano === tamano);
    if (tamanoSeleccionado) {
      setPrecioTamano(tamanoSeleccionado.precio);
    }
  };

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
    if (!nombreFallecido || !fechaNacimiento || !fechaDefuncion || !disenoSeleccionado) {
      setError('Por favor complete todos los campos antes de agregar al carrito.');
      return;
    }
    setError('');
  
    if (lapida) {
      const diseno = disenos.find(d => d._id === disenoSeleccionado);
      const nombreDiseno = diseno ? diseno.nombre : '';
  
      const detallesProducto = {
        nombreFallecido,
        fechaNacimiento,
        fechaDefuncion,
        diseño: nombreDiseno,
        color: colorSeleccionado,
        tamano: tamanoSeleccionado,
        precio: precioTamano,
      };
  
      const nombreProducto = lapida.nombre;
      const cantidad = 1;
      const precioTotal = precioTamano * cantidad;
  
      try {
        const token = localStorage.getItem('token');
          if (!token) {
            alert('Por favor inicie sesión para agregar productos al carrito.');
            return;
          }

          await api.post('/carrito', {
            nombreProducto,
            detallesProducto,
            cantidad,
            precioTotal,
          }, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
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
          <div className="border p-3 position-relative text-center bg-light" 
          style={{ 
            borderRadius: '10px', 
            overflow: 'hidden', 
            position: 'relative',
            width: "400px", 
            height: "400px", 
            background: "#eee"
            }}>
            <img
              src={api.defaults.baseURL + imagenLapida}
              alt="Imagen de Lápida"
              style={{ width: '100%', height: 'auto', borderRadius: '10px' }}
            />
            {imagenDiseno && (
              <img
                src={`${api.defaults.baseURL}${imagenDiseno}`}
                alt="Imagen de Diseño"
                style={{
                  position: 'absolute',
                  top: '135px',
                  left: '140px',
                  width: '30%',
                  height: '30%',
                  borderRadius: '10px',
                }}
              />
            )}

            <div 
              className="position-absolute w-100 h-100 d-flex flex-column align-items-center justify-content-center" 
              style={{ top: 0, left: 0 }}
            >
            <div
              style={{
                position: 'absolute',
                top: `${posicionesTexto.nombre.y}px`,
                left: `${posicionesTexto.nombre.x}px`,
                transform: 'translateX(-50%)',
                width: '80%',
                height: '20%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                fontSize: 'clamp(1rem, 5vw, 3rem)',
                textAlign: 'center',
                color: '#000',
                fontWeight: 'bold',
                fontFamily: 'serif',
              }}
            >
              <h4>{nombreFallecido || 'Nombre del Fallecido'}</h4>
            </div>

            <div
              style={{
                position: 'absolute',
                top: `${posicionesTexto.fechaNacimiento.y}px`,
                left: `${posicionesTexto.fechaNacimiento.x}px`,
                transform: 'translateX(-50%)',
                width: '20%',
                height: '15%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                fontSize: '0.75vw',
                textAlign: 'center',
                color: '#000',
                fontWeight: 'normal',
                fontFamily: 'serif',
              }}
            >
              <p>{fechaNacimiento ? `${formatDate(fechaNacimiento)}` : 'Fecha de Nacimiento'}</p>
            </div>

            <div
              style={{
                position: 'absolute',
                top: `${posicionesTexto.fechaDefuncion.y}px`,
                left: `${posicionesTexto.fechaDefuncion.x}px`,
                transform: 'translateX(-50%)',
                width: '20%',
                height: '15%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                fontSize: '0.75vw',
                textAlign: 'center',
                color: '#000',
                fontWeight: 'normal',
                fontFamily: 'serif',
              }}
            >
              <p>{fechaDefuncion ? `${formatDate(fechaDefuncion)}` : 'Fecha de Defunción'}</p>
            </div>
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
                value={nombreFallecido}
                onChange={(e) => setNombreFallecido(e.target.value)}
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
              <label>Color:</label>
              <select className="form-control" value={colorSeleccionado} onChange={handleColorChange}>
                {lapida.opciones.map((opcion, index) => (
                  <option key={index} value={opcion.color}>
                    {opcion.color}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label>Tamaño:</label>
              <select className="form-control" value={tamanoSeleccionado} onChange={handleTamanoChange}>
                {lapida.opciones
                  .find(opcion => opcion.color === colorSeleccionado)
                  .tamanosxPrecios.map((tamano, index) => (
                    <option key={index} value={tamano.tamano}>
                      {tamano.tamano}
                    </option>
                  ))}
              </select>
            </div>
            <div className="mb-3">
              <label>Diseño:</label>
              <select className="form-control" value={disenoSeleccionado} onChange={(e) => setDisenoSeleccionado(e.target.value)}>
                <option value="">Seleccionar diseño</option>
                {disenos.map((diseno) => (
                  <option key={diseno._id} value={diseno._id}>
                    {diseno.nombre}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label>Precio: ${precioTamano}</label>
            </div>
            <button className="btn btn-primary" onClick={agregarAlCarrito}>Agregar al carrito</button>
          </div>
        </div>
      </div>
      {showModal && (
        <div className="modal show" tabIndex="-1" style={{ display: 'block' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Producto agregado al carrito</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <p>El producto se ha agregado correctamente al carrito.</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => handleModalAction('goToCart')}>Ir al carrito</button>
                <button type="button" className="btn btn-primary" onClick={() => handleModalAction('continueShopping')}>Seguir comprando</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LapidaForm;
