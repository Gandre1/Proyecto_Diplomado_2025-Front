import React from "react";
import { Link } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";

const Navbar = () => {
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
          <form className="d-flex w-50" role="search">
            <input
              className="form-control me-2"
              type="search"
              placeholder="Buscar productos..."
              aria-label="Search"
            />
            <button className="btn btn-outline-success" type="submit">
              Buscar
            </button>
          </form>
        </div>

        <div className="d-flex align-items-center">
          <Link className="btn btn-outline-light me-2" to="/login">
            Iniciar Sesión
          </Link>
          <Link className="btn btn-outline-light me-2" to="/registrarse">
            Registrarse
          </Link>
          <Link className="btn btn-outline-light" to="/carrito">
            <FaShoppingCart />
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
