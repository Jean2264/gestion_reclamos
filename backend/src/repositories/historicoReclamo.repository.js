import pool from "../config/database.js";

export async function crearHistorico (datosHistorico, client = pool){
    const{
        fechaAlta,
        estado,
        resolucion,
        idReclamo,
        idEmpleado,
    } = datosHistorico;

    const result = await client.query(
    `   
        INSERT INTO historico_reclamo (
            fecha_alta,
            estado,
            resolucion,
            id_reclamo,
            id_empleado
        )
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
    `,
    [
        fechaAlta,
            estado,
            resolucion,
            idReclamo,
            idEmpleado,

    ],
    );

    return result.rows[0];
}