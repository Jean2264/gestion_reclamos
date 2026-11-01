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

export async function getAllEmpleados(search, page = 1, limit = 20) {
  const empleados = await empleadoRepository.getAllEmpleados(
    search,
    page,
    limit,
  );

  return empleados;
}

export async function fetchEmpleado(id) {
  const empleado = await empleadoRepository.fetchEmpleadoById(id);

  return empleado;
}

// Editar empleado desde el panel administrativo.
export async function editarEmpleadoDesdePanel(idEmpleado, datos) {
  const id = Number(idEmpleado);

  if (!Number.isInteger(id) || id <= 0) {
    const error = new Error("El ID del empleado no es válido");
    error.statusCode = 400;
    throw error;
  }

  // Validar los datos recibidos.
  const camposObligatorios = [
    "nombre",
    "apellido",
    "telefono",
    "email",
    "calle",
    "numero",
    "localidad",
    "codigoPostal",
    "id_rol",
  ];

  const errores = {};

  for (const campo of camposObligatorios) {
    const valor = datos[campo];

    if (valor === undefined || valor === null || String(valor).trim() === "") {
      errores[campo] = "Este campo es obligatorio";
    }
  }

  if (Object.keys(errores).length > 0) {
    const error = new Error("Revisá los campos obligatorios");
    error.statusCode = 400;
    error.details = errores;
    throw error;
  }

  // Normalizar datos.
  const nombre = String(datos.nombre).trim();
  const apellido = String(datos.apellido).trim();
  const telefono = String(datos.telefono).trim();
  const email = String(datos.email).trim().toLowerCase();
  const calle = String(datos.calle).trim();
  const numero = String(datos.numero).trim();
  const localidad = String(datos.localidad).trim();
  const codigoPostal = String(datos.codigoPostal).trim();
  const idRol = Number(datos.id_rol);

  if (!Number.isInteger(idRol)) {
    const error = new Error("El rol seleccionado no es válido");
    error.statusCode = 400;
    error.details = {
      id_rol: "Seleccioná un rol válido",
    };
    throw error;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    const error = new Error("El correo electrónico no es válido");
    error.statusCode = 400;
    error.details = {
      email: "Ingresá una dirección de correo válida",
    };
    throw error;
  }

  // Verificar el rol administrativo.
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

  const client = await pool.connect();
  let transaccionIniciada = false;

  try {
    await client.query("BEGIN");
    transaccionIniciada = true;

    // Obtener el empleado activo y su usuario asociado.
    const resultadoEmpleado = await client.query(
      `
        SELECT
          e.id_empleado,
          e.id_usuario,
          e.estado
        FROM empleado_municipal e
        WHERE e.id_empleado = $1
        FOR UPDATE
      `,
      [id],
    );

    const empleadoActual = resultadoEmpleado.rows[0];

    if (!empleadoActual || !empleadoActual.estado) {
      const error = new Error("Empleado no encontrado o inactivo");
      error.statusCode = 404;
      throw error;
    }

    if (!empleadoActual.id_usuario) {
      const error = new Error("El empleado no tiene un usuario asociado");
      error.statusCode = 409;
      throw error;
    }

    // Verificar que el correo no pertenezca a otro usuario.
    const emailExistente = await empleadoRepository.buscarEmailDeOtroUsuario(
      email,
      empleadoActual.id_usuario,
      client,
    );

    if (emailExistente) {
      const error = new Error("Ese email ya está registrado");
      error.statusCode = 409;
      error.details = {
        email: "Elegí otra dirección de correo",
      };
      throw error;
    }

    // Actualizar datos personales.
    const empleadoActualizado = await empleadoRepository.actualizarEmpleado(
      id,
      {
        nombre,
        apellido,
        telefono,
        calle,
        numero,
        localidad,
        codigoPostal,
      },
      client,
    );

    if (!empleadoActualizado) {
      const error = new Error("No se pudo actualizar el empleado");
      error.statusCode = 409;
      throw error;
    }

    // Actualizar email y rol.
    const usuarioActualizado =
      await empleadoRepository.actualizarUsuarioEmpleado(
        empleadoActual.id_usuario,
        {
          email,
          idRol,
        },
        client,
      );

    if (!usuarioActualizado) {
      const error = new Error("No se pudo actualizar el usuario del empleado");
      error.statusCode = 409;
      throw error;
    }

    await client.query("COMMIT");
    transaccionIniciada = false;

    return {
      ...empleadoActualizado,
      id_usuario: usuarioActualizado.id_usuario,
      email: usuarioActualizado.email,
      id_rol: usuarioActualizado.id_rol,
      nombre_rol: rol.nombre_rol,
    };
  } catch (error) {
    if (transaccionIniciada) {
      await client.query("ROLLBACK");
    }

    if (error.code === "23505") {
      const conflicto = new Error("El correo electrónico ya está registrado");
      conflicto.statusCode = 409;
      conflicto.details = {
        email: "Elegí otra dirección de correo",
      };
      throw conflicto;
    }

    throw error;
  } finally {
    client.release();
  }
}
// Desactivar empleado desde el panel administrativo.\

export async function desactivarEmpleadoDesdePanel(idEmpleado) {
  const ID_ADMIN_SEMILLA = 1;
  const id = Number(idEmpleado);

  // Validar el ID del empleado.
  if (!Number.isInteger(id) || id <= 0) {
    const error = new Error("El ID del empleado no es válido");
    error.statusCode = 400;
    throw error;
  }

  // Proteger al administrador semilla.
  if (id === ID_ADMIN_SEMILLA) {
    const error = new Error("No se puede eliminar al administrador inicial.");
    error.statusCode = 403;
    throw error;
  }

  // Desactivar al empleado.
  const empleado = await empleadoRepository.desactivarEmpleado(id);

  if (!empleado) {
    const error = new Error("Empleado no encontrado o ya desactivado");
    error.statusCode = 404;
    throw error;
  }

  return empleado;
}
