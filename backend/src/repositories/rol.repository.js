import pool from "../config/database.js";

export async function buscarRolPorNombre(nombreRol) {
  const result = await pool.query(
    `
      SELECT
        id_rol,
        nombre_rol,
        descripcion
      FROM rol_usuario
      WHERE nombre_rol = $1
    `,
    [nombreRol],
  );

  return result.rows[0] ?? null;
}
