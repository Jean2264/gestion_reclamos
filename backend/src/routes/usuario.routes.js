import { Router } from "express";
import { autenticar } from "../middleware/auth.middleware.js";
import * as usuarioController from "../controllers/usuario.controller.js";

const router = Router();

router.get("/buscar", usuarioController.obtenerUsuario);

router.post("/registro", usuarioController.registrar);

router.post("/login", usuarioController.login);

router.get("/me", autenticar, usuarioController.obtenerUsuarioActual);

router.post("/logout", usuarioController.logout);

export default router;
