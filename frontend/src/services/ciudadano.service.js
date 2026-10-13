const API_URL = "http://localhost:3000/api";

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
