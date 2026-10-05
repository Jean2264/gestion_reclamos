import e from "express";
import * as usuarioService from "../services/usuario.service.js";

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

    return res.status(200).json(usuario);
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

    return res.status(201).json({
      message: "Usuario registrado correctamente",
      data: resultado,
    });
  } catch (error) {
    console.error("Error al registrar usuario", error);

    return res.status(500).json({
      message: error.message,
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
    res.cookie("token", resultado.token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 8 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "Inicio de sesión correcto",
      data: {
        usuario: resultado.usuario,
        ciudadano: resultado.ciudadano,
      },
    });
  } catch (error) {
    console.error("Error al inciar sesión");

    return res.status(500).json({
      message: error.message,
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

export async function logout(req, res) {
  res.clearCookie("token");

  return res.status(200).json({
    message: "Sesión cerrada correctamente",
  });
}
