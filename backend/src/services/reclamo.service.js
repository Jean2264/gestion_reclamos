import pool from "../config/database.js";
import { mkdir, writeFile, unlink } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { UPLOADS_DIR } from "../config/uploads.js";

import {
  areasGestion as obtenerAreasRepositorio,
  obtenerEstadosReclamo,
  obtenerEstadoPorNombre,
  obtenerEstadoPorId,
  crearReclamo,
  actualizarCodigoReclamo,
  guardarImagenesReclamo,
  crearRegistroHistorial,
  obtenerResumenReclamosPorEstado,
  obtenerReclamosAdmin,
  obtenerDetalleReclamoAdmin,
  actualizarEstadoReclamo,
  actualizarAreaReclamo,
  obtenerMisReclamos,
  contarMisReclamos,
} from "../repositories/reclamo.repository.js";

// =====================================================
// UTILIDADES
// =====================================================

function convertirEnteroPositivo(valor, valorPredeterminado) {
  const numero = Number.parseInt(valor, 10);

  if (!Number.isInteger(numero) || numero < 1) {
    return valorPredeterminado;
  }

  return numero;
}

function validarId(valor, nombreCampo = "ID") {
  const id = Number(valor);

  if (!Number.isInteger(id) || id < 1) {
    throw new Error(`${nombreCampo} inválido.`);
  }

  return id;
}

function normalizarTexto(valor) {
  if (typeof valor !== "string") {
    return "";
  }

  return valor.trim();
}

function obtenerTotalPaginas(total, limite) {
  return Math.ceil(total / limite);
}

// =====================================================
// ÁREAS DE GESTIÓN
// =====================================================

export async function areasGestion() {
  return await obtenerAreasRepositorio();
}

// =====================================================
// ESTADOS DE RECLAMO
// =====================================================

export async function listarEstadosReclamo() {
  return await obtenerEstadosReclamo();
}

// =====================================================
// CREAR RECLAMO DE CIUDADANO
// =====================================================

export async function CrearReclamoCiudadano(
  datosReclamo,
  imagenes = [],
  idCiudadano,
) {
  const client = await pool.connect();
  const archivosGuardados = [];

  try {
    await client.query("BEGIN");

    const idCiudadanoValidado = validarId(idCiudadano, "ID del ciudadano");

    const estadoInicial = await obtenerEstadoPorNombre("Nuevo", client);

    if (!estadoInicial) {
      throw new Error('No existe el estado inicial "Nuevo".');
    }

    const reclamo = await crearReclamo(
      {
        ...datosReclamo,
        idCiudadano: idCiudadanoValidado,
      },
      estadoInicial.id_estado,
      client,
    );

    const codigoReclamo = `REC${String(reclamo.id_reclamo).padStart(6, "0")}`;

    const reclamoActualizado = await actualizarCodigoReclamo(
      reclamo.id_reclamo,
      codigoReclamo,
      client,
    );

    // Crear la carpeta si todavía no existe.
    await mkdir(UPLOADS_DIR, { recursive: true });

    const rutasImagenes = [];

    for (const archivo of imagenes) {
      if (!archivo?.buffer || !archivo.mimetype?.startsWith("image/")) {
        throw new Error("Se recibió un archivo de imagen inválido.");
      }

      // No confiar en el nombre original del archivo.
      const extensionesPermitidas = {
        "image/jpeg": ".jpg",
        "image/png": ".png",
        "image/webp": ".webp",
        "image/gif": ".gif",
      };

      const extension = extensionesPermitidas[archivo.mimetype];

      if (!extension) {
        throw new Error("El formato de imagen no está permitido.");
      }

      const nombreArchivo = `${randomUUID()}${extension}`;
      const rutaFisica = path.join(UPLOADS_DIR, nombreArchivo);

      await writeFile(rutaFisica, archivo.buffer, {
        flag: "wx",
      });

      archivosGuardados.push(rutaFisica);

      // Esta es la ruta que se almacenará en PostgreSQL.
      rutasImagenes.push(`/uploads/${nombreArchivo}`);
    }

    // El repositorio recibe strings, no objetos de Multer.
    await guardarImagenesReclamo(reclamo.id_reclamo, rutasImagenes, client);

    await crearRegistroHistorial(
      {
        idReclamo: reclamo.id_reclamo,
        estado: estadoInicial.nombre_estado,
        resolucion: "Reclamo registrado.",
        idEmpleado: null,
      },
      client,
    );

    await client.query("COMMIT");

    return reclamoActualizado;
  } catch (error) {
    await client.query("ROLLBACK");

    // Eliminar archivos si falla el registro del reclamo.
    await Promise.allSettled(archivosGuardados.map((ruta) => unlink(ruta)));

    throw error;
  } finally {
    client.release();
  }
}

