import { NavLink, useNavigate } from "react-router-dom";
import { useContext } from "react";

import { AuthContext } from "../../context/AuthProvider";

import "./citizenPanel.css";

function CitizenPanel({ isOpen, onClose }) {
  const { usuario, cerrarSesion } = useContext(AuthContext);
  const navigate = useNavigate();

  if (!isOpen) {
    return null;
  }
  const inicial = usuario?.ciudadano?.nombre?.charAt(0).toUpperCase();
  async function handleCerrarSesion() {
    console.log("CLICK EN CERRAR SESIÓN");
    try {
      await cerrarSesion();

      navigate("/", {
        replace: true,
      });
    } catch (error) {
      console.error("Error al cerrar sesion:", error);
    }
  }

  return (
    <div className="citizen-panel-overlay" onClick={onClose}>
      <aside className="citizen-panel" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="citizen-panel-close"
          aria-label="Cerrar menú"
          onClick={onClose}
        >
          <i className="bi bi-x-lg"></i>
        </button>

        <section className="citizen-profile">
          <div className="citizen-avatar">{inicial}</div>

          <div className="citizen-profile-info">
            <h2>
              {usuario?.ciudadano?.nombre} {usuario?.ciudadano?.apellido}
            </h2>
            <p>Ciudadano</p>
          </div>

          <NavLink
            to="/perfil"
            className="citizen-profile-button"
            onClick={onClose}
          >
            Administrar mi perfil
          </NavLink>
        </section>

        <div className="citizen-panel-divider"></div>

        <nav className="citizen-menu">
          <NavLink
            to="/mis-reclamos"
            className="citizen-menu-item"
            onClick={onClose}
          >
            <div className="citizen-menu-item-content">
              <i className="bi bi-file-earmark-text"></i>

              <span>Mis reclamos</span>
            </div>

            <i className="bi bi-arrow-right"></i>
          </NavLink>
        </nav>

        <div className="citizen-panel-footer">
          <button
            type="button"
            className="citizen-logout"
            onClick={handleCerrarSesion}
          >
            <i className="bi bi-box-arrow-right"></i>

            <span>Cerrar sesión</span>
          </button>
        </div>
      </aside>
    </div>
  );
}

export default CitizenPanel;
