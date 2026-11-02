import pool from "../config/database.js";

export async function bucarCiudadanoPorDni(dni) {
  const result = await pool.query(
    `
        SELECT 
        id_ciudadano,
        id_usuario,
        dni
        FROM ciudadano
        WHERE dni=$1
        AND estado= TRUE
        `,
    [dni],
  );

  return result.rows[0] ?? null;
}

export async function getAllCiudadanos(search = "", page = 1, limit = 20) {
  const offset = (page - 1) * limit;
  const searchValue = `%${search}%`;
  const filtro = `
    c.estado = TRUE
    AND (
      c.dni ILIKE $1
      OR c.nombre ILIKE $1
      OR c.apellido ILIKE $1
    )
  `;

  const [ciudadanosResult, countResult] = await Promise.all([
    pool.query(
      `
        SELECT
          c.id_ciudadano,
          c.nombre,
          c.apellido,
          c.dni,
          u.email
        FROM ciudadano c
        LEFT JOIN usuario u ON u.id_usuario = c.id_usuario
        WHERE ${filtro}
        ORDER BY c.id_ciudadano DESC
        LIMIT $2
        OFFSET $3
      `,
      [searchValue, limit, offset],
    ),
    pool.query(
      `
        SELECT COUNT(*) AS total
        FROM ciudadano c
        WHERE ${filtro}
      `,
      [searchValue],
    ),
  ]);

  return {
    ciudadanos: ciudadanosResult.rows,
    totalRecords: Number(countResult.rows[0].total),
  };
}

export async function fetchCiudadanoById(idCiudadano) {
  const result = await pool.query(
    `
      SELECT
        c.id_ciudadano,
        c.id_usuario,
        c.nombre,
        c.apellido,
        c.dni,
        c.telefono,
        c.fecha_nacimiento,
        c.calle,
        c.numero,
        c.localidad,
        c.codigo_postal,
        u.email
      FROM ciudadano c
      LEFT JOIN usuario u ON u.id_usuario = c.id_usuario
      WHERE c.id_ciudadano = $1
        AND c.estado = TRUE
    `,
    [idCiudadano],
  );

  return result.rows[0] ?? null;
}

export async function crearCiudadano(datosCiudadano, client = pool) {
  const {
    nombre,
    apellido,
    dni,
    telefono,
    fechaNacimiento,
    calle,
    numero,
    localidad,
    codigoPostal,
    idUsuario,
  } = datosCiudadano;

  const result = await client.query(
    `
      INSERT INTO ciudadano (
        nombre,
        apellido,
        dni,
        telefono,
        fecha_nacimiento,
        calle,
        numero,
        localidad,
        codigo_postal,
        id_usuario
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING id_ciudadano, id_usuario
    `,
    [
      nombre,
      apellido,
      dni,
      telefono,
      fechaNacimiento,
      calle,
      numero,
      localidad,
      codigoPostal,
      idUsuario,
    ],
  );

  return result.rows[0];
}

//actualizar perfil
export async function actualizarDatosCiudadano(
  idCiudadano,
  datos,
  client = pool,
) {
  const {
    nombre,
    apellido,
    telefono,
    fechaNacimiento,
    calle,
    numero,
    localidad,
    codigoPostal,
  } = datos;

  const resultado = await client.query(
    `UPDATE ciudadano
     SET nombre = $1,
         apellido = $2,
         telefono = $3,
         fecha_nacimiento = $4,
         calle = $5,
         numero = $6,
         localidad = $7,
         codigo_postal = $8
     WHERE id_ciudadano = $9
     RETURNING id_ciudadano, nombre, apellido, dni,
               telefono, fecha_nacimiento, calle,
               numero, localidad, codigo_postal`,
    [
      nombre,
      apellido,
      telefono,
      fechaNacimiento,
      calle,
      numero,
      localidad,
      codigoPostal,
      idCiudadano,
    ],
  );

  return resultado.rows[0] ?? null;
}

export async function buscarCiudadanoPorIdUsuario(idUsuario, client = pool) {
  const result = await client.query(
    `
        SELECT id_ciudadano,
        id_usuario,
        nombre,
        apellido,
        dni
        FROM ciudadano
        WHERE id_usuario= $1
        `,
    [idUsuario],
  );

  return result.rows[0] ?? null;
}

export async function buscarCiudadanoPorId(idCiudadano) {
  const result = await pool.query(
    `
      SELECT
        id_ciudadano,
        id_usuario,
        nombre,
        apellido
      FROM ciudadano
      WHERE id_ciudadano = $1
    `,
    [idCiudadano],
  );

  return result.rows[0] ?? null;
}

export async function miPerfil(idCiudadano) {
  const resultado = await pool.query(
    `
      SELECT
      c.id_ciudadano,
      c.nombre,
      c.apellido,
      c.dni,
      c.telefono,
      c.fecha_nacimiento,
      c.calle,
      c.numero,
      c.localidad,
      c.codigo_postal,
      u.email
      FROM ciudadano c 
      INNER JOIN usuario u ON
      c.id_usuario = u.id_usuario WHERE c.id_ciudadano= $1
    `,
    [idCiudadano],
  );
  return resultado.rows[0] ?? null;
}
