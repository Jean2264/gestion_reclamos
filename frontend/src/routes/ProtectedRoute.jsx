import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";

import { AuthContext } from "../context/AuthProvider";

function ProtectedRoute() {
  const { usuario, cargando } = useContext(AuthContext);

  if (cargando) {
    return <p>Comprobando sesión...</p>;
  }

  if (!usuario) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
