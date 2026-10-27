import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import UsuarioRoutes from "./routes/usuario.routes.js";
import CiudadanoRoutes from "./routes/ciudadano.routes.js";
import ReclamoRoutes from "./routes/reclamo.routes.js";
import EmpleadoRoutes from "./routes/empleado.routes.js";

const app = express();

app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);

app.use(express.json());

app.use("/api/usuarios", UsuarioRoutes);
app.use("/api/ciudadanos", CiudadanoRoutes);
app.use("/api/reclamos", ReclamoRoutes);
app.use("/api/empleados", EmpleadoRoutes);

export default app;
