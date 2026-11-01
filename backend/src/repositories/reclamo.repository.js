import pool from "../config/database.js";

// =====================================================
// ÁREAS DE GESTIÓN
// =====================================================

export async function areasGestion() {
  const query = `
    SELECT
      id_area,
      nombre_area,
      descripcion
    FROM area_gestion
    ORDER BY nombre_area ASC;
  `;

  const resultado = await pool.query(query);

  return resultado.rows;
}

// =====================================================
// ESTADOS DE RECLAMO
// =====================================================

export async function obtenerEstadosReclamo() {
  const query = `
    SELECT
      id_estado,
      nombre_estado,
      descripcion
    FROM estado_reclamo
    ORDER BY id_estado ASC;
  `;

  const resultado = await pool.query(query);

  return resultado.rows;
}

export async function obtenerEstadoPorNombre(nombreEstado, client = pool) {
  const query = `
    SELECT
      id_estado,
      nombre_estado,
      descripcion
    FROM estado_reclamo
    WHERE LOWER(nombre_estado) = LOWER($1)
    LIMIT 1;
  `;

  const resultado = await client.query(query, [nombreEstado]);

  return resultado.rows[0] ?? null;
}

export async function obtenerEstadoPorId(idEstado, client = pool) {
  const query = `
    SELECT
      id_estado,
      nombre_estado,
      descripcion
    FROM estado_reclamo
    WHERE id_estado = $1
    LIMIT 1;
  `;

  const resultado = await client.query(query, [idEstado]);

  return resultado.rows[0] ?? null;
}

// =====================================================
// CREAR RECLAMO
// =====================================================

export async function crearReclamo(datosReclamo, idEstado, client = pool) {
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
    idCiudadano,
    idArea,
  } = datosReclamo;

  const query = `
    INSERT INTO reclamo (
      numero_partida,
      calle,
      calle_uno,
      calle_dos,
      altura,
      localidad,
      detalle_reclamo,
      estado_tributario,
      codigo_postal,
      id_ciudadano,
      id_area,
      id_estado
    )
    VALUES (
      $1, $2, $3, $4, $5, $6,
      $7, $8, $9, $10, $11, $12
    )
    RETURNING *;
  `;

  const valores = [
    numeroPartida,
    calle,
    calleUno,
    calleDos,
    altura,
    localidad,
    detalle,
    estadoTributario,
    codigoPostal,
    idCiudadano,
    idArea,
    idEstado,
  ];

  const resultado = await client.query(query, valores);

  return resultado.rows[0];
}

// =====================================================
// ACTUALIZAR CÓDIGO DEL RECLAMO
// =====================================================

export async function actualizarCodigoReclamo(
  idReclamo,
  codigoReclamo,
  client = pool,
) {
  const query = `
    UPDATE reclamo
    SET codigo_reclamo = $1
    WHERE id_reclamo = $2
    RETURNING *;
  `;

  const resultado = await client.query(query, [codigoReclamo, idReclamo]);

  return resultado.rows[0] ?? null;
}

// =====================================================
// GUARDAR IMÁGENES DE UN RECLAMO
// =====================================================

export async function guardarImagenesReclamo(
  idReclamo,
  imagenes,
  client = pool,
) {
  if (!imagenes || imagenes.length === 0) {
    return [];
  }

  const imagenesGuardadas = [];

  for (const imagenUrl of imagenes) {
    const query = `
      INSERT INTO imagen_reclamo (
        imagen_url,
        id_reclamo
      )
      VALUES ($1, $2)
      RETURNING *;
    `;

    const resultado = await client.query(query, [imagenUrl, idReclamo]);

    imagenesGuardadas.push(resultado.rows[0]);
  }

  return imagenesGuardadas;
}

// =====================================================
// HISTORIAL DE RECLAMOS
// =====================================================

