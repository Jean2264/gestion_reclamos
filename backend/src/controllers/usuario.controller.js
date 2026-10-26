import e from "express";
import * as usuarioService from "../services/usuario.service.js";

function establecerCookieSesion(res, token) {
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    // Sin maxAge ni expires:
    // cookie de sesión del navegador.
  });
}

function eliminarCookieSesion(res) {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });
}

export async function obtenerUsuario(req, res) {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({
        message: "El email es obligatorio",
      });
    }

    const usuario = await usuarioService.obtenerUsuarioPorEmail(email);

    if (!usuario) {
      return res.status(404).json({
        message: "Usuario no encontrado",
      });
    }

    const { contrasenia, ...usuarioSeguro } = usuario;

    return res.status(200).json(usuarioSeguro);
  } catch (error) {
    console.error("Error al obtener usuario", error);

    return res.status(500).json({
      message: "Error interno del servidor",
    });
  }
}

export async function registrar(req, res) {
  try {
    const datosRegistro = req.body;

    const resultado = await usuarioService.registrarUsuario(datosRegistro);

    establecerCookieSesion(res, resultado.token);
    return res.status(201).json({
      message: "Usuario registrado correctamente",
      data: {
        usuario: resultado.usuario,
        ciudadano: resultado.ciudadano,
      },
    });
  } catch (error) {
    if (error.statusCode === 409) {
      return res.status(409).json({
        message: error.message,
      });
    }

    console.error("Error al registrar usuario:", error);

    return res.status(500).json({
      message: "Error interno del servidor",
    });
  }
}

export async function login(req, res) {
  try {
    console.log("BODY RECIBIDO:", req.body);
    const { email, contrasenia } = req.body;

    if (!email || !contrasenia) {
      return res.status(400).json({
        message: "Email y contraseña son obligatorios",
      });
    }

    const resultado = await usuarioService.iniciarSesion(email, contrasenia);

    //guardarmos el token en una cookie "que ricooo"
    establecerCookieSesion(res, resultado.token);

    return res.status(200).json({
      message: "Inicio de sesión correcto",
      data: {
        usuario: resultado.usuario,
        ciudadano: resultado.ciudadano,
      },
    });
  } catch (error) {
    if (error.statusCode === 401) {
      return res.status(401).json({
        message: error.message,
      });
    }

    console.error("Error al iniciar sesión:", error);

    return res.status(500).json({
      message: "Error interno del servidor",
    });
  }
}

//login admin

export async function loginAdmin(req, res) {
  try {
    const { dni, contrasenia } = req.body;

    if (!dni || !contrasenia) {
      return res.status(400).json({
        message: "El DNI y la contraseña son obligatorios.",
      });
    }

    const resultado = await usuarioService.iniciarSesionAdmin(dni, contrasenia);

    establecerCookieSesion(res, resultado.token);

    return res.status(200).json({
      message: "Inicio de sesión administrativo exitoso.",
      data: {
        usuario: resultado.usuario,
        empleado: resultado.empleado,
      },
    });
  } catch (error) {
    console.error("Error en login administrativo: ", error.message);

    return res.status(error.statusCode || 500).json({
      message:
        error.statusCode === 401
          ? "DNI o contraseña incorrectos"
          : "Error al iniciar sesion",
    });
  }
}

export async function obtenerUsuarioActual(req, res) {
  try {
    const { idUsuario, idCiudadano } = req.usuario;

    const resultado = await usuarioService.obtenerUsuarioActual(
      idUsuario,
      idCiudadano,
    );

    return res.status(200).json({
      data: resultado,
    });
  } catch (error) {
    console.error("Error al obtener usuario actual:", error);

    return res.status(500).json({
      message: "Error interno del servidor",
    });
  }
}

export async function actualizarPassword(req, res) {
  try {
    const { idUsuario } = req.usuario;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        message: "La contraseña es obligatoria.",
      });
    }

    const resultado = await usuarioService.actualizarPassword(
      idUsuario,
      password,
    );

    if (!resultado) {
      return res.status(404).json({
        message: "Usuario no encontrado.",
      });
    }

    return res.status(200).json({
      message: "Contrasenia actualizada correctamente",
    });
  } catch (error) {
    console.error("Error al actualizar la contrasenia", error);

    return res.status(500).json({
      message: "Error interno del servidor",
    });
  }
}

export async function actualizarPasswordPorEmail(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "El email y la contraseña son obligatorios.",
      });
    }

    const resultado = await usuarioService.actualizarPasswordPorEmail(
      email,
      password,
    );

    if (!resultado) {
      return res.status(404).json({
        message: "Usuario no encontrado.",
      });
    }

    return res.status(200).json({
      message: "Contraseña actualizada correctamente.",
    });
  } catch (error) {
    console.error("Error al actualizar la contraseña por email:", error);

    return res.status(500).json({
      message: "Error interno del servidor.",
    });
  }
}

export async function logout(req, res) {
  eliminarCookieSesion(res);

  return res.status(200).json({
    message: "Sesión cerrada correctamente",
  });
}
