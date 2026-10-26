import { Router } from "express";
import { autenticar } from "../middleware/auth.middleware.js";
import * as usuarioController from "../controllers/usuario.controller.js";
import { verificarToken } from "../config/jwt.js";

const router = Router();

router.get("/buscar", usuarioController.obtenerUsuario);

router.post("/registro", usuarioController.registrar);

router.post("/login", usuarioController.login);

router.post("/login-admin", usuarioController.loginAdmin);

router.get("/me", autenticar, usuarioController.obtenerUsuarioActual);

router.post("/logout", usuarioController.logout);

router.patch("/password", autenticar, usuarioController.actualizarPassword);

router.patch("/password-email", usuarioController.actualizarPasswordPorEmail);

export default router;
