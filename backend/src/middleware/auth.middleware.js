//su trabajo es

/**Request
   ↓
¿Existe cookie token?
   ↓
¿JWT válido?
   ↓
¿Firma correcta?
   ↓
¿No expiró?
   ↓
req.usuario = información del JWT
   ↓
siguiente controller */
import { verificarToken } from "../config/jwt.js";

export function autenticar(req, res, next) {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        message: "No estás autenticado",
      });
    }

    const usuario = verificarToken(token);

    req.usuario = usuario;

    next();
  } catch (error) {
    console.error("Error al verificar JWT:", error);

    return res.status(401).json({
      message: "Sesión inválida o expirada",
    });
  }
}
