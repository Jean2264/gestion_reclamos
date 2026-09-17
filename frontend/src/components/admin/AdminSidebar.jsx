import { NavLink } from "react-router-dom";

import "./AdminSidebar.css";

function AdminSidebar() {
  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar-brand">
        <div className="admin-sidebar-brand-icon">
          <i className="bi bi-building"></i>
        </div>

        <div>
          <h2>Municipio</h2>
          <span>Gestión de reclamos</span>
        </div>
      </div>

      <nav className="admin-sidebar-nav">
        <p className="admin-sidebar-section-title">MENÚ PRINCIPAL</p>

        <ul>
          <li>
            <NavLink
              to="/admin"
              end
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              <i className="bi bi-grid"></i>
              <span>Inicio</span>
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/admin/reclamos"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              <i className="bi bi-clipboard-check"></i>
              <span>Reclamos</span>
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/admin/nuevo-reclamo"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              <i className="bi bi-plus-circle"></i>
              <span>Nuevo reclamo</span>
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/admin/usuarios"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              <i className="bi bi-people"></i>
              <span>Usuarios</span>
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/admin/empleados"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              <i className="bi bi-person-badge"></i>
              <span>Empleados</span>
            </NavLink>
          </li>
        </ul>
      </nav>

      <div className="admin-sidebar-footer">
        <div className="admin-sidebar-user">
          <div className="admin-sidebar-user-avatar">
            <i className="bi bi-person"></i>
          </div>

          <div>
            <strong>Administrador</strong>
            <span>Panel administrativo</span>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default AdminSidebar;
