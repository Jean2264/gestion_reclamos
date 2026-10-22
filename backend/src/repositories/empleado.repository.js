
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
    [dni]
  );

  return result.rows[0] ?? null;
}
