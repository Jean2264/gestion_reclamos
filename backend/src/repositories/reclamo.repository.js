import pool from "../config/database.js";

//mostrar areas de gestion

export async function  areasGestion() {
    const result = pool.query(`
        SELECT id_area, nombre_area
        FROM area_gestion;
        `)

        return (await result).rows;
}


export async function  crearReclamo(datosReclamo) {
    
}