export async function crearRegistroHistorial(
  { idReclamo, estado, resolucion = null, idEmpleado = null },
  client = pool,
) {
  const query = `
    INSERT INTO historico_reclamo (
      estado,
      resolucion,
      id_reclamo,
      id_empleado
    )
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `;

  const valores = [estado, resolucion, idReclamo, idEmpleado];

  const resultado = await client.query(query, valores);

  return resultado.rows[0];
}

// =====================================================
// ADMINISTRACIÓN: RESUMEN DE RECLAMOS POR ESTADO
// =====================================================

export async function obtenerResumenReclamosPorEstado() {
  const query = `
    SELECT
      e.id_estado,
      e.nombre_estado,
      COUNT(r.id_reclamo)::INTEGER AS cantidad
    FROM estado_reclamo e
    LEFT JOIN reclamo r
      ON r.id_estado = e.id_estado
    GROUP BY
      e.id_estado,
      e.nombre_estado
    ORDER BY e.id_estado ASC;
  `;

  const resultado = await pool.query(query);

  return resultado.rows;
}

// =====================================================
// ADMINISTRACIÓN: LISTAR TODOS LOS RECLAMOS
// Con filtros, búsqueda y paginación
// =====================================================

export async function obtenerReclamosAdmin({
  estado = "",
  idEstado = null,
  buscar = "",
  pagina = 1,
  limite = 10,
}) {
  const valores = [];
  const condiciones = ["LOWER(TRIM(e.nombre_estado)) <> 'finalizado'"];

  // Filtro por identificador del estado.
  if (idEstado !== null && idEstado !== undefined && idEstado !== "") {
    valores.push(idEstado);
    condiciones.push(`r.id_estado = $${valores.length}`);
  } else if (estado) {
    // Alternativa: filtrar por nombre del estado.
    valores.push(estado);
    condiciones.push(`LOWER(e.nombre_estado) = LOWER($${valores.length})`);
  }

  // Búsqueda por código, asunto o nombre del ciudadano.
  if (buscar.trim()) {
    valores.push(`%${buscar.trim()}%`);

    const parametroBusqueda = `$${valores.length}`;

    condiciones.push(`
      (
        r.codigo_reclamo ILIKE ${parametroBusqueda}
        OR r.detalle_reclamo ILIKE ${parametroBusqueda}
        OR c.nombre ILIKE ${parametroBusqueda}
        OR c.apellido ILIKE ${parametroBusqueda}
        OR CONCAT(c.nombre, ' ', c.apellido)
          ILIKE ${parametroBusqueda}
      )
    `);
  }

  const whereSQL = condiciones.length
    ? `WHERE ${condiciones.join(" AND ")}`
    : "";

  const paginaSegura = Math.max(1, Number.parseInt(pagina, 10) || 1);

  const limiteSeguro = Math.min(
    100,
    Math.max(1, Number.parseInt(limite, 10) || 10),
  );

  const offset = (paginaSegura - 1) * limiteSeguro;

  // Total de registros que coinciden con los filtros.
  const queryTotal = `
    SELECT COUNT(*)::INTEGER AS total
    FROM reclamo r
    INNER JOIN ciudadano c
      ON c.id_ciudadano = r.id_ciudadano
    LEFT JOIN estado_reclamo e
      ON e.id_estado = r.id_estado
    LEFT JOIN area_gestion a
      ON a.id_area = r.id_area
    ${whereSQL};
  `;

  const resultadoTotal = await pool.query(queryTotal, valores);

  const total = resultadoTotal.rows[0].total;

  // Reclamos de la página solicitada.
  const valoresListado = [...valores];

  valoresListado.push(limiteSeguro);
  const parametroLimite = valoresListado.length;

  valoresListado.push(offset);
  const parametroOffset = valoresListado.length;

  const queryListado = `
    SELECT
      r.id_reclamo,
      r.codigo_reclamo,
      r.fecha_alta,
      r.detalle_reclamo,
      r.calle,
      r.calle_uno,
      r.calle_dos,
      r.altura,
      r.localidad,
      r.codigo_postal,
      r.numero_partida,
      r.estado_tributario,

      c.id_ciudadano,
      c.nombre AS ciudadano_nombre,
      c.apellido AS ciudadano_apellido,
      CONCAT(c.nombre, ' ', c.apellido) AS ciudadano,
      c.dni AS ciudadano_dni,
      c.telefono AS ciudadano_telefono,

      e.id_estado,
      e.nombre_estado,

      a.id_area,
      a.nombre_area

    FROM reclamo r

    INNER JOIN ciudadano c
      ON c.id_ciudadano = r.id_ciudadano

    LEFT JOIN estado_reclamo e
      ON e.id_estado = r.id_estado

    LEFT JOIN area_gestion a
      ON a.id_area = r.id_area

    ${whereSQL}

    ORDER BY
      r.fecha_alta DESC,
      r.id_reclamo DESC

    LIMIT $${parametroLimite}
    OFFSET $${parametroOffset};
  `;

  const resultadoListado = await pool.query(queryListado, valoresListado);

  const totalPaginas = Math.ceil(total / limiteSeguro);

  return {
    reclamos: resultadoListado.rows,
    paginacion: {
      pagina: paginaSegura,
      limite: limiteSeguro,
      total,
      totalPaginas,
    },
  };
}

