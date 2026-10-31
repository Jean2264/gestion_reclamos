import { Router } from "express";

import {
  crearEmpleado,
  getEmpleados,
  fetchEmpleado,
} from "../controllers/empleado.controller.js";

import { autenticar } from "../middleware/auth.middleware.js";
import { autorizarRoles } from "../middleware/roles.middleware.js";

const router = Router();

// Listar empleados con búsqueda y paginación.
router.get("/", autenticar, autorizarRoles(1), getEmpleados);

// Buscar un empleado por ID.
router.post("/buscar", autenticar, autorizarRoles(1), fetchEmpleado);

// Crear empleado desde el panel administrativo.
router.post("/", autenticar, autorizarRoles(1), crearEmpleado);

export default router;
