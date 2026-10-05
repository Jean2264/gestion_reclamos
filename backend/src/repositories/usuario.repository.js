import pool from "../config/database.js";

export async function bucarUsuarioPorEmail(email) {
  const result = await pool.query(
    `
    SELECT
    id_usuario,
    email,
    contrasenia,
    id_rol
    FROM usuario
    WHERE email= $1
    `,
    [email],
  );

  return result.rows[0] ?? null;
}

//Crear usuario
export async function crearUsuario(email, contrasenia, idRol, client = pool) {
  const result = await client.query(
    `
        INSERT INTO usuario(
        email,
        contrasenia,
        id_rol
        )
        VALUES ($1, $2, $3)
        RETURNING id_usuario, email, id_rol
        `,
    [email, contrasenia, idRol],
  );

  return result.rows[0];
}

export async function buscarUsuarioPorId(idUsuario) {
  const result = await pool.query(
    `
      SELECT
        id_usuario,
        email,
        id_rol
      FROM usuario
      WHERE id_usuario = $1
    `,
    [idUsuario],
  );

  return result.rows[0] ?? null;
}
