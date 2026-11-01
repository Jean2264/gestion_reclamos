import { Router } from "express";

import { autenticar } from "../middleware/auth.middleware.js";
import { autorizarRoles } from "../middleware/roles.middleware.js";
import upload from "../middleware/upload.middleware.js";

import * as reclamoController from "../controllers/reclamo.controller.js";

const router = Router();

// =====================================================
// RUTAS PÚBLICAS
// =====================================================

// Obtener áreas de gestión.
router.get("/areas", reclamoController.obtenerAreas);

// Obtener estados disponibles.
router.get("/estados", reclamoController.obtenerEstados);

// =====================================================
// RUTAS PARA CIUDADANOS
// =====================================================

// Registrar un reclamo.
router.post(
  "/",
  autenticar,
  autorizarRoles(3),
  upload.array("imagenes", 2),
  reclamoController.crearReclamoCiudadano,
);

// Consultar los reclamos del ciudadano autenticado.
router.get(
  "/mis-reclamos",
  autenticar,
  autorizarRoles(3),
  reclamoController.obtenerMisReclamos,
);

// =====================================================
// RUTAS ADMINISTRATIVAS
// =====================================================

// Resumen de cantidades por estado.
router.get(
  "/admin/resumen",
  autenticar,
  autorizarRoles(1, 2),
  reclamoController.obtenerResumenReclamosAdmin,
);

// Listar, buscar, filtrar y paginar reclamos.
router.get(
  "/admin",
  autenticar,
  autorizarRoles(1, 2),
  reclamoController.obtenerReclamosAdmin,
);

// Inspeccionar un reclamo.
router.get(
  "/admin/:id",
  autenticar,
  autorizarRoles(1, 2),
  reclamoController.obtenerDetalleReclamoAdmin,
);

// Cambiar el estado de un reclamo.
router.patch(
  "/admin/:id/estado",
  autenticar,
  autorizarRoles(1, 2),
  reclamoController.actualizarEstadoAdmin,
);

// Cambiar el área asignada a un reclamo.
router.patch(
  "/admin/:id/area",
  autenticar,
  autorizarRoles(1, 2),
  reclamoController.actualizarAreaAdmin,
);

export default router;
