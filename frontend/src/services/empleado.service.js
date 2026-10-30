const API_URL =
  import.meta.env.VITE_API_URL || "http://192.168.100.10:3000/api";

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
