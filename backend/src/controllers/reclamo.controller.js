import * as reclamoService from "../services/reclamo.service.js";

export async function  obtenerAreas(req, res) {
      try {
    const areas = await reclamoService.areasGestion();

    return res.status(200).json(areas);
  } catch (error) {
    console.error("Error al obtener las áreas:", error);

    return res.status(500).json({
      mensaje: "Error al obtener las áreas de gestión."
    });
  }
}