// =====================================================
// ADMINISTRACIÓN: RESUMEN PARA LAS TARJETAS
// =====================================================

export async function obtenerResumenAdmin() {
  const estados = await obtenerResumenReclamosPorEstado();

  return estados.map((estado) => ({
    id_estado: estado.id_estado,
    nombre_estado: estado.nombre_estado,
    cantidad: Number(estado.cantidad),
  }));
}

// =====================================================
// ADMINISTRACIÓN: LISTAR RECLAMOS
// =====================================================

export async function listarReclamosAdmin({
  estado = "",
  idEstado = null,
  buscar = "",
  pagina = 1,
  limite = 10,
} = {}) {
  const paginaValidada = convertirEnteroPositivo(pagina, 1);

  const limiteValidado = Math.min(convertirEnteroPositivo(limite, 10), 100);

  const estadoNormalizado = normalizarTexto(estado);
  const busquedaNormalizada = normalizarTexto(buscar);

  let idEstadoValidado = null;

  if (idEstado !== null && idEstado !== undefined && idEstado !== "") {
    idEstadoValidado = validarId(idEstado, "ID del estado");

    const estadoExistente = await obtenerEstadoPorId(idEstadoValidado);

    if (!estadoExistente) {
      throw new Error("El estado indicado no existe.");
    }
  } else if (estadoNormalizado) {
    const estadoExistente = await obtenerEstadoPorNombre(estadoNormalizado);

    if (!estadoExistente) {
      throw new Error("El estado indicado no existe.");
    }

    idEstadoValidado = estadoExistente.id_estado;
  }

  const resultado = await obtenerReclamosAdmin({
    idEstado: idEstadoValidado,
    buscar: busquedaNormalizada,
    pagina: paginaValidada,
    limite: limiteValidado,
  });

  return {
    data: resultado.reclamos,
    paginacion: {
      pagina: resultado.paginacion.pagina,
      limite: resultado.paginacion.limite,
      total: resultado.paginacion.total,
      totalPaginas: resultado.paginacion.totalPaginas,
    },
  };
}

// =====================================================
// ADMINISTRACIÓN: INSPECCIONAR RECLAMO
// =====================================================

export async function obtenerDetalleAdmin(idReclamo) {
  const id = validarId(idReclamo, "ID del reclamo");

  const reclamo = await obtenerDetalleReclamoAdmin(id);

  if (!reclamo) {
    throw new Error("No se encontró el reclamo solicitado.");
  }

  return {
    data: reclamo,
  };
}

// =====================================================
// ADMINISTRACIÓN: CAMBIAR ESTADO
// =====================================================

