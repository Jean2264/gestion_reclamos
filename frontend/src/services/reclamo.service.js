const API_URL = "http://localhost:3000/api";

export async function obtenerAreas() {
  const response = await fetch(`${API_URL}/reclamos/areas`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Error al obtener las áreas de gestión");
  }

  return await response.json();
}