const API_URL = "http://10.0.9.50:3000/api";

// Si tu backend se ejecuta en otra dirección, cambiá la URL.
// const API_URL = "http://localhost:3000/api";

// =====================================================
// UTILIDAD: PROCESAR RESPUESTAS
// =====================================================

async function procesarRespuesta(response, mensajePredeterminado) {
  const resultado = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(resultado.mensaje || mensajePredeterminado);
  }

  return resultado;
}

// =====================================================
// CIUDADANO: OBTENER ÁREAS
// GET /api/reclamos/areas
// =====================================================

export async function obtenerAreas() {
  const response = await fetch(`${API_URL}/reclamos/areas`, {
    method: "GET",
    credentials: "include",
  });

  const resultado = await procesarRespuesta(
    response,
    "No se pudieron obtener las áreas de gestión.",
  );

  return resultado.data;
}

// =====================================================
// CIUDADANO: OBTENER ESTADOS
// GET /api/reclamos/estados
// =====================================================

export async function obtenerEstados() {
  const response = await fetch(`${API_URL}/reclamos/estados`, {
    method: "GET",
    credentials: "include",
  });

  const resultado = await procesarRespuesta(
    response,
    "No se pudieron obtener los estados.",
  );

  return resultado.data;
}

// =====================================================
// CIUDADANO: CREAR RECLAMO
// POST /api/reclamos
// =====================================================

export async function crearReclamo(datosReclamo, imagenes = []) {
  const formData = new FormData();

  Object.entries(datosReclamo).forEach(([campo, valor]) => {
    formData.append(campo, valor ?? "");
  });

  imagenes.forEach((imagen) => {
    formData.append("imagenes", imagen);
  });

  const response = await fetch(`${API_URL}/reclamos`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  return await procesarRespuesta(response, "No se pudo registrar el reclamo.");
}

export async function crearReclamoAdmin(
  datosReclamo,
  idCiudadano,
  dni,
  imagenes = [],
) {
  const formData = new FormData();

  Object.entries({
    ...datosReclamo,
    id_ciudadano: idCiudadano,
    dni,
  }).forEach(([campo, valor]) => {
    formData.append(campo, valor ?? "");
  });

  imagenes.forEach((imagen) => {
    formData.append("imagenes", imagen);
  });

  const response = await fetch(`${API_URL}/reclamos/admin`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  return await procesarRespuesta(response, "No se pudo registrar el reclamo.");
}

// =====================================================
// CIUDADANO: OBTENER SUS RECLAMOS
// GET /api/reclamos/mis-reclamos
// =====================================================

export async function obtenerMisReclamos({
  estado = "",
  desde = "",
  hasta = "",
  pagina = 1,
  limite = 10,
} = {}) {
  const parametros = new URLSearchParams();

  if (estado) parametros.set("estado", estado);
  if (desde) parametros.set("desde", desde);
  if (hasta) parametros.set("hasta", hasta);

  parametros.set("pagina", String(pagina));
  parametros.set("limite", String(limite));

  const response = await fetch(
    `${API_URL}/reclamos/mis-reclamos?${parametros.toString()}`,
    {
      method: "GET",
      credentials: "include",
    },
  );

  return await procesarRespuesta(
    response,
    "No se pudieron obtener tus reclamos.",
  );
}

// =====================================================
// ADMINISTRACIÓN: RESUMEN DE ESTADOS
// GET /api/reclamos/admin/resumen
// =====================================================

export async function obtenerResumenReclamos() {
  const response = await fetch(`${API_URL}/reclamos/admin/resumen`, {
    method: "GET",
    credentials: "include",
  });

  const resultado = await procesarRespuesta(
    response,
    "No se pudo obtener el resumen de reclamos.",
  );

  return resultado.data;
}

// =====================================================
// ADMINISTRACIÓN: LISTAR RECLAMOS
// GET /api/reclamos/admin
// =====================================================

export async function obtenerReclamosAdmin({
  estado = "",
  idEstado = "",
  buscar = "",
  pagina = 1,
  limite = 10,
} = {}) {
  const parametros = new URLSearchParams();

  if (estado) parametros.set("estado", estado);
  if (idEstado !== "" && idEstado !== null) {
    parametros.set("idEstado", String(idEstado));
  }

  if (buscar.trim()) {
    parametros.set("buscar", buscar.trim());
  }

  parametros.set("pagina", String(pagina));
  parametros.set("limite", String(limite));

  const response = await fetch(
    `${API_URL}/reclamos/admin?${parametros.toString()}`,
    {
      method: "GET",
      credentials: "include",
    },
  );

  return await procesarRespuesta(
    response,
    "No se pudieron obtener los reclamos.",
  );
}

// =====================================================
// ADMINISTRACIÓN: INSPECCIONAR RECLAMO
// GET /api/reclamos/admin/:id
// =====================================================

export async function obtenerDetalleReclamo(idReclamo) {
  const response = await fetch(
    `${API_URL}/reclamos/admin/${encodeURIComponent(idReclamo)}`,
    {
      method: "GET",
      credentials: "include",
    },
  );

  return await procesarRespuesta(
    response,
    "No se pudo obtener el detalle del reclamo.",
  );
}

// =====================================================
// ADMINISTRACIÓN: CAMBIAR ESTADO
// PATCH /api/reclamos/admin/:id/estado
// =====================================================

export async function actualizarEstadoReclamo(
  idReclamo,
  idEstado,
  resolucion = null,
) {
  const response = await fetch(
    `${API_URL}/reclamos/admin/${encodeURIComponent(idReclamo)}/estado`,
    {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id_estado: idEstado,
        resolucion,
      }),
    },
  );

  return await procesarRespuesta(
    response,
    "No se pudo actualizar el estado del reclamo.",
  );
}

// =====================================================
// ADMINISTRACIÓN: CAMBIAR ÁREA ASIGNADA
// PATCH /api/reclamos/admin/:id/area
// =====================================================

export async function actualizarAreaReclamo(idReclamo, idArea) {
  const response = await fetch(
    `${API_URL}/reclamos/admin/${encodeURIComponent(idReclamo)}/area`,
    {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id_area: idArea,
      }),
    },
  );

  return await procesarRespuesta(
    response,
    "No se pudo actualizar el área del reclamo.",
  );
}
