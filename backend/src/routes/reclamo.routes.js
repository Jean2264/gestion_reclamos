import {Router} from "express";

import * as reclamoController from "../controllers/reclamo.controller.js";

const router = Router();

router.get("/areas", reclamoController.obtenerAreas);

export default router;