import pool from "../config/database.js";

export async function crearHistorico(datosHistorico, client = pool) {
    const {
        estado,
        resolucion,
        idReclamo,
        idEmpleado
    } = datosHistorico;

    const result = await client.query(
        `
        INSERT INTO historico_reclamo (
            estado,
            resolucion,
            id_reclamo,
            id_empleado
        )
        VALUES ($1, $2, $3, $4)
        RETURNING *;
        `,
        [
            estado,
            resolucion,
            idReclamo,
            idEmpleado
        ]
    );

    return result.rows[0];
}