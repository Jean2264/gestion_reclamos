import * as usuarioService from "../services/usuario.service.js";

export async function obtenerUsuario(req, res) {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({
        message: "El email es obligatorio",
      });
    }

    const usuario = await usuarioService.obtenerUsuarioPorEmail(email);

    if (!usuario) {
      return res.status(404).json({
        message: "Usuario no encontrado",
      });
    }

    return res.status(200).json(usuario);
  } catch (error) {
    console.error("Error al obtener usuario", error);

    return res.status(500).json({
      message: "Error interno del servidor",
    });
  }
}
