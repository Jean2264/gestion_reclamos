import {
  areasGestion,
  listarEstadosReclamo,
  CrearReclamoCiudadano,
  CrearReclamoAdmin,
  listarReclamosCiudadano,
  obtenerResumenAdmin,
  listarReclamosAdmin,
  obtenerDetalleAdmin,
  cambiarEstadoReclamo,
  cambiarAreaReclamo,
} from "../services/reclamo.service.js";

// =====================================================
// UTILIDADES
// =====================================================

function responderError(res, error, mensajePredeterminado) {
  console.error(mensajePredeterminado, error);

  const mensaje = error.message || mensajePredeterminado;

  if (error.statusCode === 400) {
    return res.status(400).json({ mensaje });
  }

  if (error.statusCode === 404) {
    return res.status(404).json({ mensaje });
  }

  if (
    mensaje.includes("inválido") ||
    mensaje.includes("no existe") ||
    mensaje.includes("ya se encuentra") ||
    mensaje.includes("ya está") ||
    mensaje.includes("no puede ser") ||
    mensaje.includes("no es válida") ||
    mensaje.includes("posterior")
  ) {
    return res.status(400).json({ mensaje });
  }

  if (mensaje.includes("No se encontró")) {
    return res.status(404).json({ mensaje });
  }

  return res.status(500).json({
    mensaje: mensajePredeterminado,
  });
}

// =====================================================
// OBTENER ÁREAS DE GESTIÓN
// GET /api/reclamos/areas
// =====================================================

export async function obtenerAreas(req, res) {
  try {
    const areas = await areasGestion();

    return res.status(200).json({
      data: areas,
    });
  } catch (error) {
    return responderError(
      res,
      error,
      "No se pudieron obtener las áreas de gestión.",
    );
  }
}

// =====================================================
// OBTENER ESTADOS
// GET /api/reclamos/estados
// =====================================================

export async function obtenerEstados(req, res) {
  try {
    const estados = await listarEstadosReclamo();

    return res.status(200).json({
      data: estados,
    });
  } catch (error) {
    return responderError(
      res,
      error,
      "No se pudieron obtener los estados de los reclamos.",
    );
  }
}

// =====================================================
// CREAR RECLAMO DE CIUDADANO
// POST /api/reclamos
// =====================================================

export async function crearReclamoCiudadano(req, res) {
  try {
    const idCiudadano = req.usuario?.idCiudadano;

    if (!idCiudadano) {
      return res.status(401).json({
        mensaje: "No se pudo identificar al ciudadano autenticado.",
      });
    }

    const {
      numeroPartida,
      calle,
      altura,
      calleUno,
      calleDos,
      localidad,
      codigoPostal,
      detalle,
      estadoTributario,
      idArea,
    } = req.body;

    const datosReclamo = {
      numeroPartida,
      calle,
      altura,
      calleUno,
      calleDos,
      localidad,
      codigoPostal,
      detalle,
      estadoTributario,
      idArea: idArea ? Number(idArea) : null,
    };

    // Conservamos la estructura de archivos de Multer.
    const imagenes = req.files || [];

    const resultado = await CrearReclamoCiudadano(
      datosReclamo,
      imagenes,
      idCiudadano,
    );

    return res.status(201).json({
      mensaje: "Reclamo registrado correctamente.",
      data: resultado,
    });
  } catch (error) {
    return responderError(res, error, "No se pudo registrar el reclamo.");
  }
}

export async function crearReclamoAdmin(req, res) {
  try {
    const {
      id_ciudadano: idCiudadano,
      dni,
      numeroPartida,
      calle,
      altura,
      calleUno,
      calleDos,
      localidad,
      codigoPostal,
      detalle,
      estadoTributario,
      idArea,
    } = req.body;

    const datosReclamo = {
      numeroPartida,
      calle,
      altura,
      calleUno,
      calleDos,
      localidad,
      codigoPostal,
      detalle,
      estadoTributario,
      idArea: idArea ? Number(idArea) : null,
    };

    const resultado = await CrearReclamoAdmin(
      datosReclamo,
      req.files || [],
      idCiudadano,
      dni,
      req.usuario?.idEmpleado ?? req.usuario?.id_empleado ?? null,
    );

    return res.status(201).json({
      mensaje: "Reclamo registrado correctamente.",
      data: resultado,
    });
  } catch (error) {
    return responderError(res, error, "No se pudo registrar el reclamo.");
  }
}

