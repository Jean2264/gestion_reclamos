import * as usuarioRepository from "../repositories/usuario.repository.js";

export async function obtenerUsuarioPorEmail(email) {
  return await usuarioRepository.bucarUsuarioPorEmail(email);
}
