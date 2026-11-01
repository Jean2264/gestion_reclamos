import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { UPLOADS_DIR } from "./config/uploads.js";

import UsuarioRoutes from "./routes/usuario.routes.js";
import CiudadanoRoutes from "./routes/ciudadano.routes.js";
import ReclamoRoutes from "./routes/reclamo.routes.js";
import EmpleadoRoutes from "./routes/empleado.routes.js";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middlewares generales.
app.use(cookieParser());

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);

app.use(express.json());

// Publicar las imágenes almacenadas en uploads.
app.use("/uploads", express.static(UPLOADS_DIR));

// Rutas de la API.
app.use("/api/usuarios", UsuarioRoutes);
app.use("/api/ciudadanos", CiudadanoRoutes);
app.use("/api/reclamos", ReclamoRoutes);
app.use("/api/empleados", EmpleadoRoutes);

export default app;
