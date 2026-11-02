import * as empleadoService from "../services/empleado.service.js";

// Crear empleado desde el panel administrativo
export async function crearEmpleado(req, res) {
  try {
    const empleado = await empleadoService.crearEmpleadoDesdePanel(req.body);

    return res.status(201).json({
      success: true,
      message: "Empleado creado correctamente",
      data: empleado,
    });
  } catch (error) {
    console.error("Error al crear empleado:", error);

    const statusCode = error.statusCode || 500;

    return res.status(statusCode).json({
      success: false,
      message:
        statusCode === 500
          ? "Ocurrió un error al crear el empleado"
          : error.message,
      errors: error.details || null,
    });
  }
}

export async function getEmpleados(req, res) {
  try {
    const search = req.query.search || "";
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20));

    const resultado = await empleadoService.getAllEmpleados(
      search,
      page,
      limit,
    );

    return res.status(200).json({
      empleados: resultado.empleados,
      totalRecords: resultado.totalRecords,
      page,
      limit,
      totalPages: Math.ceil(resultado.totalRecords / limit),
    });
  } catch (error) {
    console.error("Error al obtener empleados:", error);

    return res.status(500).json({
      message: "Error al obtener la lista de empleados",
    });
  }
}
export async function fetchEmpleado(req, res) {
  try {
    const { id_empleado } = req.body;

    // Validar el ID
    if (!Number.isInteger(Number(id_empleado)) || Number(id_empleado) <= 0) {
      return res.status(400).json({
        message: "El ID del empleado no es válido",
      });
    }

    // Consultar el empleado
    const empleado = await empleadoService.fetchEmpleado(Number(id_empleado));

    // Verificar si existe
    if (!empleado) {
      return res.status(404).json({
        message: "Empleado no encontrado",
      });
    }

    return res.status(200).json({
      empleado,
    });
  } catch (error) {
    console.error("Error al obtener el empleado:", error);

    return res.status(500).json({
      message: "Error al obtener los datos del empleado",
    });
  }
}

// Editar empleado desde el panel administrativo.
export async function editarEmpleado(req, res) {
  try {
    const { id_empleado } = req.params;

    const empleado = await empleadoService.editarEmpleadoDesdePanel(
      id_empleado,
      req.body,
    );

    return res.status(200).json({
      success: true,
      message: "Empleado actualizado correctamente",
      data: empleado,
    });
  } catch (error) {
    console.error("Error al editar empleado:", error);

    const statusCode = error.statusCode || 500;

    return res.status(statusCode).json({
      success: false,
      message:
        statusCode === 500
          ? "Ocurrió un error al actualizar el empleado"
          : error.message,
      errors: error.details || null,
    });
  }
}

// Desactivar empleado desde el panel administrativo.
export async function desactivarEmpleado(req, res) {
  try {
    const { id_empleado } = req.params;

    const empleado =
      await empleadoService.desactivarEmpleadoDesdePanel(id_empleado);

    return res.status(200).json({
      success: true,
      message: "Empleado desactivado correctamente",
      data: empleado,
    });
  } catch (error) {
    console.error("Error al desactivar empleado:", error);

    const statusCode = error.statusCode || 500;

    return res.status(statusCode).json({
      success: false,
      message:
        statusCode === 500
          ? "Ocurrió un error al desactivar el empleado"
          : error.message,
    });
  }
}

// GET: consultar el perfil del empleado autenticado.
export async function obtenerMiPerfilEmpleado(req, res) {
  try {
    const idUsuario = req.usuario?.idUsuario ?? req.usuario?.id_usuario;

    const perfil = await empleadoService.obtenerMiPerfilEmpleado(idUsuario);

    return res.status(200).json({
      data: perfil,
    });
  } catch (error) {
    console.error("Error al consultar el perfil del empleado:", error);

    return res.status(error.statusCode || 500).json({
      message:
        error.statusCode && error.statusCode < 500
          ? error.message
          : "No se pudo obtener el perfil del empleado.",
      errors: error.details ?? {},
    });
  }
}

// PUT: actualizar el perfil del empleado autenticado.
export async function actualizarMiPerfilEmpleado(req, res) {
  try {
    const idUsuario = req.usuario?.idUsuario ?? req.usuario?.id_usuario;

    const perfilActualizado = await empleadoService.actualizarMiPerfilEmpleado(
      idUsuario,
      req.body,
    );

    return res.status(200).json({
      message: "Perfil actualizado correctamente.",
      data: perfilActualizado,
    });
  } catch (error) {
    console.error("Error al actualizar el perfil del empleado:", error);

    return res.status(error.statusCode || 500).json({
      message:
        error.statusCode && error.statusCode < 500
          ? error.message
          : "No se pudo actualizar el perfil del empleado.",
      errors: error.details ?? {},
    });
  }
}