// =====================================================
// LISTAR RECLAMOS DEL CIUDADANO
// GET /api/reclamos/mis-reclamos
// =====================================================

export async function obtenerMisReclamos(req, res) {
  try {
    const idCiudadano = req.usuario?.idCiudadano;

    if (!idCiudadano) {
      return res.status(401).json({
        mensaje: "No se pudo identificar al ciudadano autenticado.",
      });
    }

    const {
      estado = "",
      desde = "",
      hasta = "",
      pagina = 1,
      limite = 10,
    } = req.query;

    const resultado = await listarReclamosCiudadano({
      idCiudadano,
      estado,
      desde,
      hasta,
      pagina,
      limite,
    });

    return res.status(200).json({
      data: resultado.reclamos,
      paginacion: resultado.paginacion,
    });
  } catch (error) {
    return responderError(
      res,
      error,
      "No se pudieron obtener los reclamos del ciudadano.",
    );
  }
}

// =====================================================
// ADMINISTRACIÓN: RESUMEN DE ESTADOS
// GET /api/reclamos/admin/resumen
// =====================================================

export async function obtenerResumenReclamosAdmin(req, res) {
  try {
    const resultado = await obtenerResumenAdmin();

    return res.status(200).json({
      data: resultado,
    });
  } catch (error) {
    return responderError(
      res,
      error,
      "No se pudo obtener el resumen de reclamos.",
    );
  }
}

// =====================================================
// ADMINISTRACIÓN: LISTAR RECLAMOS
// GET /api/reclamos/admin
// =====================================================

export async function obtenerReclamosAdmin(req, res) {
  try {
    const {
      estado = "",
      idEstado = "",
      buscar = "",
      pagina = 1,
      limite = 10,
    } = req.query;

    const resultado = await listarReclamosAdmin({
      estado,
      idEstado,
      buscar,
      pagina,
      limite,
    });

    return res.status(200).json(resultado);
  } catch (error) {
    return responderError(res, error, "No se pudieron obtener los reclamos.");
  }
}

// =====================================================
// ADMINISTRACIÓN: INSPECCIONAR RECLAMO
// GET /api/reclamos/admin/:id
// =====================================================

export async function obtenerDetalleReclamoAdmin(req, res) {
  try {
    const { id } = req.params;

    const resultado = await obtenerDetalleAdmin(id);

    return res.status(200).json(resultado);
  } catch (error) {
    return responderError(
      res,
      error,
      "No se pudo obtener el detalle del reclamo.",
    );
  }
}

// =====================================================
// ADMINISTRACIÓN: CAMBIAR ESTADO
// PATCH /api/reclamos/admin/:id/estado
// =====================================================

export async function actualizarEstadoAdmin(req, res) {
  try {
    const { id } = req.params;

    const { id_estado, resolucion = null } = req.body;

    if (id_estado === undefined || id_estado === null || id_estado === "") {
      return res.status(400).json({
        mensaje: "El campo id_estado es obligatorio.",
      });
    }

    /*
     * El middleware de autenticación debe proporcionar req.usuario.
     * La asociación entre usuario autenticado e id_empleado depende
     * de cómo esté implementada actualmente tu autenticación.
     */
    const idEmpleado = req.usuario?.idEmpleado ?? null;

    const resultado = await cambiarEstadoReclamo({
      idReclamo: id,
      idEstado: id_estado,
      resolucion,
      idEmpleado,
    });

    return res.status(200).json(resultado);
  } catch (error) {
    return responderError(
      res,
      error,
      "No se pudo actualizar el estado del reclamo.",
    );
  }
}

// =====================================================
// ADMINISTRACIÓN: CAMBIAR ÁREA
// PATCH /api/reclamos/admin/:id/area
// =====================================================

export async function actualizarAreaAdmin(req, res) {
  try {
    const { id } = req.params;
    const { id_area } = req.body;

    if (id_area === undefined || id_area === null || id_area === "") {
      return res.status(400).json({
        mensaje: "El campo id_area es obligatorio.",
      });
    }

    const resultado = await cambiarAreaReclamo({
      idReclamo: id,
      idArea: id_area,
    });

    return res.status(200).json(resultado);
  } catch (error) {
    return responderError(
      res,
      error,
      "No se pudo actualizar el área del reclamo.",
    );
  }
}
