import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaShoppingCart, FaUserCircle } from "react-icons/fa";

const Navbar = ({ setSearchQuery }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser && storedUser !== "undefined") {
        setUser(JSON.parse(storedUser));
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Error al leer el usuario desde localStorage", error);
      setUser(null);
    }
  }, []);
  
  const handleLogout = () => {
    localStorage.removeItem("user"); 
    localStorage.removeItem("token");
    setUser(null);
    navigate("/");
  };

  const normalizeText = (text) => {
    return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  };

  const handleSearchChange = (e) => {
    const query = normalizeText(e.target.value);
    setSearchQuery(query);

    if (location.pathname !== "/") {
      navigate("/");
    }
  };

  return (
    <nav className="navbar navbar-expand-lg bg-dark border-bottom border-body" data-bs-theme="dark">
      <div className="container-fluid">
        <Link className="navbar-brand mx-auto" to="/">Inicio</Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarScroll"
          aria-controls="navbarScroll"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse justify-content-center" id="navbarScroll">
          <form className="d-flex w-50" role="search" onSubmit={(e) => e.preventDefault()}>
            <input
              className="form-control me-2"
              type="search"
              placeholder="Buscar productos..."
              aria-label="Search"
              onChange={handleSearchChange} 
            />
          </form>
        </div>

        <div className="d-flex align-items-center">
          {user ? (
            <div className="dropdown">
              <button 
                className="btn btn-outline-light me-2 dropdown-toggle d-flex align-items-center" 
                type="button" 
                id="userDropdown" 
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <FaUserCircle size={20} className="me-1" />
                {user.username}
              </button>
              <ul className={`dropdown-menu ${dropdownOpen ? "show" : ""}`} aria-labelledby="userDropdown">
                {/* Solo mostrar si el usuario es admin */}
                {user.role === "admin" && (
                  <li>
                    <Link className="dropdown-item" to="/admin">Panel de<br></br>Administración</Link>
                  </li>
                )}
                <li><hr className="dropdown-divider" /></li>
                <li>
                  <button className="dropdown-item text-danger" onClick={handleLogout}>
                    Cerrar Sesión
                  </button>
                </li>
              </ul>
            </div>
          ) : (
            <>
              <Link className="btn btn-outline-light me-2" to="/login">Iniciar Sesión</Link>
              <Link className="btn btn-outline-light me-2" to="/registrarse">Registrarse</Link>
            </>
          )}

          <Link className="btn btn-outline-light" to="/carrito">
            <FaShoppingCart />
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
