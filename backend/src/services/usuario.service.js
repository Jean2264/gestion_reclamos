import * as usuarioRepository from "../repositories/usuario.repository.js";
import * as ciudadanoRepository from "../repositories/ciudadano.repository.js";
import * as rolRepository from "../repositories/rol.repository.js";
import * as empleadoRepository from "../repositories/empleado.repository.js";

import bcrypt from "bcrypt";
import pool from "../config/database.js";
import { generarToken } from "../config/jwt.js";

export async function obtenerUsuarioPorEmail(email) {
  return await usuarioRepository.buscarUsuarioPublicoPorEmail(email);
}

function crearError(mensaje, statusCode) {
  const error = new Error(mensaje);
  error.statusCode = statusCode;
  return error;
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
  throw crearError("El email ya está registrado", 409);
}

  // 2. Verificar que el DNI no exista
  const ciudadanoExiste = await ciudadanoRepository.bucarCiudadanoPorDni(dni);


if (ciudadanoExiste) {
  throw crearError("El DNI ya está registrado", 409);
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

    const token = generarToken({
      idUsuario: usuarioCreado.id_usuario,
      idCiudadano: ciudadanoCreado.id_ciudadano,
      idRol: usuarioCreado.id_rol,
    });

    return {
      token,
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
  // 1. Buscar usuario por email
  const usuario = await usuarioRepository.bucarUsuarioPorEmail(email);

  if (!usuario) {
    throw crearError("Email o contraseña incorrectos", 401);
  }

  // 2. Validar contraseña
  const contraseniaCorrecta = await bcrypt.compare(
    contrasenia,
    usuario.contrasenia,
  );

  if (!contraseniaCorrecta) {
    throw crearError("Email o contraseña incorrectos", 401);
  }

  // 3. Buscar ciudadano asociado, si existe
  const ciudadano =
    await ciudadanoRepository.buscarCiudadanoPorIdUsuario(
      usuario.id_usuario,
    );

  // 4. Generar JWT para cualquier usuario autenticado
  const token = generarToken({
    idUsuario: usuario.id_usuario,
    idCiudadano: ciudadano?.id_ciudadano ?? null,
    idRol: usuario.id_rol,
  });

  // 5. Devolver los datos de la sesión
  return {
    token,
    usuario: {
      id_usuario: usuario.id_usuario,
      email: usuario.email,
      id_rol: usuario.id_rol,
    },
    ciudadano: ciudadano
      ? {
          id_ciudadano: ciudadano.id_ciudadano,
          id_usuario: ciudadano.id_usuario,
          nombre: ciudadano.nombre,
          apellido: ciudadano.apellido,
        }
      : null,
  };
}

export async function  iniciarSesionAdmin(dni,contrasenia) {
  const empleado = await empleadoRepository.buscarEmpleadoPorDni(dni);


  //valido existencia de empleado activo
  if(!empleado)
  {
    const error= new Error("DNI o contraseña incorrecttos.");
    error.statusCode=401;
    throw error;
  }

  //Permitos solamente roles admin o empleado
  const rolesPermitidos= ["Administrador", "Empleado"];

  if(!rolesPermitidos.includes(empleado.nombre_rol)){
   const error= new Error("DNI o contraseña incorrecttos.");
    error.statusCode=401;
    throw error;
  }

  //verificar contrasenia

  const contraseniaValida= await bcrypt.compare(contrasenia,
    empleado.contrasenia
  );

  if(!contraseniaValida){
    const error= new Error("DNI o contraseña incorrecttos.");
    error.statusCode=401;
    throw error;
  }

  //Genero la sesion administrativa
  const token= generarToken({
    idUsuario: empleado.id_usuario,
    idCiudadano: null,
    idRol: empleado.id_rol,
  });

  return{
     token,
    usuario: {
      id_usuario: empleado.id_usuario,
      email: empleado.email,
      id_rol: empleado.id_rol,
      nombre_rol: empleado.nombre_rol,
    },
    empleado: {
      id_empleado: empleado.id_empleado,
      dni: empleado.dni,
    },
  };
  
}

export async function obtenerUsuarioActual(idUsuario, idCiudadano) {
  // 1. Buscar el usuario autenticado
  const usuario = await usuarioRepository.buscarUsuarioPorId(idUsuario);

  if (!usuario) {
    throw new Error("Usuario no encontrado");
  }

  // 2. Buscar el ciudadano solo si tiene uno asociado
  let ciudadano = null;

  if (idCiudadano != null) {
    ciudadano = await ciudadanoRepository.buscarCiudadanoPorId(idCiudadano);

    if (!ciudadano) {
      throw new Error("Ciudadano no encontrado");
    }
  }

  // 3. Devolver los datos públicos de la sesión
  return {
    usuario: {
      id_usuario: usuario.id_usuario,
      email: usuario.email,
      id_rol: usuario.id_rol,
    },
    ciudadano: ciudadano
      ? {
          id_ciudadano: ciudadano.id_ciudadano,
          id_usuario: ciudadano.id_usuario,
          nombre: ciudadano.nombre,
          apellido: ciudadano.apellido,
        }
      : null,
  };
}


export async function actualizarPassword(idUsuario, password) {
  const contraseniaHash = await bcrypt.hash(password, 10);
  return await usuarioRepository.actualizarPasswordUsuario(
    idUsuario,
    contraseniaHash,
  );
}
