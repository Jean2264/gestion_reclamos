import { useEffect, useState } from "react";

import "./Ciudadanos.css";
import DataTable from "../../components/common/DataTable";
import SearchBar from "../../components/common/SearchBar";
import Pagination from "../../components/common/Pagination.jsx";
import CiudadanoModal from "../../components/ciudadano-panel/CiudadanoModal";
import * as ciudadanoService from "../../services/ciudadano.service.js";

function Ciudadanos() {
  const [isCiudadanoModalOpen, setIsCiudadanoModalOpen] = useState(false);
  const [selectedCiudadanoId, setSelectedCiudadanoId] = useState(null);
  const [modalMode, setModalMode] = useState("create");

  const [search, setSearch] = useState("");
  const [searchApplied, setSearchApplied] = useState("");
  const [page, setPage] = useState(1);
  const [reloadKey, setReloadKey] = useState(0);
  const limit = 20;

  const [ciudadanos, setCiudadanos] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelado = false;

    async function cargarCiudadanos() {
      try {
        const resultado = await ciudadanoService.getCiudadanos(
          searchApplied,
          page,
          limit,
        );

        if (cancelado) return;

        const paginas = resultado.totalPages ?? 0;
        if (paginas > 0 && page > paginas) {
          setPage(paginas);
          return;
        }

        setCiudadanos(resultado.ciudadanos ?? []);
        setTotalRecords(resultado.totalRecords ?? 0);
        setTotalPages(paginas);
        setError("");
      } catch (err) {
        if (cancelado) return;

        console.error("Error al cargar ciudadanos:", err);
        setCiudadanos([]);
        setTotalRecords(0);
        setTotalPages(0);

        if (err.status === 401) {
          setError("Tu sesión no está autenticada. Iniciá sesión nuevamente.");
        } else if (err.status === 403) {
          setError("No tenés permisos para consultar los ciudadanos.");
        } else {
          setError(err.message || "No se pudieron cargar los ciudadanos.");
        }
      } finally {
        if (!cancelado) setLoading(false);
      }
    }

    cargarCiudadanos();

    return () => {
      cancelado = true;
    };
  }, [searchApplied, page, reloadKey]);

  function handleSearch() {
    setLoading(true);
    setError("");
    setPage(1);
    setSearchApplied(search.trim());
    setReloadKey((actual) => actual + 1);
  }

  function handlePageChange(newPage) {
    if (newPage < 1 || newPage > totalPages || newPage === page) return;
    setLoading(true);
    setError("");
    setPage(newPage);
  }

  function handleOpenCreateModal() {
    setSelectedCiudadanoId(null);
    setModalMode("create");
    setIsCiudadanoModalOpen(true);
  }

  function handleOpenViewModal(ciudadano) {
    setSelectedCiudadanoId(ciudadano.id_ciudadano);
    setModalMode("view");
    setIsCiudadanoModalOpen(true);
  }

  function handleCloseCiudadanoModal() {
    setIsCiudadanoModalOpen(false);
    setSelectedCiudadanoId(null);
    setModalMode("create");
  }

  function handleCiudadanoCreado() {
    setLoading(true);
    setError("");
    setSearch("");
    setSearchApplied("");
    setPage(1);
    setReloadKey((actual) => actual + 1);
  }

  const columns = [
    { accessor: "dni", header: "DNI" },
    { accessor: "nombre", header: "Nombre" },
    { accessor: "apellido", header: "Apellido" },
    {
      accessor: "email",
      header: "Correo electrónico",
      render: (ciudadano) => ciudadano.email || "Sin correo",
    },
    {
      accessor: "acciones",
      header: "Acciones",
      render: (ciudadano) => (
        <div className="ciudadano-actions">
          <button
            type="button"
            className="empleado-action-btn view"
            title="Ver ciudadano"
            aria-label={`Ver ciudadano ${ciudadano.nombre} ${ciudadano.apellido}`}
            onClick={() => handleOpenViewModal(ciudadano)}
          >
            <i className="bi bi-eye" aria-hidden="true"></i>
          </button>
        </div>
      ),
    },
  ];

  const firstRecord = totalRecords === 0 ? 0 : (page - 1) * limit + 1;
  const lastRecord = Math.min(page * limit, totalRecords);

  return (
    <section className="ciudadanos">
      <header className="ciudadanos-header">
        <div>
          <h1>Ciudadanos</h1>
          <p>Consultá y registrá ciudadanos.</p>
        </div>

        <button
          className="primary-button"
          type="button"
          onClick={handleOpenCreateModal}
        >
          <i className="bi bi-plus-circle" aria-hidden="true"></i>
          <span>Nuevo ciudadano</span>
        </button>
      </header>

      <div className="ciudadanos-toolbar">
        <div className="ciudadanos-search-group">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Buscar por DNI, nombre o apellido..."
            onSearch={handleSearch}
          />
          <button
            type="button"
            className="ciudadanos-clear-filters"
            onClick={() => {
              setLoading(true);
              setError("");
              setSearch("");
              setSearchApplied("");
              setPage(1);
              setReloadKey((actual) => actual + 1);
            }}
            disabled={!search && !searchApplied && page === 1}
            title="Limpiar búsqueda"
            aria-label="Limpiar búsqueda"
          >
            <i className="bi bi-arrow-counterclockwise" aria-hidden="true"></i>
            <span>Limpiar</span>
          </button>
        </div>

        <span className="ciudadanos-total-badge">
          <i className="bi bi-people" aria-hidden="true"></i>
          {totalRecords} {totalRecords === 1 ? "ciudadano" : "ciudadanos"}
        </span>
      </div>

      {error && (
        <div className="ciudadanos-error" role="alert">
          <span>{error}</span>
          <button
            type="button"
            onClick={() => {
              setLoading(true);
              setError("");
              setReloadKey((actual) => actual + 1);
            }}
          >
            Reintentar
          </button>
        </div>
      )}

      <div className="ciudadanos-content">
        {loading ? (
          <div className="ciudadanos-loading" role="status">
            <span
              className="spinner-border spinner-border-sm"
              aria-hidden="true"
            ></span>
            <span>Cargando ciudadanos...</span>
          </div>
        ) : error ? null : (
          <>
            <DataTable
              columns={columns}
              data={ciudadanos}
              rowKey="id_ciudadano"
            />

            <div className="ciudadanos-footer">
              <div>
                {totalRecords === 0 ? (
                  <span>
                    {searchApplied
                      ? "No se encontraron ciudadanos para esa búsqueda."
                      : "Todavía no hay ciudadanos registrados."}
                  </span>
                ) : (
                  <>
                    <span>Mostrando </span>
                    <strong>
                      {firstRecord}–{lastRecord}
                    </strong>
                    <span> de </span>
                    <strong>{totalRecords}</strong>
                    <span>
                      {" "}
                      {totalRecords === 1 ? "ciudadano" : "ciudadanos"}
                    </span>
                  </>
                )}
              </div>

              {totalPages > 1 && (
                <Pagination
                  page={page}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              )}
            </div>
          </>
        )}
      </div>

      {isCiudadanoModalOpen && (
        <CiudadanoModal
          mode={modalMode}
          ciudadanoId={selectedCiudadanoId}
          onClose={handleCloseCiudadanoModal}
          onCreated={handleCiudadanoCreado}
        />
      )}
    </section>
  );
}

export default Ciudadanos;
