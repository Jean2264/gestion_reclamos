import pool from "../config/database.js";

//mostrar areas de gestion

export async function  areasGestion() {
    const result = pool.query(`
        SELECT id_area, nombre_area
        FROM area_gestion;
        `)

        return (await result).rows;
}

export async function obtenerEstadoPorNombre(nombreEstado, client = pool) {
    const result = await client.query(
        `
        SELECT id_estado, nombre_estado
        FROM estado_reclamo
        WHERE LOWER(nombre_estado) = LOWER($1)
        LIMIT 1;
        `,
        [nombreEstado]
    );

    return result.rows[0] ?? null;
}


export async function crearReclamo(datosReclamo, idEstado, client = pool) {
    const {
        numeroPartida,
        calle,
        altura,
        calleUno,
        calleDos,
        localidad,
        codigoPostal,
        detalle,
        estadoTributario,
        idCiudadano,
        idArea
    } = datosReclamo;

    const result = await client.query(
        `
        INSERT INTO reclamo (
            numero_partida,
            calle,
            calle_uno,
            calle_dos,
            altura,
            localidad,
            detalle_reclamo,
            estado_tributario,
            codigo_postal,
            id_ciudadano,
            id_area,
            id_estado
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        RETURNING *;
        `,
        [
            numeroPartida,
            calle,
            calleUno,
            calleDos,
            altura,
            localidad,
            detalle,
            estadoTributario,
            codigoPostal,
            idCiudadano,
            idArea,
            idEstado
        ]
    );

    return result.rows[0];
}
