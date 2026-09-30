import { NavLink } from "react-router-dom";

import "./citizenPanel.css";

function CitizenPanel({ isOpen, onClose }) {
  if (!isOpen) {
    return null;
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
          <div className="citizen-avatar">
            <i className="bi bi-person"></i>
          </div>

          <div className="citizen-profile-info">
            <h2>Nombre del ciudadano</h2>
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
          <button type="button" className="citizen-logout">
            <i className="bi bi-box-arrow-right"></i>

            <span>Cerrar sesión</span>
          </button>
        </div>
      </aside>
    </div>
  );
}

export default CitizenPanel;
