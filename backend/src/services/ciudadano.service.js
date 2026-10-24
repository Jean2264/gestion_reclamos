import * as ciudadanoRepository from "../repositories/ciudadano.repository.js";
import * as usuarioRepository from "../repositories/usuario.repository.js";

import { validarDatosCiudadano } from "../validators/ciudadano.validator.js";
import pool from "../config/database.js";
import bcrypt from "bcrypt";

export async function miPerfil(idCiudadano) {
  const ciudadano = await ciudadanoRepository.miPerfil(idCiudadano);

  if (!ciudadano) {
    throw new Error("Ciudadano no encontrado");
  }

  return ciudadano;
}

//Actualizar perfil
export async function actualizarMiPerfil(idCiudadano, idUsuario, datos) {
  // 1. Validar los datos recibidos.
  validarDatosCiudadano(datos);

  // 2. Validar el formato del email.
  if (
    typeof datos.email !== "string" ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(datos.email.trim())
  ) {
    const error = new Error("El email no es válido");
    error.statusCode = 400;
    error.details = {
      email: "Ingresá un email válido",
    };
    throw error;
  }

  // 3. Comprobar si el email pertenece a otra cuenta.
  const usuarioExistente = await usuarioRepository.bucarUsuarioPorEmail(
    datos.email.trim(),
  );

  if (
    usuarioExistente &&
    Number(usuarioExistente.id_usuario) !== Number(idUsuario)
  ) {
    const error = new Error("Ese email ya está registrado");
    error.statusCode = 409;
    error.details = {
      email: "Elegí otra dirección de correo",
    };
    throw error;
  }

  // 4. Obtener la conexión para la transacción.
  const client = await pool.connect();
  let transaccionIniciada = false;

  try {
    await client.query("BEGIN");
    transaccionIniciada = true;

    // 5. Actualizar los datos personales del ciudadano.
    const ciudadano = await ciudadanoRepository.actualizarDatosCiudadano(
      idCiudadano,
      datos,
      client,
    );

    if (!ciudadano) {
      throw new Error("Ciudadano no encontrado");
    }

    // 6. Actualizar el email del usuario.
    const usuario = await usuarioRepository.actualizarEmailUsuario(
      idUsuario,
      datos.email.trim(),
      client,
    );

    if (!usuario) {
      throw new Error("Usuario no encontrado");
    }

    // 7. Confirmar ambas actualizaciones.
    await client.query("COMMIT");
    transaccionIniciada = false;

    return {
      ...ciudadano,
      email: usuario.email,
    };
  } catch (error) {
    if (transaccionIniciada) {
      await client.query("ROLLBACK");
    }

    throw error;
  } finally {
    client.release();
  }
}






// Alta de ciudadano desde el panel administrativo
export async function crearCiudadanoDesdePanel(datos) {
  // 1. Validar los datos personales del ciudadano.
  validarDatosCiudadano(datos);

  // 2. Normalizar los datos principales.
  const email = datos.email?.trim().toLowerCase();
  const dni = String(datos.dni ?? "").trim();

  // 3. Validar el email.
  if (
    typeof email !== "string" ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  ) {
    const error = new Error("El email no es válido");
    error.statusCode = 400;
    error.details = {
      email: "Ingresá un email válido",
    };
    throw error;
  }

  // 4. Comprobar que el email no esté registrado.
  const usuarioExistente =
    await usuarioRepository.bucarUsuarioPorEmail(email);

  if (usuarioExistente) {
    const error = new Error("Ese email ya está registrado");
    error.statusCode = 409;
    error.details = {
      email: "Elegí otra dirección de correo",
    };
    throw error;
  }

  // 5. Comprobar que el DNI no esté registrado.
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

  // 6. Generar el hash de la contraseña inicial.
  // La contraseña inicial es el DNI.
  const contraseniaHash = await bcrypt.hash(dni, 10);

  // 7. Crear usuario y ciudadano dentro de una transacción.
  const client = await pool.connect();
  let transaccionIniciada = false;

  try {
    await client.query("BEGIN");
    transaccionIniciada = true;

    const usuario = await usuarioRepository.crearUsuario(
      email,
      contraseniaHash,
      3, // Rol Ciudadano
      client,
    );

    const ciudadano = await ciudadanoRepository.crearCiudadano(
      {
        ...datos,
        email,
        dni,
        idUsuario: usuario.id_usuario,
      },
      client,
    );

    await client.query("COMMIT");
    transaccionIniciada = false;

    // No devolver la contraseña ni su hash.
    return {
      ...ciudadano,
      email: usuario.email,
    };
  } catch (error) {
    if (transaccionIniciada) {
      await client.query("ROLLBACK");
    }

    // Contempla duplicados que aparezcan simultáneamente.
    if (error.code === "23505") {
      const conflicto = new Error(
        "El email o el DNI ya están registrados",
      );
      conflicto.statusCode = 409;
      throw conflicto;
    }

    throw error;
  } finally {
    client.release();
  }
}
