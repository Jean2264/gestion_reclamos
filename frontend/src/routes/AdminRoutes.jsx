import { Routes, Route } from "react-router-dom";

import AdminLayout from "../layouts/AdminLayout";
import HomeAdmin from "../pages/admin/HomeAdmin";
import Empleados from "../pages/admin/Empleados";
import Ciudadanos from "../pages/admin/Ciudadanos";

function AdminRoutes() {
  return (
    <Routes>
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<HomeAdmin />} />
        <Route path="empleados" element={<Empleados />} />
        <Route path="ciudadanos" element={<Ciudadanos />} />
      </Route>
    </Routes>
  );
}

export default AdminRoutes;
