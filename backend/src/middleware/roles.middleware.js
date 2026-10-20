
export function autorizarRoles(...rolesPermitidos) {
  return function (req, res, next) {
    if (!req.usuario) {
      return res.status(401).json({
        message: "No estás autenticado",
      });
    }

    const idRol = Number(req.usuario.idRol);

    if (!rolesPermitidos.includes(idRol)) {
      return res.status(403).json({
        message: "No tenés permisos para realizar esta operación",
      });
    }

    next();
  };
}