export async function cambiarEstadoReclamo({
  idReclamo,
  idEstado,
  resolucion = null,
  idEmpleado = null,
}) {
  const idReclamoValidado = validarId(idReclamo, "ID del reclamo");

  const idEstadoValidado = validarId(idEstado, "ID del estado");

  const resolucionNormalizada =
    resolucion === null || resolucion === undefined
      ? null
      : normalizarTexto(resolucion);

  const idEmpleadoValidado =
    idEmpleado === null || idEmpleado === undefined
      ? null
      : validarId(idEmpleado, "ID del empleado");

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Comprobar que exista el reclamo.
    const resultadoReclamo = await client.query(
      `
        SELECT id_reclamo, id_estado
        FROM reclamo
        WHERE id_reclamo = $1
        FOR UPDATE;
      `,
      [idReclamoValidado],
    );

    if (resultadoReclamo.rows.length === 0) {
      throw new Error("No se encontró el reclamo solicitado.");
    }

    // Comprobar que exista el estado de destino.
    const estadoDestino = await obtenerEstadoPorId(idEstadoValidado, client);

    if (!estadoDestino) {
      throw new Error("El estado seleccionado no existe.");
    }

    // Validar el empleado si se recibió uno.
    if (idEmpleadoValidado !== null) {
      const resultadoEmpleado = await client.query(
        `
          SELECT id_empleado
          FROM empleado_municipal
          WHERE id_empleado = $1
            AND estado = TRUE
          LIMIT 1;
        `,
        [idEmpleadoValidado],
      );

      if (resultadoEmpleado.rows.length === 0) {
        throw new Error("El empleado indicado no existe o está inactivo.");
      }
    }

    const estadoActual = resultadoReclamo.rows[0].id_estado;

    // No registrar un movimiento redundante.
    if (Number(estadoActual) === idEstadoValidado) {
      throw new Error("El reclamo ya se encuentra en ese estado.");
    }

    const reclamoActualizado = await actualizarEstadoReclamo(
      idReclamoValidado,
      idEstadoValidado,
      client,
    );

    await crearRegistroHistorial(
      {
        idReclamo: idReclamoValidado,
        estado: estadoDestino.nombre_estado,
        resolucion: resolucionNormalizada,
        idEmpleado: idEmpleadoValidado,
      },
      client,
    );

    await client.query("COMMIT");

    return {
      mensaje: "Estado del reclamo actualizado correctamente.",
      data: reclamoActualizado,
    };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

// =====================================================
// ADMINISTRACIÓN: CAMBIAR ÁREA ASIGNADA
// =====================================================

export async function cambiarAreaReclamo({ idReclamo, idArea }) {
  const idReclamoValidado = validarId(idReclamo, "ID del reclamo");

  const idAreaValidado = validarId(idArea, "ID del área");

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Verificar que exista el reclamo.
    const resultadoReclamo = await client.query(
      `
        SELECT id_reclamo, id_area
        FROM reclamo
        WHERE id_reclamo = $1
        FOR UPDATE;
      `,
      [idReclamoValidado],
    );

    if (resultadoReclamo.rows.length === 0) {
      throw new Error("No se encontró el reclamo solicitado.");
    }

    // Verificar que exista el área.
    const resultadoArea = await client.query(
      `
        SELECT id_area, nombre_area
        FROM area_gestion
        WHERE id_area = $1
        LIMIT 1;
      `,
      [idAreaValidado],
    );

    if (resultadoArea.rows.length === 0) {
      throw new Error("El área seleccionada no existe.");
    }

    if (Number(resultadoReclamo.rows[0].id_area) === idAreaValidado) {
      throw new Error("El reclamo ya está asignado a esa área.");
    }

    const reclamoActualizado = await actualizarAreaReclamo(
      idReclamoValidado,
      idAreaValidado,
      client,
    );

    await client.query("COMMIT");

    return {
      mensaje: "Área del reclamo actualizada correctamente.",
      data: reclamoActualizado,
      area: resultadoArea.rows[0],
    };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

// =====================================================
// CIUDADANO: LISTAR SUS RECLAMOS
// =====================================================

export async function listarReclamosCiudadano({
  idCiudadano,
  estado,
  desde,
  hasta,
  pagina = 1,
  limite = 10,
}) {
  const idCiudadanoValidado = validarId(idCiudadano, "ID del ciudadano");

  const paginaValidada = convertirEnteroPositivo(pagina, 1);

  const limiteValidado = Math.min(convertirEnteroPositivo(limite, 10), 100);

  const estadoNormalizado = normalizarTexto(estado);

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

  const offset = (paginaValidada - 1) * limiteValidado;

  const filtros = {
    idCiudadano: idCiudadanoValidado,
    estado: estadoNormalizado,
    desde,
    hasta,
  };

  const [reclamos, total] = await Promise.all([
    obtenerMisReclamos({
      ...filtros,
      limite: limiteValidado,
      offset,
    }),
    contarMisReclamos(filtros),
  ]);

  return {
    reclamos,
    paginacion: {
      pagina: paginaValidada,
      limite: limiteValidado,
      total,
      totalPaginas: obtenerTotalPaginas(total, limiteValidado),
    },
  };
}

// =====================================================
// VALIDACIÓN DE FECHAS
// =====================================================

export function esFechaValida(fecha) {
  if (typeof fecha !== "string") {
    return false;
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
    return false;
  }

  const [anio, mes, dia] = fecha.split("-").map(Number);

  const fechaObjeto = new Date(Date.UTC(anio, mes - 1, dia));

  return (
    fechaObjeto.getUTCFullYear() === anio &&
    fechaObjeto.getUTCMonth() === mes - 1 &&
    fechaObjeto.getUTCDate() === dia
  );
}
