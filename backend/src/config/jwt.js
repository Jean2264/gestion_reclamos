
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET || JWT_SECRET.length < 32) {
  throw new Error(
    "JWT_SECRET debe estar configurado con al menos 32 caracteres."
  );
}

export function generarToken(payload) {
  return jwt.sign(payload, JWT_SECRET, {
    algorithm: "HS256",
    expiresIn: "8h",
  });
}

export function verificarToken(token) {
  return jwt.verify(token, JWT_SECRET, {
    algorithms: ["HS256"],
  });
}
