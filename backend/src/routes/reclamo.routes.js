import { Router } from "express";
import { autenticar } from "../middleware/auth.middleware.js";
import { autorizarRoles } from "../middleware/roles.middleware.js";
import upload from "../middleware/upload.middleware.js";
import * as reclamoController from "../controllers/reclamo. controller.js";

const router = Router();

router.get("/areas", reclamoController.obtenerAreas);

//registro de reclamo
router.post(
  "/",
  autenticar,
  autorizarRoles(3),
  upload.array("imagenes", 2),
  reclamoController.crearReclamoCiudadano,
);

router.get("/mis-reclamos", autenticar, reclamoController.obtenerMisReclamos);

export default router;
