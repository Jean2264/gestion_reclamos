import { Router } from "express";
import * as ciudadanoController from "../controllers/ciudadano.controller.js";
import { autenticar } from "../middleware/auth.middleware.js";
const router = Router();

router.get("/me", autenticar, ciudadanoController.miPerfil);

export default router;
