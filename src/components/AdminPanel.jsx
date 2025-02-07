import React, { useState, useEffect } from "react";
import { Rnd } from "react-rnd";
import api from "../services/api";

const DraggableText = ({ campo, position, onStop }) => (
  <Rnd
    size={{ width: "auto", height: "auto" }}
    position={{ x: position.x, y: position.y }}
    onDragStop={(e, d) => onStop(campo, d)}
    bounds="window"
    enableUserSelectHack={false}
    style={{
      position: "absolute",
      cursor: "move",
      background: "rgba(255,255,255,0.7)",
      padding: "5px",
      borderRadius: "5px",
      whiteSpace: "nowrap",
    }}
  >
    {campo.toUpperCase()}
  </Rnd>
);

const AdminPanel = () => {
  const [lapidas, setLapidas] = useState([]);
  const [lapidaSeleccionada, setLapidaSeleccionada] = useState(null);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    nombre: "",
    opciones: [{ color: "", imagen: "", tamanosxPrecios: [{ tamano: "", precio: "" }] }],
    posicionesTexto: {
      nombre: { x: 50, y: 50 },
      fechaNacimiento: { x: 50, y: 100},
      fechaDefuncion: { x: 50, y: 150},
    },
  });

  useEffect(() => {
    const fetchLapidas = async () => {
      try {
        const response = await api.get("/lapidas");
        setLapidas(response.data);
      } catch (error) {
        console.error("Error al obtener lápidas:", error);
      }
    };
    fetchLapidas();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleOptionChange = (index, field, value) => {
    const newOpciones = [...form.opciones];
    newOpciones[index][field] = value;
    setForm({ ...form, opciones: newOpciones });
  };

  const handleTamanosxPreciosChange = (colorIndex, index, field, value) => {
    const newOpciones = [...form.opciones];
    newOpciones[colorIndex].tamanosxPrecios[index][field] = value;
    setForm({ ...form, opciones: newOpciones });
  };

  const handleAddOption = () => {
    setForm({
      ...form,
      opciones: [...form.opciones, { color: "", imagen: "", tamanosxPrecios: [{ tamano: "", precio: "" }] }],
    });
  };

  const handleAddTamanosxPrecios = (colorIndex) => {
    const newOpciones = [...form.opciones];
    newOpciones[colorIndex].tamanosxPrecios.push({ tamano: "", precio: "" });
    setForm({ ...form, opciones: newOpciones });
  };

  const handleDragStop = (campo, data) => {
    setForm((prevForm) => ({
      ...prevForm,
      posicionesTexto: {
        ...prevForm.posicionesTexto,
        [campo]: { ...prevForm.posicionesTexto[campo], x: data.x, y: data.y },
      },
    }));
  };

  const validateForm = () => {
    if (
      !form.nombre.trim() ||
      !form.opciones.some(
        (op) =>
          op.color.trim() &&
          op.imagen.trim() &&
          op.tamanosxPrecios.every(
            (tp) =>
              tp.precio.trim() &&
              !isNaN(tp.precio) &&
              tp.precio > 0 &&
              tp.tamano.trim()
          )
      )
    ) {
      setError("Todos los campos son obligatorios.");
      return false;
    }
    setError("");
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const datosParaEnviar = {
      nombre: form.nombre,
      opciones: form.opciones,
      posicionesTexto: form.posicionesTexto,
    };

    try {
      if (lapidaSeleccionada) {
        await api.put(`/lapidas/${lapidaSeleccionada._id}`, datosParaEnviar);
        alert("Lápida actualizada");
      } else {
        await api.post("/lapidas", datosParaEnviar);
        alert("Lápida creada");
      }

      window.location.reload();
    } catch (error) {
      console.error("Error en la petición:", error);
      alert("Hubo un error al guardar la lápida.");
    }
  };

  const handleEdit = (lapida) => {
    setLapidaSeleccionada(lapida);
    setForm(lapida);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("¿Estás seguro de que quieres eliminar esta lápida?");
    if (!confirmDelete) return;

    try {
      await api.delete(`/lapidas/${id}`);
      setLapidas(lapidas.filter((lapida) => lapida._id !== id));
      alert("Lápida eliminada correctamente.");
    } catch (error) {
      console.error("Error al eliminar la lápida:", error);
      alert("Hubo un error al eliminar la lápida.");
    }
  };

  return (
    <div className="container mt-4">

      <div className="row">
        <div className="col-md-6">
          {error && <div className="alert alert-danger">{error}</div>}

          <div className="mb-3">
            <label className="form-label">Nombre de la lápida:</label>
            <input
              type="text"
              name="nombre"
              value={form.nombre}
              onChange={handleInputChange}
              className="form-control"
            />
          </div>

          <h4>Detalles de la lapida:</h4>
          <button className="btn btn-secondary btn-sm mb-3" onClick={handleAddOption}>
            Agregar detalles
          </button>
          {form.opciones.map((opcion, colorIndex) => (
            <div key={colorIndex} className="mb-3">
              <input
                type="text"
                placeholder="Color"
                value={opcion.color}
                onChange={(e) => handleOptionChange(colorIndex, "color", e.target.value)}
                className="form-control"
              />
              <input
                type="text"
                placeholder="URL de Imagen"
                value={opcion.imagen}
                onChange={(e) => handleOptionChange(colorIndex, "imagen", e.target.value)}
                className="form-control"
              />
              <h5>Tamaños y Precios:</h5>
              {opcion.tamanosxPrecios.map((tp, index) => (
                <div key={index} className="d-flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Tamaño"
                    value={tp.tamano}
                    onChange={(e) => handleTamanosxPreciosChange(colorIndex, index, "tamano", e.target.value)}
                    className="form-control"
                  />
                  <input
                    type="number"
                    placeholder="Precio"
                    value={tp.precio}
                    onChange={(e) => handleTamanosxPreciosChange(colorIndex, index, "precio", e.target.value)}
                    className="form-control"
                  />
                </div>
              ))}
              <button
                className="btn btn-secondary btn-sm mb-3"
                onClick={() => handleAddTamanosxPrecios(colorIndex)}
              >
                Agregar tamaños y precios
              </button>
            </div>
          ))}

          <br />

          <button onClick={handleSubmit} className="btn btn-primary mt-3">
            {lapidaSeleccionada ? "Actualizar Lápida" : "Crear Lápida"}
          </button>
        </div>

        <div className="col-md-6">
          <h4>Vista Previa:</h4>
          <div
            className="border p-3 position-relative text-center bg-light"
            style={{
              borderRadius: "10px",
              overflow: "hidden",
              position: "relative",
              width: "400px",
              height: "400px",
              background: "#eee",
            }}
          >
            <img
              src={api.defaults.baseURL + form.opciones[0]?.imagen || ""}
              alt="Lápida"
              style={{ width: "100%", height: "auto", borderRadius: "10px" }}
            />
            {["nombre", "fechaNacimiento", "fechaDefuncion"].map((campo) => (
              <DraggableText
                key={campo}
                campo={campo}
                position={form.posicionesTexto[campo]}
                onStop={handleDragStop}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="col-md-6">
        <h3 className="mt-4">Lápidas Existentes:</h3>
        <ul className="list-group">
          {lapidas.map((lapida) => (
            <li
              key={lapida._id}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              {lapida.nombre}
              <div>
                <button
                  onClick={() => handleEdit(lapida)}
                  className="btn btn-warning btn-sm me-2"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(lapida._id)}
                  className="btn btn-danger btn-sm"
                >
                  Eliminar
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminPanel;
