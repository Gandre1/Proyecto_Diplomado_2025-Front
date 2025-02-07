import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

const ProductList = ({ searchQuery }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get("/products");
        setProducts(response.data || []);
      } catch (error) {
        console.error("Error al cargar productos:", error);
        setProducts([]); 
      }
    };
    fetchProducts();
  }, []);

  const normalizeText = (text) => {
    return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  };

  const filteredProducts = products.filter(
    (product) =>
      product.nombre &&
      normalizeText(product.nombre).includes(normalizeText(searchQuery || ""))
  );


  return (
    <div className="container">
      <div className="row">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div key={product._id} className="col-6 col-sm-4 col-md-3 col-lg-3">
              <Link to={`/product/lapida/${product.idProducto}`} className="btn">
                <div className="card">
                  <img
                    src={api.defaults.baseURL + product.imagen}
                    alt={product.nombre || "Producto"}
                    className="card-img-top"
                  />
                  <div className="card-body">
                    <h5 className="card-title">{product.nombre || "Sin nombre"}</h5>
                    <p>Precio desde: ${product.precio || "N/A"}</p>
                  </div>
                </div>
              </Link>
            </div>
          ))
        ) : (
          <p className="text-center mt-3">No se encontraron productos.</p>
        )}
      </div>
    </div>
  );
};

export default ProductList;
