import { Routes, Route } from "react-router-dom";

import AdminLayout from "../layouts/AdminLayout";
import HomeAdmin from "../pages/admin/HomeAdmin";
import Empleados from "../pages/admin/Empleados";
import Ciudadanos from "../pages/admin/Ciudadanos";
import NuevoReclamo from "../pages/admin/NuevoReclamo";
import LoginAdmin from "../pages/admin/LoginAdmin";

function AdminRoutes() {
  return (
    <Routes>
      <Route
      path="/login-admin"
      element={<LoginAdmin/>}
      />
      
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<HomeAdmin />} />
        <Route path="empleados" element={<Empleados />} />
        <Route path="ciudadanos" element={<Ciudadanos />} />
        <Route path="nuevo-reclamo" element={<NuevoReclamo />} />
      </Route>
    </Routes>
  );
}

export default AdminRoutes;
