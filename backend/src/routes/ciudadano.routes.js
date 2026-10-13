import { Router } from "express";
import * as ciudadanoController from "../controllers/ciudadano.controller.js";
import { autenticar } from "../middleware/auth.middleware.js";
const router = Router();

router.get("/me", autenticar, ciudadanoController.miPerfil);
router.put("/me", autenticar, ciudadanoController.actualizarMiPerfil);

export default router;
