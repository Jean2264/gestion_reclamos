import bcrypt from "bcrypt";
import pool from "../src/config/database.js";

async function crearAdminInicial() {
  // Cambiá estos datos antes de ejecutar el script.
  const admin = {
    nombre: "Administrador",
    apellido: "Inicial",
    dni: "12345678",
    telefono: "0000000000",
    calle: "Municipalidad",
    numero: "1",
    localidad: "Localidad",
    codigoPostal: "0000",
    email: "admin@municipalidad.local",
    contrasenia: "CambiarEstaClave123!",
  };

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Comprobar que el rol exista.
    const rolResult = await client.query(
      `SELECT id_rol
       FROM rol_usuario
       WHERE nombre_rol = 'Administrador'`,
    );

    if (!rolResult.rows[0]) {
      throw new Error("No existe el rol Administrador.");
    }

    // Evitar duplicados por email o DNI.
    const existente = await client.query(
      `SELECT 1
       FROM usuario u
       LEFT JOIN empleado_municipal em
         ON em.id_usuario = u.id_usuario
       WHERE u.email = $1 OR em.dni = $2`,
      [admin.email, admin.dni],
    );

    if (existente.rowCount > 0) {
      throw new Error("Ya existe un usuario con ese email o DNI.");
    }

    const hash = await bcrypt.hash(admin.contrasenia, 10);

    // Crear la cuenta.
    const usuarioResult = await client.query(
      `INSERT INTO usuario (email, contrasenia, id_rol)
       VALUES ($1, $2, $3)
       RETURNING id_usuario`,
      [admin.email, hash, rolResult.rows[0].id_rol],
    );

    const idUsuario = usuarioResult.rows[0].id_usuario;

    // Crear el registro municipal asociado.
    await client.query(
      `INSERT INTO empleado_municipal (
         nombre, apellido, dni, telefono,
         calle, numero, localidad, codigo_postal, id_usuario
       )
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8,  $9)`,
      [
        admin.nombre,
        admin.apellido,
        admin.dni,
        admin.telefono,
        admin.calle,
        admin.numero,
        admin.localidad,
        admin.codigoPostal,
        idUsuario,
      ],
    );

    await client.query("COMMIT");

    console.log("Administrador inicial creado correctamente.");
    console.log("Email:", admin.email);
    console.log("DNI:", admin.dni);
    console.log("Recordá cambiar la contraseña de ejemplo.");
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("No se pudo crear el administrador:", error.message);
  } finally {
    client.release();
    await pool.end();
  }
}
//para ejecutar
//node .\scripts\crearAdminInicial.js

//para el hasheo de contrasenia
/**node --input-type=module -e "import bcrypt from 'bcrypt'; console.log(await bcrypt.hash('MiClaveSegura123!', 10));" */

/**SELECT
    u.id_usuario,
    u.email,
    u.contrasenia,
    r.nombre_rol,
    em.nombre,
    em.apellido,
    em.dni
FROM usuario u
INNER JOIN rol_usuario r
    ON r.id_rol = u.id_rol
INNER JOIN empleado_municipal em
    ON em.id_usuario = u.id_usuario
WHERE u.email = 'admin@municipalidad.local'; */
crearAdminInicial();
