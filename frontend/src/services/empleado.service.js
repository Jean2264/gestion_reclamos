const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

// =====================================================
// OBTENER EMPLEADOS CON PAGINACIÓN
// =====================================================

// Obtener empleados con búsqueda y paginación.
export async function getEmpleados(search = "", page = 1, limit = 20) {
  const params = new URLSearchParams({
    search,
    page: String(page),
    limit: String(limit),
  });

  const response = await fetch(`${API_URL}/empleados?${params.toString()}`, {
    method: "GET",
    credentials: "include",
  });

  const resultado = await response.json().catch(() => null);

  if (!response.ok) {
    const error = new Error(
      resultado?.message || "No se pudo obtener la lista de empleados.",
    );

    error.status = response.status;
    throw error;
  }

  return resultado;
}

// Obtener los datos completos de un empleado por su ID.
export async function fetchEmpleadoById(id_empleado) {
  const response = await fetch(`${API_URL}/empleados/buscar`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id_empleado: Number(id_empleado),
    }),
  });

  const resultado = await response.json().catch(() => null);

  if (!response.ok) {
    const error = new Error(
      resultado?.message || "No se pudo obtener el empleado.",
    );

    error.status = response.status;
    throw error;
  }

  return resultado.empleado;
}
// =====================================================
// CREAR EMPLEADO
// =====================================================

export async function crearEmpleado(datosEmpleado) {
  const response = await fetch(`${API_URL}/empleados`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      dni: datosEmpleado.dni,
      apellido: datosEmpleado.apellido,
      nombre: datosEmpleado.nombre,
      telefono: datosEmpleado.telefono,
      email: datosEmpleado.email,
      id_rol: Number(datosEmpleado.id_rol),
      calle: datosEmpleado.calle,
      numero: datosEmpleado.numero,
      localidad: datosEmpleado.localidad,
      codigoPostal: datosEmpleado.codigoPostal ?? datosEmpleado.codigo_postal,
    }),
  });

  const resultado = await response.json().catch(() => null);

  if (!response.ok) {
    const error = new Error(
      resultado?.message || "No se pudo registrar el empleado.",
    );

    error.status = response.status;
    error.errors = resultado?.errors ?? null;

    throw error;
  }

  return resultado.data;
}
