import { Routes, Route, Navigate } from "react-router-dom";

import AdminLayout from "../layouts/AdminLayout";
import HomeAdmin from "../pages/admin/HomeAdmin";
import Empleados from "../pages/admin/Empleados";
import Ciudadanos from "../pages/admin/Ciudadanos";
import NuevoReclamo from "../pages/admin/NuevoReclamo";
import LoginAdmin from "../pages/admin/LoginAdmin";
import ProtectedRoute from "./ProtectedRoute";

function AdminRoutes() {
  return (
    <Routes>
      <Route path="/login-admin" element={<LoginAdmin />} />

      <Route
        element={
          <ProtectedRoute
            rolRequerido="Administrador"
            redireccion="/login-admin"
          />
        }
      >
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<HomeAdmin />} />
          <Route path="empleados" element={<Empleados />} />
          <Route path="ciudadanos" element={<Ciudadanos />} />
          <Route path="nuevo-reclamo" element={<NuevoReclamo />} />
        </Route>
      </Route>

      <Route path="/admin/*" element={<Navigate to="/login-admin" replace />} />
    </Routes>
  );
}

export default AdminRoutes;
