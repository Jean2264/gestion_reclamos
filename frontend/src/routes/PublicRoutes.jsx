import { Routes, Route } from "react-router-dom";

import Home from "../pages/public/Home";
import Welcome from "../pages/public/Welcome";
import MiPerfil from "../pages/public/MiPerfil";
import MisReclamos from "../pages/public/MisReclamos";
import ProtectedRoute from "./ProtectedRoute";

function PublicRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Welcome />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/reclamo" element={<Home />} />
        <Route path="/perfil" element={<MiPerfil />} />
        <Route path="/mis-reclamos" element={<MisReclamos />} />
      </Route>
    </Routes>
  );
}

export default PublicRoutes;