// =====================================================
// ADMINISTRACIÓN: OBTENER UN RECLAMO POR ID
// Incluye ciudadano, área, estado, imágenes e historial
// =====================================================

export async function obtenerDetalleReclamoAdmin(idReclamo) {
  const queryReclamo = `
    SELECT
      r.id_reclamo,
      r.codigo_reclamo,
      r.fecha_alta,
      r.detalle_reclamo,
      r.calle,
      r.calle_uno,
      r.calle_dos,
      r.altura,
      r.localidad,
      r.codigo_postal,
      r.numero_partida,
      r.estado_tributario,

      c.id_ciudadano,
      c.nombre AS ciudadano_nombre,
      c.apellido AS ciudadano_apellido,
      CONCAT(c.nombre, ' ', c.apellido) AS ciudadano,
      c.dni AS ciudadano_dni,
      c.telefono AS ciudadano_telefono,
      c.fecha_nacimiento AS ciudadano_fecha_nacimiento,
      c.calle AS ciudadano_calle,
      c.numero AS ciudadano_numero,
      c.localidad AS ciudadano_localidad,
      c.codigo_postal AS ciudadano_codigo_postal,
      c.estado AS ciudadano_activo,

      e.id_estado,
      e.nombre_estado,

      a.id_area,
      a.nombre_area,
      a.descripcion AS descripcion_area

    FROM reclamo r

    INNER JOIN ciudadano c
      ON c.id_ciudadano = r.id_ciudadano

    LEFT JOIN estado_reclamo e
      ON e.id_estado = r.id_estado

    LEFT JOIN area_gestion a
      ON a.id_area = r.id_area

    WHERE r.id_reclamo = $1
    LIMIT 1;
  `;

  const resultadoReclamo = await pool.query(queryReclamo, [idReclamo]);

  if (resultadoReclamo.rows.length === 0) {
    return null;
  }

  const reclamo = resultadoReclamo.rows[0];

  // Imágenes asociadas al reclamo.
  const queryImagenes = `
    SELECT
      id_imagen,
      imagen_url
    FROM imagen_reclamo
    WHERE id_reclamo = $1
    ORDER BY id_imagen ASC;
  `;

  const resultadoImagenes = await pool.query(queryImagenes, [idReclamo]);

  // Historial de cambios y resoluciones.
  const queryHistorial = `
    SELECT
      h.id_historial,
      h.fecha_alta,
      h.estado,
      h.resolucion,
      h.id_empleado,
      CONCAT(em.nombre, ' ', em.apellido) AS empleado

    FROM historico_reclamo h

    LEFT JOIN empleado_municipal em
      ON em.id_empleado = h.id_empleado

    WHERE h.id_reclamo = $1

    ORDER BY
      h.fecha_alta DESC,
      h.id_historial DESC;
  `;

  const resultadoHistorial = await pool.query(queryHistorial, [idReclamo]);

  return {
    ...reclamo,
    imagenes: resultadoImagenes.rows,
    historial: resultadoHistorial.rows,
  };
}

