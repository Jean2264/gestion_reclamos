import pool from "../config/database.js";

//mostrar areas de gestion

export async function areasGestion() {
  const result = pool.query(`
        SELECT id_area, nombre_area
        FROM area_gestion;
        `);

  return (await result).rows;
}

export async function obtenerEstadoPorNombre(nombreEstado, client = pool) {
  const result = await client.query(
    `
        SELECT id_estado, nombre_estado
        FROM estado_reclamo
        WHERE LOWER(nombre_estado) = LOWER($1)
        LIMIT 1;
        `,
    [nombreEstado],
  );

  return result.rows[0] ?? null;
}

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

  const result = await client.query(
    `
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
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        RETURNING *;
        `,
    [
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
    ],
  );

  return result.rows[0];
}

export async function actualizarCodigoReclamo(
  idReclamo,
  codigoReclamo,
  client = pool,
) {
  const result = await client.query(
    `UPDATE reclamo
     SET codigo_reclamo = $1
     WHERE id_reclamo = $2
     RETURNING *;`,
    [codigoReclamo, idReclamo],
  );

  return result.rows[0] ?? null;
}

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
    condiciones.push(`e.nombre_estado = $${valores.length}`);
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
    ORDER BY r.fecha_alta DESC, r.id_reclamo DESC
    LIMIT $${parametroLimite}
    OFFSET $${parametroOffset};
  `;

  const resultado = await pool.query(query, valores);

  return resultado.rows;
}

export async function contarMisReclamos({ idCiudadano, estado, desde, hasta }) {
  const valores = [idCiudadano];
  const condiciones = ["r.id_ciudadano = $1"];

  if (estado) {
    valores.push(estado);
    condiciones.push(`e.nombre_estado = $${valores.length}`);
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
    SELECT COUNT(*)::int AS total
    FROM reclamo r
    INNER JOIN estado_reclamo e
      ON e.id_estado = r.id_estado
    WHERE ${condiciones.join(" AND ")};
  `;

  const resultado = await pool.query(query, valores);

  return resultado.rows[0].total;
}
