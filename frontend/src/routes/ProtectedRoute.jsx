import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";

import { AuthContext } from "../context/AuthProvider";

function ProtectedRoute({ rolRequerido, redireccion = "/" }) {
  const { usuario, cargando } = useContext(AuthContext);

  if (cargando) {
    return <p>Comprobando sesión...</p>;
  }

  if (!usuario) {
    return <Navigate to={redireccion} replace />;
  }

  const rol = usuario.usuario?.nombre_rol;

  if (rolRequerido && rol !== rolRequerido) {
    return <Navigate to={redireccion} replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
