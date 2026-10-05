import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import UsuarioRoutes from "./routes/usuario.routes.js";

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

export default app;
