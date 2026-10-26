import * as reclamoService from "../services/reclamo.service.js";

export async function obtenerAreas(req, res) {
  try {
    const areas = await reclamoService.areasGestion();

    return res.status(200).json(areas);
  } catch (error) {
    console.error("Error al obtener las áreas:", error);

    return res.status(500).json({
      mensaje: "Error al obtener las áreas de gestión.",
    });
  }
}

export async function crearReclamoCiudadano(req, res) {
  try {
    // El ID debe proceder del usuario autenticado.
    const idCiudadano = req.usuario.idCiudadano;

    if (!idCiudadano) {
      return res.status(403).json({
        mensaje: "No se encontró un ciudadano asociado a la sesión.",
      });
    }

    const {
      numeroPartida,
      calle,
      altura,
      calleUno,
      calleDos,
      localidad,
      codigoPostal,
      detalle,
      estadoTributario,
      idArea,
    } = req.body;

    const imagenes = (req.files ?? []).map((archivo) => ({
      imagenUrl: `/uploads/${archivo.filename}`,
    }));

    const datosReclamo = {
      numeroPartida,
      calle,
      altura,
      calleUno,
      calleDos,
      localidad,
      codigoPostal,
      detalle,
      estadoTributario,
      idCiudadano,
      idArea: Number(idArea),
    };

    const nuevoReclamo = await reclamoService.CrearReclamoCiudadano(
      datosReclamo,
      imagenes,
      idCiudadano,
    );

    return res.status(201).json({
      mensaje: "El reclamo se registró correctamente.",
      reclamo: {
        idReclamo: nuevoReclamo.id_reclamo,
        codigoReclamo: nuevoReclamo.codigo_reclamo,
        fechaRegistro: nuevoReclamo.fecha_alta,
        estado: "Nuevo",
        numeroPartida: nuevoReclamo.numero_partida,
        calle: nuevoReclamo.calle,
        altura: nuevoReclamo.altura,
        calleUno: nuevoReclamo.calle_uno,
        calleDos: nuevoReclamo.calle_dos,
        localidad: nuevoReclamo.localidad,
        codigoPostal: nuevoReclamo.codigo_postal,
        detalle: nuevoReclamo.detalle_reclamo,
        estadoTributario: nuevoReclamo.estado_tributario,
        idArea: nuevoReclamo.id_area,
      },
    });
  } catch (error) {
    console.error("Error al crear el reclamo:", error);

    return res.status(500).json({
      mensaje: "No se pudo registrar el reclamo.",
    });
  }
}

export async function obtenerMisReclamos(req, res, next) {
  try {
    const { estado, desde, hasta, pagina = "1", limite = "10" } = req.query;

    // El ID proviene del JWT validado por el middleware.
    const idCiudadano = req.usuario?.idCiudadano;

    if (!idCiudadano) {
      return res.status(401).json({
        mensaje: "No se pudo identificar al ciudadano autenticado.",
      });
    }

    const resultado = await reclamoService.listarReclamosCiudadano({
      idCiudadano,
      estado,
      desde,
      hasta,
      pagina,
      limite,
    });

    return res.status(200).json({
      data: resultado.reclamos,
      paginacion: resultado.paginacion,
    });
  } catch (error) {
    if (
      error.message.includes("fecha") ||
      error.message.includes("página") ||
      error.message.includes("registros por página")
    ) {
      return res.status(400).json({
        mensaje: error.message,
      });
    }

    return next(error);
  }
}
