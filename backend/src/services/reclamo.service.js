import * as reclamoRepository from "../repositories/reclamo.repository.js";
import * as imgReclamoRepository from "../repositories/imagenReclamo.repository.js";
import * as historicoReclamo from "../repositories/historicoReclamo.repository.js";
import pool from "../config/database.js";

// Obtener las áreas de gestión
export async function areasGestion() {
  return await reclamoRepository.areasGestion();
}

// Crear un reclamo para un ciudadano
export async function CrearReclamoCiudadano(
  datosReclamo,
  imagenes = [],
  idCiudadano,
) {
  if (!Array.isArray(imagenes) || imagenes.length > 2) {
    throw new Error("El reclamo puede tener como máximo 2 imágenes.");
  }

  if (!idCiudadano) {
    throw new Error("No se pudo identificar al ciudadano.");
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Obtener el estado inicial desde la base de datos.
    const estadoInicial = await reclamoRepository.obtenerEstadoPorNombre(
      "Nuevo",
      client,
    );

    if (!estadoInicial) {
      throw new Error("No se encontró el estado inicial 'Nuevo'.");
    }
    // 1. Crear el reclamo en la base de datos.
    const nuevoReclamo = await reclamoRepository.crearReclamo(
      datosReclamo,
      estadoInicial.id_estado,
      client,
    );

    // 2. Generar el código a partir del ID del reclamo.
    const codigoReclamo = `REC${String(nuevoReclamo.id_reclamo).padStart(6, "0")}`;

    // 3. Guardar el código en el registro del reclamo.
    const reclamoActualizado = await reclamoRepository.actualizarCodigoReclamo(
      nuevoReclamo.id_reclamo,
      codigoReclamo,
      client,
    );

    // Registrar las imágenes.
    for (const imagen of imagenes) {
      await imgReclamoRepository.crearImagenReclamo(
        imagen.imagenUrl,
        nuevoReclamo.id_reclamo,
        client,
      );
    }

    // Registrar el estado inicial en el historial.
    await historicoReclamo.crearHistorico(
      {
        estado: estadoInicial.nombre_estado,
        resolucion: null,
        idReclamo: nuevoReclamo.id_reclamo,
        idEmpleado: null,
      },
      client,
    );

    await client.query("COMMIT");

    return reclamoActualizado;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

export async function listarReclamosCiudadano({
  idCiudadano,
  estado,
  desde,
  hasta,
  pagina = 1,
  limite = 10,
}) {
  if (!idCiudadano) {
    throw new Error("No se pudo identificar al ciudadano.");
  }

  const numeroPagina = Number(pagina);
  const cantidadPorPagina = Number(limite);

  if (!Number.isInteger(numeroPagina) || numeroPagina < 1) {
    throw new Error("El número de página no es válido.");
  }

  if (
    !Number.isInteger(cantidadPorPagina) ||
    cantidadPorPagina < 1 ||
    cantidadPorPagina > 50
  ) {
    throw new Error("La cantidad de registros por página no es válida.");
  }

  if (desde && !esFechaValida(desde)) {
    throw new Error("La fecha inicial no es válida.");
  }

  if (hasta && !esFechaValida(hasta)) {
    throw new Error("La fecha final no es válida.");
  }

  if (desde && hasta && desde > hasta) {
    throw new Error(
      "La fecha inicial no puede ser posterior a la fecha final.",
    );
  }

  const filtros = {
    idCiudadano,
    estado: estado || null,
    desde: desde || null,
    hasta: hasta || null,
  };

  const offset = (numeroPagina - 1) * cantidadPorPagina;

  const [reclamos, total] = await Promise.all([
    reclamoRepository.obtenerMisReclamos({
      ...filtros,
      limite: cantidadPorPagina,
      offset,
    }),
    reclamoRepository.contarMisReclamos(filtros),
  ]);

  return {
    reclamos,
    paginacion: {
      pagina: numeroPagina,
      limite: cantidadPorPagina,
      total,
      totalPaginas: Math.ceil(total / cantidadPorPagina),
    },
  };
}

function esFechaValida(fecha) {
  if (typeof fecha !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
    return false;
  }

  const [anio, mes, dia] = fecha.split("-").map(Number);
  const fechaComprobacion = new Date(Date.UTC(anio, mes - 1, dia));

  return (
    fechaComprobacion.getUTCFullYear() === anio &&
    fechaComprobacion.getUTCMonth() === mes - 1 &&
    fechaComprobacion.getUTCDate() === dia
  );
}
