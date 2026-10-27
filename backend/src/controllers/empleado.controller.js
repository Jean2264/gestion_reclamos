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
