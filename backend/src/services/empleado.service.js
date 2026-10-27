import * as empleadoRepository from "../repositories/empleado.repository.js";
import * as ciudadanoRepository from "../repositories/ciudadano.repository.js";
import * as usuarioRepository from "../repositories/usuario.repository.js";

import { validarDatosEmpleado } from "../validators/empleado.validator.js";

import pool from "../config/database.js";
import bcrypt from "bcrypt";

// Alta de empleado desde el panel administrativo
export async function crearEmpleadoDesdePanel(datos) {
  // 1. Validar los campos recibidos.
  validarDatosEmpleado(datos);

  // 2. Normalizar los datos.
  const nombre = datos.nombre.trim();
  const apellido = datos.apellido.trim();
  const dni = String(datos.dni).trim();
  const telefono = String(datos.telefono).trim();
  const email = datos.email.trim().toLowerCase();
  const calle = datos.calle.trim();
  const numero = String(datos.numero).trim();
  const localidad = datos.localidad.trim();
  const codigoPostal = String(datos.codigoPostal).trim();
  const idRol = Number(datos.id_rol);

  // 3. Comprobar que el email no esté registrado.
  const usuarioExistente = await usuarioRepository.buscarUsuarioPorEmail(email);

  if (usuarioExistente) {
    const error = new Error("Ese email ya está registrado");
    error.statusCode = 409;
    error.details = {
      email: "Elegí otra dirección de correo",
    };

    throw error;
  }

  // 4. Comprobar que el DNI no esté registrado en empleados.
  const empleadoExistente = await empleadoRepository.buscarEmpleadoPorDni(dni);

  if (empleadoExistente) {
    const error = new Error("Ese DNI ya está registrado");
    error.statusCode = 409;
    error.details = {
      dni: "Ya existe un empleado con ese DNI",
    };

    throw error;
  }

  // 5. Comprobar que el DNI no esté registrado en ciudadanos.
  const ciudadanoExistente =
    await ciudadanoRepository.bucarCiudadanoPorDni(dni);

  if (ciudadanoExistente) {
    const error = new Error("Ese DNI ya está registrado");
    error.statusCode = 409;
    error.details = {
      dni: "Ya existe un ciudadano con ese DNI",
    };

    throw error;
  }

  // 6. Verificar que el rol exista y sea administrativo.
  const resultadoRol = await pool.query(
    `
      SELECT id_rol, nombre_rol
      FROM rol_usuario
      WHERE id_rol = $1
    `,
    [idRol],
  );

  const rol = resultadoRol.rows[0];

  if (!rol || !["Administrador", "Empleado"].includes(rol.nombre_rol)) {
    const error = new Error("El rol seleccionado no es válido");
    error.statusCode = 400;
    error.details = {
      id_rol: "Seleccioná el rol Empleado o Administrador",
    };

    throw error;
  }

  // 7. Generar la contraseña inicial.
  // Se utiliza el DNI como contraseña temporal.
  const contraseniaHash = await bcrypt.hash(dni, 10);

  // 8. Obtener una conexión para realizar la transacción.
  const client = await pool.connect();

  let transaccionIniciada = false;

  try {
    // 9. Iniciar la transacción.
    await client.query("BEGIN");
    transaccionIniciada = true;

    // 10. Crear el usuario.
    const usuarioCreado = await usuarioRepository.crearUsuario(
      email,
      contraseniaHash,
      rol.id_rol,
      client,
    );

    // 11. Preparar los datos del empleado.
    const datosEmpleado = {
      nombre,
      apellido,
      dni,
      telefono,
      calle,
      numero,
      localidad,
      codigoPostal,
      idUsuario: usuarioCreado.id_usuario,
    };

    // 12. Crear el empleado asociado al usuario.
    const empleadoCreado = await empleadoRepository.crearEmpleado(
      datosEmpleado,
      client,
    );

    // 13. Confirmar la transacción.
    await client.query("COMMIT");
    transaccionIniciada = false;

    // 14. Devolver los datos necesarios para el frontend.
    // Nunca devolver la contraseña ni su hash.
    return {
      id_empleado: empleadoCreado.id_empleado,
      id_usuario: empleadoCreado.id_usuario,
      nombre,
      apellido,
      dni,
      telefono,
      email: usuarioCreado.email,
      id_rol: usuarioCreado.id_rol,
      nombre_rol: rol.nombre_rol,
      calle,
      numero,
      localidad,
      codigo_postal: codigoPostal,
    };
  } catch (error) {
    // 15. Revertir los cambios si la operación falla.
    if (transaccionIniciada) {
      await client.query("ROLLBACK");
    }

    // 16. Contemplar conflictos de unicidad de PostgreSQL.
    if (error.code === "23505") {
      const conflicto = new Error("El DNI o el email ya están registrados");

      conflicto.statusCode = 409;

      throw conflicto;
    }

    throw error;
  } finally {
    // 17. Liberar la conexión.
    client.release();
  }
}
