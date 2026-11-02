const API_URL = "http://localhost:3000/api";

//const API_URL = "http://192.168.100.10:3000/api";

export async function getCiudadanos(search = "", page = 1, limit = 20) {
  const params = new URLSearchParams({
    search,
    page: String(page),
    limit: String(limit),
  });
  const response = await fetch(
    `${API_URL}/ciudadanos?${params.toString()}`,
    {
      method: "GET",
      credentials: "include",
    },
  );
  const resultado = await response.json().catch(() => null);

  if (!response.ok) {
    const error = new Error(
      resultado?.message || "No se pudo obtener la lista de ciudadanos.",
    );
    error.status = response.status;
    throw error;
  }

  return resultado;
}

export async function fetchCiudadanoById(idCiudadano) {
  const response = await fetch(`${API_URL}/ciudadanos/buscar`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id_ciudadano: Number(idCiudadano) }),
  });
  const resultado = await response.json().catch(() => null);

  if (!response.ok) {
    const error = new Error(
      resultado?.message || "No se pudo obtener el ciudadano.",
    );
    error.status = response.status;
    throw error;
  }

  return resultado.ciudadano;
}

export async function miPerfil() {
  const response = await fetch(`${API_URL}/ciudadanos/me`, {
    method: "GET",
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "No se pudo obtener el perfil");
  }

  return data;
}

export async function actualizarMiPerfil(datosPerfil) {
  const response = await fetch(`${API_URL}/ciudadanos/me`, {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(datosPerfil),
  });

  const data = await response.json();

  if (!response.ok) {
    const error = new Error(data.message || "No se pudo actualizar el perfil");

    error.status = response.status;
    error.errors = data.errors;

    throw error;
  }

  return data;
}

//crear desde el apartado administrativo

export async function crearCiudadano(datosCiudadano) {
  const response = await fetch(`${API_URL}/ciudadanos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(datosCiudadano),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(
      data.message || "No se pudo registrar al ciudadano.",
    );

    error.status = response.status;
    error.errors = data.errors;

    throw error;
  }

  return data;
}
