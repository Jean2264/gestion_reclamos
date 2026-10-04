import express from "express";
import cors from "cors";
import UsuarioRoutes from "./routes/usuario.routes.js";

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);

app.use(express.json());

app.use("/api/usuarios", UsuarioRoutes);

export default app;
