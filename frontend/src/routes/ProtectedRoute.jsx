import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";

import { AuthContext } from "../context/AuthProvider";

function ProtectedRoute({ rolRequerido, rolesPermitidos, redireccion = "/" }) {
  const { usuario, cargando } = useContext(AuthContext);

  if (cargando) {
    return <p>Comprobando sesión...</p>;
  }

  if (!usuario) {
    return <Navigate to={redireccion} replace />;
  }

  const rol = usuario.usuario?.nombre_rol;

  // Comprobar un rol específico.
  if (rolRequerido && rol !== rolRequerido) {
    return <Navigate to={redireccion} replace />;
  }

  // Comprobar si el rol está incluido en la lista permitida.
  if (rolesPermitidos && !rolesPermitidos.includes(rol)) {
    return <Navigate to={redireccion} replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
