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

//actualizar datos
export async function actualizarMiPerfil(req, res) {
  try {
    const { idCiudadano, idUsuario } = req.usuario;

    if (!idCiudadano || !idUsuario) {
      return res.status(403).json({
        message: "La sesión no está asociada a un ciudadano",
      });
    }

    const perfil = await ciudadanoService.actualizarMiPerfil(
      idCiudadano,
      idUsuario,
      req.body,
    );

    return res.status(200).json({
      message: "Perfil actualizado correctamente",
      data: perfil,
    });
  } catch (error) {
    console.error("Error al actualizar el perfil:", error);

    if (error.statusCode === 400) {
      return res.status(400).json({
        message: error.message,
        errors: error.details,
      });
    }

    if (error.statusCode === 409 || error.code === "23505") {
      return res.status(409).json({
        message: "Ese email ya está registrado",
        errors: {
          email: "Elegí otra dirección de correo",
        },
      });
    }

    if (
      error.message === "Ciudadano no encontrado" ||
      error.message === "Usuario no encontrado"
    ) {
      return res.status(404).json({
        message: error.message,
      });
    }

    return res.status(500).json({
      message: "Error interno al actualizar el perfil",
    });
  }
}




export async function crear(req, res) {
  try {
    const ciudadano = await ciudadanoService.crearCiudadanoDesdePanel(
      req.body,
    );

    return res.status(201).json({
      message: "Ciudadano creado correctamente",
      data: ciudadano,
    });
  } catch (error) {
    console.error("Error al crear ciudadano:", error);

    if (error.statusCode === 400) {
      return res.status(400).json({
        message: error.message,
        errors: error.details ?? {},
      });
    }

    if (error.statusCode === 409 || error.code === "23505") {
      return res.status(409).json({
        message: error.message || "El email o el DNI ya están registrados",
        errors: error.details ?? {},
      });
    }

    return res.status(500).json({
      message: "Error interno al crear el ciudadano",
    });
  }
}

export async function getCiudadanos(req, res) {
  try {
    const search = String(req.query.search ?? "").trim();
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20));
    const resultado = await ciudadanoService.getAllCiudadanos(
      search,
      page,
      limit,
    );

    return res.status(200).json(resultado);
  } catch (error) {
    console.error("Error al obtener ciudadanos:", error);

    return res.status(500).json({
      message: "Error al obtener la lista de ciudadanos",
    });
  }
}

export async function fetchCiudadano(req, res) {
  try {
    const { id_ciudadano: idCiudadano } = req.body;

    if (!Number.isInteger(Number(idCiudadano)) || Number(idCiudadano) <= 0) {
      return res.status(400).json({
        message: "El ID del ciudadano no es válido",
      });
    }

    const ciudadano = await ciudadanoService.fetchCiudadano(
      Number(idCiudadano),
    );

    if (!ciudadano) {
      return res.status(404).json({
        message: "Ciudadano no encontrado",
      });
    }

    return res.status(200).json({ ciudadano });
  } catch (error) {
    console.error("Error al obtener el ciudadano:", error);

    return res.status(500).json({
      message: "Error al obtener los datos del ciudadano",
    });
  }
}
