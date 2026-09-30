import { Routes, Route } from "react-router-dom";

import Home from "../pages/public/Home";
import Welcome from "../pages/public/Welcome";
import MiPerfil from "../pages/public/MiPerfil";
import MisReclamos from "../pages/public/MisReclamos";

function PublicRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Welcome />} />
      <Route path="/home" element={<Home />} />
      <Route path="/perfil" element={<MiPerfil />} />
      <Route path="/mis-reclamos" element={<MisReclamos />} />
    </Routes>
  );
}

export default PublicRoutes;
