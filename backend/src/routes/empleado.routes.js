import { Router } from "express";

import {
  crearEmpleado,
  getEmpleados,
  fetchEmpleado,
  editarEmpleado,
  desactivarEmpleado,
  obtenerMiPerfilEmpleado,
  actualizarMiPerfilEmpleado,
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

// Perfil del empleado autenticado.
router.get("/me", autenticar, autorizarRoles(2), obtenerMiPerfilEmpleado);

router.put("/me", autenticar, autorizarRoles(2), actualizarMiPerfilEmpleado);

// Editar empleado.
router.put("/:id_empleado", autenticar, autorizarRoles(1), editarEmpleado);

// Desactivar empleado sin eliminarlo físicamente.
router.patch(
  "/:id_empleado/estado",
  autenticar,
  autorizarRoles(1),
  desactivarEmpleado,
);

export default router;
