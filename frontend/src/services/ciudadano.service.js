const API_URL = "http://localhost:3000/api";

export async function miPerfil() {
  const response = await fetch(`${API_URL}/ciudadano/me`, {
    method: "GET",
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "No se pudo obtener el perfil");
  }

  return data;
}
