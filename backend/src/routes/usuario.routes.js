import { Router } from "express";
import * as usuarioController from "../controllers/usuario.controller.js";

const router = Router();

router.get("/buscar", usuarioController.obtenerUsuario);

export default router;
