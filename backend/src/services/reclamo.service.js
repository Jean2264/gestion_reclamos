import * as reclamoRepository from "../repositories/reclamo.repository.js";
import * as imgReclamoRepository from "../repositories/imagenReclamo.repository.js";
import * as historicoReclamo from "../repositories/historicoReclamo.repository.js";
import pool from "../config/database.js";
export async function  areasGestion() {
    return await reclamoRepository.areasGestion();
}

