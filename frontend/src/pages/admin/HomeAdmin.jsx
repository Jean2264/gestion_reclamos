import { useCallback, useEffect, useState } from "react";

import ReclamoCard from "../../components/admin/ReclamoCard";
import DataTable from "../../components/common/DataTable";
import SearchBar from "../../components/common/SearchBar";
import ComplaintModal from "../../components/admin/ComplaintModal";

import {
  obtenerResumenReclamos,
  obtenerReclamosAdmin,
  obtenerDetalleReclamo,
  obtenerAreas,
  obtenerEstados,
  actualizarAreaReclamo,
  actualizarEstadoReclamo,
} from "../../services/reclamo.service.js";

import "./HomeAdmin.css";

const LIMITE_POR_PAGINA = 10;

const PAGINACION_INICIAL = {
  pagina: 1,
  limite: LIMITE_POR_PAGINA,
  total: 0,
  totalPaginas: 0,
};

// Permite recibir tanto un array como una respuesta { data: [...] }.
function extraerLista(resultado) {
  if (Array.isArray(resultado)) return resultado;
  if (Array.isArray(resultado?.data)) return resultado.data;
  return [];
}

function HomeAdmin() {
  // Catálogos.
  const [resumen, setResumen] = useState([]);
  const [areas, setAreas] = useState([]);
  const [estados, setEstados] = useState([]);

  // Tabla.
  const [reclamos, setReclamos] = useState([]);

  // Búsqueda y filtro.
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState(null);

  // Paginación.
  const [pagina, setPagina] = useState(1);
  const [paginacion, setPaginacion] = useState(PAGINACION_INICIAL);

  // Carga y errores.
  const [loadingResumen, setLoadingResumen] = useState(true);
  const [loadingCatalogos, setLoadingCatalogos] = useState(true);
  const [loadingReclamos, setLoadingReclamos] = useState(true);

  const [errorResumen, setErrorResumen] = useState("");
  const [errorCatalogos, setErrorCatalogos] = useState("");
  const [errorReclamos, setErrorReclamos] = useState("");

  // Modal.
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [isComplaintModalOpen, setIsComplaintModalOpen] = useState(false);
  const [loadingDetalle, setLoadingDetalle] = useState(false);
  const [errorDetalle, setErrorDetalle] = useState("");

  // =====================================================
  // CARGAR RESUMEN
  // =====================================================

  const cargarResumen = useCallback(async () => {
    setLoadingResumen(true);
    setErrorResumen("");

    try {
      const resultado = await obtenerResumenReclamos();
      setResumen(extraerLista(resultado));
    } catch (error) {
      setErrorResumen(error.message || "No se pudo cargar el resumen.");
    } finally {
      setLoadingResumen(false);
    }
  }, []);

  // =====================================================
  // CARGAR ÁREAS Y ESTADOS
  // =====================================================

  const cargarCatalogos = useCallback(async () => {
    setLoadingCatalogos(true);
    setErrorCatalogos("");

    try {
      const [resultadoAreas, resultadoEstados] = await Promise.all([
        obtenerAreas(),
        obtenerEstados(),
      ]);

      setAreas(extraerLista(resultadoAreas));
      setEstados(extraerLista(resultadoEstados));
    } catch (error) {
      setErrorCatalogos(
        error.message || "No se pudieron cargar las áreas y los estados.",
      );
    } finally {
      setLoadingCatalogos(false);
    }
  }, []);

  // =====================================================
  // CARGAR TABLA
  // =====================================================

  const cargarReclamos = useCallback(async () => {
    setLoadingReclamos(true);
    setErrorReclamos("");

    try {
      const resultado = await obtenerReclamosAdmin({
        idEstado: selectedStatus?.id_estado ?? "",
        buscar: search,
        pagina,
        limite: LIMITE_POR_PAGINA,
      });

      setReclamos(resultado.data ?? resultado.reclamos ?? []);

      setPaginacion(resultado.paginacion ?? PAGINACION_INICIAL);
    } catch (error) {
      setErrorReclamos(error.message || "No se pudieron cargar los reclamos.");
      setReclamos([]);
    } finally {
      setLoadingReclamos(false);
    }
  }, [selectedStatus, search, pagina]);

  useEffect(() => {
    cargarResumen();
    cargarCatalogos();
  }, [cargarResumen, cargarCatalogos]);

  useEffect(() => {
    const temporizador = setTimeout(() => {
      cargarReclamos();
    }, 300);

    return () => clearTimeout(temporizador);
  }, [cargarReclamos]);

  // =====================================================
  // FILTROS
  // =====================================================

  function handleViewDetails(estado) {
    setSelectedStatus(estado);
    setPagina(1);
  }

  function handleShowAll() {
    setSelectedStatus(null);
    setPagina(1);
  }

  function handleSearchChange(valor) {
    setSearch(valor);
    setPagina(1);
  }

  // =====================================================
  // PAGINACIÓN
  // =====================================================

  function handlePreviousPage() {
    setPagina((actual) => Math.max(1, actual - 1));
  }

  function handleNextPage() {
    setPagina((actual) => Math.min(paginacion.totalPaginas, actual + 1));
  }

  // =====================================================
  // INSPECCIONAR
  // =====================================================

  async function handleInspectComplaint(reclamo) {
    setIsComplaintModalOpen(true);
    setSelectedComplaint(null);
    setLoadingDetalle(true);
    setErrorDetalle("");

    try {
      const resultado = await obtenerDetalleReclamo(reclamo.id_reclamo);

      setSelectedComplaint(resultado.data ?? resultado);
    } catch (error) {
      setErrorDetalle(error.message || "No se pudo cargar el reclamo.");
    } finally {
      setLoadingDetalle(false);
    }
  }

  function handleCloseComplaintModal() {
    setSelectedComplaint(null);
    setIsComplaintModalOpen(false);
    setLoadingDetalle(false);
    setErrorDetalle("");
  }

  // =====================================================
  // ACTUALIZAR ÁREA RESPONSABLE
  // =====================================================

  async function handleSaveArea(reclamo, idArea) {
    const idReclamo = reclamo.id_reclamo ?? reclamo.idReclamo;

    if (!idReclamo) {
      throw new Error("No se pudo identificar el reclamo.");
    }

    await actualizarAreaReclamo(idReclamo, idArea);

    // Actualizar la información del modal con los datos guardados.
    const resultado = await obtenerDetalleReclamo(idReclamo);

    setSelectedComplaint(resultado.data ?? resultado);

    // Actualizar la tabla y las tarjetas.
    await Promise.all([cargarReclamos(), cargarResumen()]);
  }

  // =====================================================
  // ACTUALIZAR ESTADO
  // =====================================================

  async function handleSaveEstado(reclamo, idEstado) {
    const idReclamo = reclamo.id_reclamo ?? reclamo.idReclamo;

    if (!idReclamo) {
      throw new Error("No se pudo identificar el reclamo.");
    }

    await actualizarEstadoReclamo(idReclamo, idEstado);

    // Actualizar la información del modal.
    const resultado = await obtenerDetalleReclamo(idReclamo);

    setSelectedComplaint(resultado.data ?? resultado);

    // Actualizar tabla y resumen.
    await Promise.all([cargarReclamos(), cargarResumen()]);
  }

  // =====================================================
  // COLUMNAS DE LA TABLA
  // =====================================================

  const reclamoColumns = [
    {
      header: "Código",
      accessor: "codigo_reclamo",
      render: (reclamo) =>
        reclamo.codigo_reclamo || `REC-${reclamo.id_reclamo}`,
    },
    {
      header: "Asunto",
      accessor: "detalle_reclamo",
      render: (reclamo) => {
        const asunto = reclamo.detalle_reclamo || "";

        return asunto.length > 30 ? `${asunto.slice(0, 30)}...` : asunto;
      },
    },
    {
      header: "Ciudadano",
      accessor: "ciudadano",
      render: (reclamo) =>
        reclamo.ciudadano ||
        `${reclamo.ciudadano_nombre ?? ""} ${
          reclamo.ciudadano_apellido ?? ""
        }`.trim() ||
        "Sin información",
    },
    {
      header: "Área",
      accessor: "nombre_area",
      render: (reclamo) => reclamo.nombre_area || "Sin asignar",
    },
    {
      header: "Estado",
      accessor: "nombre_estado",
      render: (reclamo) => reclamo.nombre_estado || "Sin estado",
    },
    {
      header: "Acciones",
      accessor: "acciones",
      render: (reclamo) => (
        <button type="button" onClick={() => handleInspectComplaint(reclamo)}>
          Inspeccionar
        </button>
      ),
    },
  ];

  // =====================================================
  // TARJETAS: OCULTAR FINALIZADOS
  // =====================================================

  const estadosVisibles = resumen.filter((estado) =>
    ["nuevo", "asignado", "en proceso"].includes(
      (estado.nombre_estado ?? "").toLowerCase(),
    ),
  );

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="home-admin">
      <section className="home-admin-cards">
        {loadingResumen ? (
          <p>Cargando resumen de reclamos...</p>
        ) : errorResumen ? (
          <p className="home-admin-error">{errorResumen}</p>
        ) : estadosVisibles.length === 0 ? (
          <p>No hay reclamos para mostrar.</p>
        ) : (
          estadosVisibles.map((estado) => (
            <ReclamoCard
              key={estado.id_estado}
              title={`Reclamos ${estado.nombre_estado.toLowerCase()}`}
              description={`Reclamos que se encuentran en estado ${estado.nombre_estado.toLowerCase()}.`}
              count={estado.cantidad}
              icon="bi bi-inbox"
              onViewDetails={() => handleViewDetails(estado)}
            />
          ))
        )}
      </section>

      <section className="home-admin-search">
        <div className="home-admin-search-header">
          <h2>
            {selectedStatus
              ? `Reclamos: ${selectedStatus.nombre_estado}`
              : "Buscar reclamos"}
          </h2>
        </div>

        <div className="home-admin-header-section">
          <SearchBar
            value={search}
            onChange={handleSearchChange}
            placeholder="Buscar por código, asunto o ciudadano..."
          />

          <button className="all" type="button" onClick={handleShowAll}>
            Mostrar todos
          </button>
        </div>

        {selectedStatus && (
          <button
            type="button"
            className="home-admin-clear-filter"
            onClick={handleShowAll}
          >
            Quitar filtro de estado
          </button>
        )}
      </section>

      {errorReclamos && <p className="home-admin-error">{errorReclamos}</p>}

      {loadingReclamos ? (
        <p>Cargando reclamos...</p>
      ) : (
        <>
          <DataTable
            columns={reclamoColumns}
            data={reclamos}
            rowKey="id_reclamo"
          />

          <div className="home-admin-pagination">
            <span>
              {paginacion.total === 0
                ? "No hay resultados"
                : `${paginacion.total} reclamo(s) encontrados`}
            </span>

            <div className="home-admin-pagination-controls">
              <button
                type="button"
                onClick={handlePreviousPage}
                disabled={pagina <= 1 || loadingReclamos}
              >
                Anterior
              </button>

              <span>
                Página {paginacion.totalPaginas === 0 ? 0 : pagina}
                {" de "}
                {paginacion.totalPaginas}
              </span>

              <button
                type="button"
                onClick={handleNextPage}
                disabled={
                  pagina >= paginacion.totalPaginas ||
                  paginacion.totalPaginas === 0 ||
                  loadingReclamos
                }
              >
                Siguiente
              </button>
            </div>
          </div>
        </>
      )}

      {isComplaintModalOpen &&
        (loadingDetalle ? (
          <div className="home-admin-modal-loading">
            <p>Cargando información del reclamo...</p>
          </div>
        ) : errorDetalle ? (
          <div className="home-admin-modal-error">
            <p>{errorDetalle}</p>

            <button type="button" onClick={handleCloseComplaintModal}>
              Cerrar
            </button>
          </div>
        ) : selectedComplaint ? (
          loadingCatalogos ? (
            <div className="home-admin-modal-loading">
              <p>Cargando áreas y estados...</p>
            </div>
          ) : errorCatalogos ? (
            <div className="home-admin-modal-error">
              <p>{errorCatalogos}</p>

              <button type="button" onClick={cargarCatalogos}>
                Reintentar
              </button>
            </div>
          ) : (
            <ComplaintModal
              reclamo={selectedComplaint}
              estados={estados}
              areas={areas}
              onSaveEstado={handleSaveEstado}
              onSaveArea={handleSaveArea}
              onClose={handleCloseComplaintModal}
            />
          )
        ) : null)}
    </div>
  );
}

export default HomeAdmin;
