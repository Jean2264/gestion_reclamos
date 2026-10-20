import * as reclamoRepository from "../repositories/reclamo.repository.js";

export async function  areasGestion() {
    return await reclamoRepository.areasGestion();
}