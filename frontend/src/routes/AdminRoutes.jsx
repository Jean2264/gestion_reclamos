import { Routes, Route, Navigate } from "react-router-dom";

import AdminLayout from "../layouts/AdminLayout";
import HomeAdmin from "../pages/admin/HomeAdmin";
import Empleados from "../pages/admin/Empleados";
import Ciudadanos from "../pages/admin/Ciudadanos";
import NuevoReclamo from "../pages/admin/NuevoReclamo";
import LoginAdmin from "../pages/admin/LoginAdmin";
import ProtectedRoute from "./ProtectedRoute";
import PerfilEmpleado from "../pages/admin/PerfilEmpleado";

function AdminRoutes() {
  return (
    <Routes>
      {/* Inicio de sesión administrativo */}
      <Route path="/login-admin" element={<LoginAdmin />} />

      {/* Panel accesible para administradores y empleados */}
      <Route
        element={
          <ProtectedRoute
            rolesPermitidos={["Administrador", "Empleado"]}
            redireccion="/login-admin"
          />
        }
      >
        <Route path="/admin" element={<AdminLayout />}>
          {/* Inicio del panel */}
          <Route index element={<HomeAdmin />} />

          {/* Solo el administrador puede acceder a Empleados */}
          <Route
            element={
              <ProtectedRoute
                rolRequerido="Administrador"
                redireccion="/admin"
              />
            }
          >
            <Route path="empleados" element={<Empleados />} />
          </Route>

          {/* Secciones compartidas */}
          <Route path="ciudadanos" element={<Ciudadanos />} />
          <Route path="nuevo-reclamo" element={<NuevoReclamo />} />
          <Route path="mi-perfil" element={<PerfilEmpleado />} />
        </Route>
      </Route>

      {/* Rutas administrativas no reconocidas */}
      <Route path="/admin/*" element={<Navigate to="/admin" replace />} />
    </Routes>
  );
}

export default AdminRoutes;
