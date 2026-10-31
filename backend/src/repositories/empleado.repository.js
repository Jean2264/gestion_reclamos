import pool from "../config/database.js";

export async function buscarEmpleadoPorDni(dni) {
  const result = await pool.query(
    `SELECT
        em.id_empleado,
        em.dni,
        
        u.id_usuario,
        u.email,
        u.contrasenia,
        u.id_rol,
        r.nombre_rol
     FROM empleado_municipal em
     INNER JOIN usuario u
        ON u.id_usuario = em.id_usuario
     INNER JOIN rol_usuario r
        ON r.id_rol = u.id_rol
     WHERE em.dni = $1
     AND em.estado= TRUE`,
    [dni],
  );

  return result.rows[0] ?? null;
}

export async function buscarEmpleadoPorUsuarioId(idUsuario) {
  const result = await pool.query(
    `
      SELECT
        id_empleado,
        dni
      FROM empleado_municipal
      WHERE id_usuario = $1
        AND estado = TRUE
    `,
    [idUsuario],
  );

  return result.rows[0] ?? null;
}

export async function buscarEmpleadoPorEmail(email) {
  const result = await pool.query(
    `
      SELECT
        em.id_empleado,
        em.dni,
        u.id_usuario,
        u.email,
        u.id_rol,
        r.nombre_rol
      FROM empleado_municipal em
      INNER JOIN usuario u
        ON u.id_usuario = em.id_usuario
      INNER JOIN rol_usuario r
        ON r.id_rol = u.id_rol
      WHERE LOWER(u.email) = LOWER($1)
        AND em.estado = TRUE
    `,
    [email],
  );

  return result.rows[0] ?? null;
}

// Crear empleado
export async function crearEmpleado(datosEmpleado, client = pool) {
  const {
    nombre,
    apellido,
    dni,
    telefono,
    calle,
    numero,
    localidad,
    codigoPostal,
    idUsuario,
  } = datosEmpleado;

  const result = await client.query(
    `
      INSERT INTO empleado_municipal (
        nombre,
        apellido,
        dni,
        telefono,
        calle,
        numero,
        localidad,
        codigo_postal,
        id_usuario
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING id_empleado, id_usuario, dni
    `,
    [
      nombre,
      apellido,
      dni,
      telefono,
      calle,
      numero,
      localidad,
      codigoPostal,
      idUsuario,
    ],
  );

  return result.rows[0];
}

export async function getAllEmpleados(search = "", page = 1, limit = 20) {
  const offset = (page - 1) * limit;
  const searchValue = `%${search}%`;

  const query = `
    SELECT
      e.id_empleado,
      e.dni,
      e.nombre,
      e.apellido,
      e.telefono,
      u.id_usuario,
      u.email,
      r.nombre_rol

    FROM empleado_municipal e

    LEFT JOIN usuario u
      ON u.id_usuario = e.id_usuario

    LEFT JOIN rol_usuario r
      ON r.id_rol = u.id_rol

    WHERE e.estado = TRUE
      AND (
        e.dni ILIKE $1
        OR e.nombre ILIKE $1
        OR e.apellido ILIKE $1
        OR u.email ILIKE $1
        OR r.nombre_rol ILIKE $1
      )

    ORDER BY e.id_empleado ASC
    LIMIT $2
    OFFSET $3;
  `;

  const countQuery = `
    SELECT COUNT(*) AS total

    FROM empleado_municipal e

    LEFT JOIN usuario u
      ON u.id_usuario = e.id_usuario

    LEFT JOIN rol_usuario r
      ON r.id_rol = u.id_rol

    WHERE e.estado = TRUE
      AND (
        e.dni ILIKE $1
        OR e.nombre ILIKE $1
        OR e.apellido ILIKE $1
        OR u.email ILIKE $1
        OR r.nombre_rol ILIKE $1
      );
  `;

  const [empleadoResult, countResult] = await Promise.all([
    pool.query(query, [searchValue, limit, offset]),
    pool.query(countQuery, [searchValue]),
  ]);

  const totalRecords = Number(countResult.rows[0].total);

  return {
    empleados: empleadoResult.rows,
    totalRecords,
    page,
    limit,
    totalPages: Math.ceil(totalRecords / limit),
  };
}

export async function fetchEmpleadoById(id) {
  const query = `
    SELECT
      e.id_empleado,
      e.dni,
      e.nombre,
      e.apellido,
      e.telefono,
      e.calle,
      e.numero,
      e.localidad,
      e.codigo_postal,
      e.estado,

      u.id_usuario,
      u.email,
      u.id_rol,
      r.nombre_rol

    FROM empleado_municipal e

    LEFT JOIN usuario u
      ON u.id_usuario = e.id_usuario

    LEFT JOIN rol_usuario r
      ON r.id_rol = u.id_rol

    WHERE e.id_empleado = $1;
  `;

  const result = await pool.query(query, [id]);

  if (result.rows.length === 0) {
    return null;
  }

  return result.rows[0];
}
