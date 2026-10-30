const API_URL = "http://192.168.100.10:3000/api";

// Obtener las áreas de gestión.
export async function obtenerAreas() {
  const response = await fetch(`${API_URL}/reclamos/areas`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Error al obtener las áreas de gestión.");
  }

  return await response.json();
}

// Crear un reclamo con sus imágenes.
export async function crearReclamo(datosReclamo, imagenes = []) {
  const formData = new FormData();

  // Agregar los campos del formulario.
  Object.entries(datosReclamo).forEach(([campo, valor]) => {
    formData.append(campo, valor ?? "");
  });

  // Agregar las imágenes.
  imagenes.forEach((imagen) => {
    formData.append("imagenes", imagen);
  });

  const response = await fetch(`${API_URL}/reclamos`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  const resultado = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(resultado.mensaje || "No se pudo registrar el reclamo.");
  }

  return resultado;
}

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

  const resultado = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      resultado.mensaje || "No se pudieron obtener tus reclamos.",
    );
  }

  return resultado;
}
