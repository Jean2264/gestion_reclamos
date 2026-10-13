import * as ciudadanoRepository from "../repositories/ciudadano.repository.js";

export async function miPerfil(idCiudadano) {
  const ciudadano = await ciudadanoRepository.miPerfil(idCiudadano);

  if (!ciudadano) {
    throw new Error("Ciudadano no encontrado");
  }

  return ciudadano;
}
