import pool from "../config/database.js";
export async function crearImagenReclamo
(
    imagenUrl,
    idReclamo,
    client = pool
) {
    const result = await client.query (
        `INSERT INTO imagen_reclamo (imagen_url, id_reclamo)
        VALUES ($1, $2)
        RETURNING *`,
        [imagenUrl,idReclamo]
    );

    return result.rows[0]
    
}