import * as usuarioRepository from "../repositories/usuario.repository.js";
import * as ciudadanoRepository from "../repositories/ciudadano.repository.js";
import * as rolRepository from "../repositories/rol.repository.js";
import bcrypt from "bcrypt";
import pool from "../config/database.js";
import { generarToken } from "../config/jwt.js";

export async function obtenerUsuarioPorEmail(email) {
  return await usuarioRepository.bucarUsuarioPorEmail(email);
}

export async function registrarUsuario(datosRegistro) {
  const {
    nombre,
    apellido,
    dni,
    telefono,
    fechaNacimiento,
    calle,
    numero,
    localidad,
    codigoPostal,
    email,
    contrasenia,
  } = datosRegistro;

  // 1. Verificar que el email no exista
  const usuarioExiste = await usuarioRepository.bucarUsuarioPorEmail(email);

  if (usuarioExiste) {
    throw new Error("El email ya está registrado");
  }

  // 2. Verificar que el DNI no exista
  const ciudadanoExiste = await ciudadanoRepository.bucarCiudadanoPorDni(dni);

  if (ciudadanoExiste) {
    throw new Error("El DNI ya está registrado");
  }

  // 3. Buscar rol Ciudadano
  const rolCiudadano = await rolRepository.buscarRolPorNombre("Ciudadano");

  if (!rolCiudadano) {
    throw new Error("No existe el rol Ciudadano");
  }

  // 4. Hashear la contraseña
  const contraseniaHash = await bcrypt.hash(contrasenia, 10);

  // 5. Obtener una conexión del pool
  const client = await pool.connect();

  try {
    // 6. Iniciar transacción
    await client.query("BEGIN");

    // 7. Crear usuario
    const usuarioCreado = await usuarioRepository.crearUsuario(
      email,
      contraseniaHash,
      rolCiudadano.id_rol,
      client,
    );

    // 8. Preparar los datos del ciudadano
    const datosCiudadano = {
      nombre,
      apellido,
      dni,
      telefono,
      fechaNacimiento,
      calle,
      numero,
      localidad,
      codigoPostal,
      idUsuario: usuarioCreado.id_usuario,
    };

    // 9. Crear ciudadano
    const ciudadanoCreado = await ciudadanoRepository.crearCiudadano(
      datosCiudadano,
      client,
    );

    // 10. Confirmar transacción
    await client.query("COMMIT");

    return {
      usuario: usuarioCreado,
      ciudadano: ciudadanoCreado,
    };
  } catch (error) {
    // 11. Deshacer cambios
    await client.query("ROLLBACK");

    throw error;
  } finally {
    // 12. Liberar conexión
    client.release();
  }
}

export async function iniciarSesion(email, contrasenia) {
  //1. busco al user por el email

  const usuario = await usuarioRepository.bucarUsuarioPorEmail(email);

  if (!usuario) {
    throw new Error("Email o contraseña incorrectos");
  }

  //2. comparo las conrasenias
  const contraseniaCorrecta = await bcrypt.compare(
    contrasenia,
    usuario.contrasenia,
  );

  if (!contraseniaCorrecta) {
    throw new Error("Email o contraseña incorrectos");
  }

  //3. buscar ciudadano asociado
  const ciudadano = await ciudadanoRepository.buscarCiudadanoPorIdUsuario(
    usuario.id_usuario,
  );

  if (!ciudadano) {
    throw new Error("El usuario no cuenta con un ciudadano asociado.");
  }

  // generamos token jwt
  const token = generarToken({
    idUsuario: usuario.id_usuario,
    idCiudadano: ciudadano.id_ciudadano,
    idRol: usuario.id_rol,
  });

  //5. devolver informacion necesaria
  return {
    token,
    usuario: {
      id_usuario: usuario.id_usuario,
      email: usuario.email,
      id_rol: usuario.id_rol,
    },
    ciudadano: {
      id_ciudadano: ciudadano.id_ciudadano,
      id_usuario: ciudadano.id_usuario,
      nombre: ciudadano.nombre,
      apellido: ciudadano.apellido,
    },
  };
}

export async function obtenerUsuarioActual(idUsuario, idCiudadano) {
  const usuario = await usuarioRepository.buscarUsuarioPorId(idUsuario);

  if (!usuario) {
    throw new Error("Usuario no encontrado");
  }

  const ciudadano = await ciudadanoRepository.buscarCiudadanoPorId(idCiudadano);

  if (!ciudadano) {
    throw new Error("Ciudadano no encontrado");
  }

  return {
    usuario: {
      id_usuario: usuario.id_usuario,
      email: usuario.email,
      id_rol: usuario.id_rol,
    },
    ciudadano: {
      id_ciudadano: ciudadano.id_ciudadano,
      id_usuario: ciudadano.id_usuario,
      nombre: ciudadano.nombre,
      apellido: ciudadano.apellido,
    },
  };
}
