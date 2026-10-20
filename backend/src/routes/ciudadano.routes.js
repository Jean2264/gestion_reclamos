import { Router } from "express";
import * as ciudadanoController from "../controllers/ciudadano.controller.js";
import { autenticar } from "../middleware/auth.middleware.js";
import { autorizarRoles } from "../middleware/roles.middleware.js";
const router = Router();

router.get("/me", autenticar, ciudadanoController.miPerfil);
router.put("/me", autenticar, ciudadanoController.actualizarMiPerfil);

router.post(
  "/",
  autenticar,
  autorizarRoles(1, 2),
  ciudadanoController.crear,
);

export default router;
