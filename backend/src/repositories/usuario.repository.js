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
