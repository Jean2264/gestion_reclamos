import { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import { AuthContext } from "../../context/AuthProvider";

import "./AdminSidebar.css";

function AdminSidebar() {
  const { usuario, cerrarSesion } = useContext(AuthContext);
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      await cerrarSesion();
      navigate("/login-admin", { replace: true });
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

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
              to="/admin/ciudadanos"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              <i className="bi bi-people"></i>
              <span>Ciudadanos</span>
            </NavLink>
          </li>

          <li>
            {usuario?.usuario?.nombre_rol === "Administrador" && (
              <NavLink
                to="/admin/empleados"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                <i className="bi bi-person-badge"></i>
                <span>Empleados</span>
              </NavLink>
            )}
          </li>
        </ul>
      </nav>

      <div className="admin-sidebar-footer">
        <div className="admin-sidebar-user">
          <div className="admin-sidebar-user-avatar">
            <i className="bi bi-person"></i>
          </div>

          <div className="admin-sidebar-user-info">
            <strong>Administrador</strong>

            <NavLink
              to="/admin/perfil"
              className={({ isActive }) =>
                isActive ? "admin-profile-link active" : "admin-profile-link"
              }
            >
              Administrar mi perfil
            </NavLink>
          </div>
        </div>

        <div className="admin-logout-container">
          <button
            type="button"
            className="admin-logout-link"
            onClick={handleLogout}
          >
            <i className="bi bi-box-arrow-left"></i>
            <span>Cerrar sesión</span>
          </button>
        </div>
      </div>
    </aside>
  );
}

export default AdminSidebar;