// =====================================================
// ADMINISTRACIÓN: ACTUALIZAR ESTADO
// Recibe un cliente para permitir el uso de transacciones.
// =====================================================

export async function actualizarEstadoReclamo(
  idReclamo,
  idEstado,
  client = pool,
) {
  const query = `
    UPDATE reclamo
    SET id_estado = $1
    WHERE id_reclamo = $2
    RETURNING *;
  `;

  const resultado = await client.query(query, [idEstado, idReclamo]);

  return resultado.rows[0] ?? null;
}

// =====================================================
// ADMINISTRACIÓN: ACTUALIZAR ÁREA ASIGNADA
// =====================================================

export async function actualizarAreaReclamo(idReclamo, idArea, client = pool) {
  const query = `
    UPDATE reclamo
    SET id_area = $1
    WHERE id_reclamo = $2
    RETURNING *;
  `;

  const resultado = await client.query(query, [idArea, idReclamo]);

  return resultado.rows[0] ?? null;
}

// =====================================================
// CIUDADANO: LISTAR SUS RECLAMOS
// =====================================================

export async function obtenerMisReclamos({
  idCiudadano,
  estado,
  desde,
  hasta,
  limite,
  offset,
}) {
  const valores = [idCiudadano];

  const condiciones = ["r.id_ciudadano = $1"];

  if (estado) {
    valores.push(estado);

    condiciones.push(`LOWER(e.nombre_estado) = LOWER($${valores.length})`);
  }

  if (desde) {
    valores.push(desde);

    condiciones.push(`r.fecha_alta >= $${valores.length}::date`);
  }

  if (hasta) {
    valores.push(hasta);

    condiciones.push(
      `r.fecha_alta < ($${valores.length}::date + INTERVAL '1 day')`,
    );
  }

  valores.push(limite);
  const parametroLimite = valores.length;

  valores.push(offset);
  const parametroOffset = valores.length;

  const query = `
    SELECT
      r.id_reclamo,
      r.fecha_alta,
      r.codigo_reclamo,
      a.nombre_area,
      r.numero_partida,
      e.nombre_estado

    FROM reclamo r

    INNER JOIN estado_reclamo e
      ON e.id_estado = r.id_estado

    LEFT JOIN area_gestion a
      ON a.id_area = r.id_area

    WHERE ${condiciones.join(" AND ")}

    ORDER BY
      r.fecha_alta DESC,
      r.id_reclamo DESC

    LIMIT $${parametroLimite}
    OFFSET $${parametroOffset};
  `;

  const resultado = await pool.query(query, valores);

  return resultado.rows;
}

// =====================================================
// CIUDADANO: CONTAR SUS RECLAMOS
// =====================================================

export async function contarMisReclamos({ idCiudadano, estado, desde, hasta }) {
  const valores = [idCiudadano];

  const condiciones = ["r.id_ciudadano = $1"];

  if (estado) {
    valores.push(estado);

    condiciones.push(`LOWER(e.nombre_estado) = LOWER($${valores.length})`);
  }

  if (desde) {
    valores.push(desde);

    condiciones.push(`r.fecha_alta >= $${valores.length}::date`);
  }

  if (hasta) {
    valores.push(hasta);

    condiciones.push(
      `r.fecha_alta < ($${valores.length}::date + INTERVAL '1 day')`,
    );
  }

  const query = `
    SELECT COUNT(*)::INTEGER AS total

    FROM reclamo r

    INNER JOIN estado_reclamo e
      ON e.id_estado = r.id_estado

    WHERE ${condiciones.join(" AND ")};
  `;

  const resultado = await pool.query(query, valores);

  return resultado.rows[0].total;
}
