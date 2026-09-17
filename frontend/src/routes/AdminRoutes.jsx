import { Routes, Route } from "react-router-dom";

import AdminLayout from "../layouts/AdminLayout";
import HomeAdmin from "../pages/admin/HomeAdmin";

function AdminRoutes() {
  return (
    <Routes>
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<HomeAdmin />} />
      </Route>
    </Routes>
  );
}

export default AdminRoutes;
