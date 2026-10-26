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
