import React, { useState, useEffect } from 'react';
import api from '../services/api';

const LapidaForm = () => {
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
  const formatDate = (date) => {
    if (!date) return '';
    const months = ["ENE", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL", "AGO", "SEP", "OCT", "NOV", "DIC"];
    const [year, month, day] = date.split('-');
    return `${months[parseInt(month) - 1]}. ${parseInt(day)} - ${year}`;
  };
  

  useEffect(() => {
    const fetchLapidaOptions = async () => {
      try {
        const response = await api.get('/lapidas/options');
        setTiposLapida(response.data);
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
      setImagenVistaPrevia(tipo.tipoLapida.imagen);
    }
  }, [tipoSeleccionado, tiposLapida]);

  useEffect(() => {
    const diseno = tiposDiseno.find(diseno => diseno._id === disenoSeleccionado);
    if (diseno) {
      setImagenVistaPrevia(diseno.imagen);
    }
  }, [disenoSeleccionado, tiposDiseno]);

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-4">
          <div 
            className="border p-3 position-relative text-center bg-light"
            style={{ borderRadius: '10px', overflow: 'hidden', position: 'relative' }}
          >
            {imagenVistaPrevia ? (
              <img 
                src={API_URL + imagenVistaPrevia} 
                alt="Vista previa" 
                style={{ width: '100%', height: 'auto', borderRadius: '10px' }}
              />
            ) : (
              <p>Seleccione un tipo de lápida</p>
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
                fontFamily: 'serif'
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
            </div>

            <div className="mb-3">
              <label>Precio:</label>
  
            </div>

            <button
              type="button"
              className="btn btn-primary"
            >
              Agregar al Carrito
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LapidaForm;
