import pool from "../config/database";
export async function crearImagenReclamo
(
    imagenUrl,
    idReclamo,
    client = pool
) {
    const resul = await client.query (
        `INSERT INTO imagen_reclamo (imagen_url, id_reclamo)
        VALUE ($1, $2)
        RETURNIG*`,
        [imagenUrl,idReclamo]
    );

    return result.rows[0]
    
}