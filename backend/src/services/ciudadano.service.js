import * as ciudadanoRepository from "../repositories/ciudadano.repository.js";
import * as usuarioRepository from "../repositories/usuario.repository.js";
import { validarDatosCiudadano } from "../validators/ciudadano.validator.js";
import pool from "../config/database.js";

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
