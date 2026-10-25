import * as reclamoRepository from "../repositories/reclamo.repository.js";
import * as imgReclamoRepository from "../repositories/imagenReclamo.repository.js";
import * as historicoReclamo from "../repositories/historicoReclamo.repository.js";
import pool from "../config/database.js";

// Obtener las áreas de gestión
export async function areasGestion() {
    return await reclamoRepository.areasGestion();
}

// Crear un reclamo para un ciudadano
export async function CrearReclamoCiudadano(
    datosReclamo,
    imagenes = [],
    idCiudadano,
    estadoInicial
) {
    // Validar las imágenes
    if (!Array.isArray(imagenes) || imagenes.length > 2) {
        throw new Error("El reclamo puede tener como máximo 2 imágenes.");
    }

    // Validar el estado inicial
    if (!estadoInicial?.idEstado || !estadoInicial?.nombreEstado) {
        throw new Error("No se pudo determinar el estado inicial del reclamo.");
    }

    const client = await pool.connect();

    try {
        // Iniciar la transacción
        await client.query("BEGIN");

        const estadoInicial= await reclamoRepository.obtenerEstadoPorNombre("Nuevo", client);

        if (!estadoInicial) {
    throw new Error("No se encontró el estado inicial 'Nuevo'.");
}

        // 1. Crear el reclamo principal
        const nuevoReclamo = await reclamoRepository.crearReclamo(
            datosReclamo,
            estadoInicial.id_estado,
            client
        );

        // 2. Guardar las imágenes asociadas
        for (const imagen of imagenes) {
            await imgReclamoRepository.crearImagenReclamo(
                imagen.imagenUrl,
                nuevoReclamo.id_reclamo,
                client
            );
        }

        // 3. Registrar el estado inicial en el historial
        await historicoReclamo.crearHistorico(
            {
                estado: estadoInicial.nombre_estado,
                resolucion: null,
                idReclamo: nuevoReclamo.id_reclamo,
                idEmpleado: null
            },
            client
        );

        // Confirmar todas las operaciones
        await client.query("COMMIT");

        return nuevoReclamo;

    } catch (error) {
        // Deshacer las operaciones si alguna falla
        await client.query("ROLLBACK");
        throw error;

    } finally {
        // Liberar la conexión
        client.release();
    }
}