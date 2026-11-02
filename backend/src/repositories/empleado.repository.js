import pool from "../config/database.js";

export async function buscarEmpleadoPorDni(dni) {
  const result = await pool.query(
    `SELECT
        em.id_empleado,
        em.dni,
        em.nombre,
        em.apellido,
        
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
        id_usuario,
        dni,
        nombre,
        apellido
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

// Actualizar datos personales del empleado.
export async function actualizarEmpleado(idEmpleado, datosEmpleado, client) {
  const { nombre, apellido, telefono, calle, numero, localidad, codigoPostal } =
    datosEmpleado;

  const result = await client.query(
    `
      UPDATE empleado_municipal
      SET
        nombre = $1,
        apellido = $2,
        telefono = $3,
        calle = $4,
        numero = $5,
        localidad = $6,
        codigo_postal = $7
      WHERE id_empleado = $8
        AND estado = TRUE
      RETURNING
        id_empleado,
        id_usuario,
        dni,
        nombre,
        apellido,
        telefono,
        calle,
        numero,
        localidad,
        codigo_postal,
        estado
    `,
    [
      nombre,
      apellido,
      telefono,
      calle,
      numero,
      localidad,
      codigoPostal,
      idEmpleado,
    ],
  );

  return result.rows[0] ?? null;
}

// Actualizar email y rol del usuario asociado al empleado.
export async function actualizarUsuarioEmpleado(
  idUsuario,
  { email, idRol },
  client,
) {
  const result = await client.query(
    `
      UPDATE usuario
      SET
        email = $1,
        id_rol = $2
      WHERE id_usuario = $3
      RETURNING
        id_usuario,
        email,
        id_rol
    `,
    [email, idRol, idUsuario],
  );

  return result.rows[0] ?? null;
}

// Verificar si otro usuario ya tiene registrado ese email.
export async function buscarEmailDeOtroUsuario(
  email,
  idUsuario,
  client = pool,
) {
  const result = await client.query(
    `
      SELECT id_usuario
      FROM usuario
      WHERE LOWER(email) = LOWER($1)
        AND id_usuario <> $2
      LIMIT 1
    `,
    [email, idUsuario],
  );

  return result.rows[0] ?? null;
}

// Desactivación lógica del empleado.
export async function desactivarEmpleado(idEmpleado) {
  const result = await pool.query(
    `
      UPDATE empleado_municipal
      SET estado = FALSE
      WHERE id_empleado = $1
        AND estado = TRUE
      RETURNING id_empleado, dni, estado
    `,
    [idEmpleado],
  );

  return result.rows[0] ?? null;
}

// Obtener el perfil del empleado a partir del usuario autenticado.
export async function obtenerPerfilPorIdUsuario(idUsuario, client = pool) {
  const resultado = await client.query(
    `
      SELECT
        e.id_empleado,
        e.id_usuario,
        e.nombre,
        e.apellido,
        e.dni,
        e.telefono,
        e.calle,
        e.numero,
        e.localidad,
        e.codigo_postal,
        u.email,
        u.id_rol,
        r.nombre_rol
      FROM empleado_municipal e
      INNER JOIN usuario u
        ON u.id_usuario = e.id_usuario
      INNER JOIN rol_usuario r
        ON r.id_rol = u.id_rol
      WHERE e.id_usuario = $1
        AND e.estado = TRUE
      LIMIT 1
    `,
    [idUsuario],
  );

  return resultado.rows[0] ?? null;
}

// Actualizar los datos personales y el domicilio del empleado.
export async function actualizarPerfilPorIdUsuario(idUsuario, datos, client) {
  const resultado = await client.query(
    `
      UPDATE empleado_municipal
      SET
        nombre = $1,
        apellido = $2,
        telefono = $3,
        calle = $4,
        numero = $5,
        localidad = $6,
        codigo_postal = $7
      WHERE id_usuario = $8
        AND estado = TRUE
      RETURNING
        id_empleado,
        id_usuario,
        nombre,
        apellido,
        dni,
        telefono,
        calle,
        numero,
        localidad,
        codigo_postal
    `,
    [
      datos.nombre,
      datos.apellido,
      datos.telefono,
      datos.calle,
      datos.numero,
      datos.localidad,
      datos.codigoPostal,
      idUsuario,
    ],
  );

  return resultado.rows[0] ?? null;
}

// Actualizar exclusivamente el correo del usuario.
export async function actualizarEmailUsuario(idUsuario, email, client) {
  const resultado = await client.query(
    `
      UPDATE usuario
      SET email = $1
      WHERE id_usuario = $2
      RETURNING id_usuario, email, id_rol
    `,
    [email, idUsuario],
  );

  return resultado.rows[0] ?? null;
}
