import { Router } from "express";

import { crearEmpleado } from "../controllers/empleado.controller.js";

import { autenticar } from "../middleware/auth.middleware.js";
import { autorizarRoles } from "../middleware/roles.middleware.js";

const router = Router();

// Crear empleado desde el panel administrativo
router.post("/", autenticar, autorizarRoles(1), crearEmpleado);

export default router;
