import e from "express";
import * as ciudadanoService from "../services/ciudadano.service.js";

/**export async function obtenerPerfil(req, res) 
 * { try { const { idCiudadano } = req.usuario; const
perfil = await usuarioService.obtenerPerfil(idCiudadano); return res.status(200).json({ data:
perfil, }); } catch (error) { console.error(error); return res.status(500).json({ message: "Error
interno del servidor", }); } } */

export async function miPerfil(req, res) {
  try {
    const { idCiudadano } = req.usuario;

    if (!idCiudadano) {
      return res.status(403).json({
        message: "La sesión no está asociada a un ciudadano",
      });
    }

    const ciudadano = await ciudadanoService.miPerfil(idCiudadano);

    return res.status(200).json({
      data: ciudadano,
    });
  } catch (error) {
    console.error("Error al obtener el perfil:", error);

    if (error.message === "Ciudadano no encontrado") {
      return res.status(404).json({
        message: "Ciudadano no encontrado",
      });
    }

    return res.status(500).json({
      message: "Error interno del servidor",
    });
  }
}
