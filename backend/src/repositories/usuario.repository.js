import pool from "../config/database.js";

export async function buscarUsuarioPorEmail(email, client = pool) {
  const result = await client.query(
    `
      SELECT
        id_usuario,
        email,
        contrasenia,
        id_rol
      FROM usuario
      WHERE LOWER(email) = LOWER($1)
    `,
    [email],
  );

  return result.rows[0] ?? null;
}

export async function buscarUsuarioPublicoPorEmail(email) {
  const result = await pool.query(
    `
      SELECT id_usuario, email, id_rol
      FROM usuario
      WHERE email = $1
    `,
    [email],
  );

  return result.rows[0] ?? null;
}

// Crear usuario
export async function crearUsuario(email, contrasenia, idRol, client = pool) {
  const result = await client.query(
    `
      INSERT INTO usuario (
        email,
        contrasenia,
        id_rol,
        debe_cambiar_contrasenia
      )
      VALUES ($1, $2, $3, TRUE)
      RETURNING
        id_usuario,
        email,
        id_rol,
        debe_cambiar_contrasenia
    `,
    [email, contrasenia, idRol],
  );

  return result.rows[0];
}

//actualizar email
export async function actualizarEmailUsuario(idUsuario, email, client = pool) {
  const resultado = await client.query(
    `
    UPDATE usuario
    SET email= $1
    WHERE id_usuario= $2
    RETURNING id_usuario, email, id_rol
    `,
    [email, idUsuario],
  );

  return resultado.rows[0] ?? null;
}

export async function actualizarPasswordUsuario(idUsuario, password) {
  const result = await pool.query(
    `
    UPDATE usuario
    SET contrasenia= $1
    WHERE id_usuario= $2
    RETURNING id_usuario, id_rol
    `,
    [password, idUsuario],
  );

  return result.rows[0] ?? null;
}

export async function actualizarPasswordUsuarioPorEmail(email, password) {
  const result = await pool.query(
    `
    UPDATE usuario
    SET contrasenia = $1
    WHERE email = $2
    RETURNING id_usuario, id_rol
    `,
    [password, email],
  );

  return result.rows[0] ?? null;
}

export async function buscarUsuarioPorId(idUsuario) {
  const result = await pool.query(
    `
      SELECT
        u.id_usuario,
        u.email,
        u.id_rol,
        r.nombre_rol
      FROM usuario u
      INNER JOIN rol_usuario r
        ON r.id_rol = u.id_rol
      WHERE u.id_usuario = $1
    `,
    [idUsuario],
  );

  return result.rows[0] ?? null;
}

export async function actualizarEstadoCambioContrasenia(
  idUsuario,
  debeCambiar,
  client = pool,
) {
  const result = await client.query(
    `
      UPDATE usuario
      SET debe_cambiar_contrasenia = $1
      WHERE id_usuario = $2
      RETURNING id_usuario, debe_cambiar_contrasenia
    `,
    [debeCambiar, idUsuario],
  );

  return result.rows[0] ?? null;
}
