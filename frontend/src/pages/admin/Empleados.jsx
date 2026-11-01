import { useState, useEffect, useCallback } from "react";

import "./Empleados.css";

import DataTable from "../../components/common/DataTable";
import SearchBar from "../../components/common/SearchBar";
import Pagination from "../../components/common/Pagination.jsx";
import EmpleadoModal from "../../components/empleado-panel/EmpleadoModal";
import ConfirmModal from "../../components/common/ConfirmModal";

import * as empleadoService from "../../services/empleado.service.js";

function Empleados() {
  // Modal
  const [isEmpleadoModalOpen, setIsEmpleadoModalOpen] = useState(false);
  const [selectedEmpleadoId, setSelectedEmpleadoId] = useState(null);
  const [empleadoModalMode, setEmpleadoModalMode] = useState("create");
  // Modal de confirmación para eliminar
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [empleadoAEliminar, setEmpleadoAEliminar] = useState(null);
  // Abrir confirmación de eliminación
  function handleOpenDeleteModal(empleado) {
    setEmpleadoAEliminar(empleado);
    setIsConfirmModalOpen(true);
  }

  // Cancelar eliminación
  function handleCancelDelete() {
    setIsConfirmModalOpen(false);
    setEmpleadoAEliminar(null);
  }

  // Confirmar eliminación
  async function handleConfirmDelete() {
    if (!empleadoAEliminar) return;

    const idEmpleado = empleadoAEliminar.id_empleado;

    setError("");

    try {
      await empleadoService.desactivarEmpleado(idEmpleado);

      setIsConfirmModalOpen(false);
      setEmpleadoAEliminar(null);

      // Actualizar la tabla para retirar al empleado desactivado.
      await cargarEmpleados();
    } catch (err) {
      console.error("Error al desactivar el empleado:", err);

      setError(
        err.status === 401
          ? "Tu sesión no está autenticada. Iniciá sesión nuevamente."
          : err.status === 403
            ? "No tenés permisos para desactivar empleados."
            : err.message || "No se pudo desactivar el empleado.",
      );

      setIsConfirmModalOpen(false);
      setEmpleadoAEliminar(null);
    }
  }
  // Búsqueda
  const [search, setSearch] = useState("");
  const [searchApplied, setSearchApplied] = useState("");

  // Paginación
  const [page, setPage] = useState(1);
  const limit = 20;

  // Datos
  const [empleados, setEmpleados] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Estados de la pantalla
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Actualizar datos del listado
  const cargarEmpleados = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const resultado = await empleadoService.getEmpleados(
        searchApplied,
        page,
        limit,
      );

      const registros = resultado.empleados ?? [];
      const paginas = resultado.totalPages ?? 0;

      // Si la página actual dejó de existir, volver a una válida.
      if (paginas > 0 && page > paginas) {
        setPage(paginas);
        return;
      }

      setEmpleados(registros);
      setTotalRecords(resultado.totalRecords ?? 0);
      setTotalPages(paginas);
    } catch (err) {
      console.error("Error al cargar empleados:", err);

      setEmpleados([]);
      setTotalRecords(0);
      setTotalPages(0);

      if (err.status === 401) {
        setError("Tu sesión no está autenticada. Iniciá sesión nuevamente.");
      } else if (err.status === 403) {
        setError("No tenés permisos para consultar los empleados.");
      } else {
        setError(err.message || "No se pudieron cargar los empleados.");
      }
    } finally {
      setLoading(false);
    }
  }, [searchApplied, page]);

  useEffect(() => {
    cargarEmpleados();
  }, [cargarEmpleados]);

  // Buscar
  function handleSearch() {
    const nuevaBusqueda = search.trim();

    setPage(1);
    setSearchApplied(nuevaBusqueda);
  }

  // Cambiar de página
  function handlePageChange(newPage) {
    if (newPage < 1 || newPage > totalPages || newPage === page) {
      return;
    }

    setPage(newPage);
  }

  // Abrir modal de creación
  function handleOpenCreateModal() {
    setSelectedEmpleadoId(null);
    setEmpleadoModalMode("create");
    setIsEmpleadoModalOpen(true);
  }

  // Abrir modal de visualización
  function handleOpenViewModal(empleado) {
    setSelectedEmpleadoId(empleado.id_empleado);
    setEmpleadoModalMode("view");
    setIsEmpleadoModalOpen(true);
  }

  // Abrir modal de edición
  function handleOpenEditModal(empleado) {
    setSelectedEmpleadoId(empleado.id_empleado);
    setEmpleadoModalMode("edit");
    setIsEmpleadoModalOpen(true);
  }

  // Cerrar modal
  function handleCloseEmpleadoModal() {
    setIsEmpleadoModalOpen(false);
    setSelectedEmpleadoId(null);
    setEmpleadoModalMode("create");
  }
  async function handleGuardarEmpleado(datosEmpleado) {
    if (empleadoModalMode === "edit") {
      if (!selectedEmpleadoId) {
        throw new Error("No se identificó el empleado que querés editar.");
      }

      const empleadoActualizado = await empleadoService.editarEmpleado(
        selectedEmpleadoId,
        datosEmpleado,
      );

      await cargarEmpleados();

      return empleadoActualizado;
    }

    const empleadoCreado = await empleadoService.crearEmpleado(datosEmpleado);

    // Volver al listado inicial para visualizar el nuevo registro.
    setSearch("");
    setSearchApplied("");
    setPage(1);

    // Actualizar el listado incluso si los filtros ya estaban vacíos.
    if (!searchApplied && page === 1) {
      await cargarEmpleados();
    }

    return empleadoCreado;
  }

  // Columnas
  const columns = [
    {
      accessor: "dni",
      header: "DNI",
    },
    {
      accessor: "nombre",
      header: "Nombre",
    },
    {
      accessor: "apellido",
      header: "Apellido",
    },
    {
      accessor: "email",
      header: "Correo electrónico",
      render: (empleado) => empleado.email || "Sin usuario",
    },
    {
      accessor: "nombre_rol",
      header: "Rol",
      render: (empleado) => empleado.nombre_rol || "Sin rol",
    },
    {
      accessor: "acciones",
      header: "Acciones",
      render: (empleado) => (
        <div className="empleado-actions">
          {/* Ver empleado */}
          <button
            type="button"
            className="empleado-action-btn view"
            title="Ver empleado"
            aria-label={`Ver empleado ${empleado.nombre} ${empleado.apellido}`}
            onClick={() => handleOpenViewModal(empleado)}
          >
            <i className="bi bi-eye"></i>
          </button>

          {/* Editar empleado */}
          <button
            type="button"
            className="empleado-action-btn edit"
            title="Editar empleado"
            aria-label={`Editar empleado ${empleado.nombre} ${empleado.apellido}`}
            onClick={() => handleOpenEditModal(empleado)}
          >
            <i className="bi bi-pencil-square"></i>
          </button>

          {/* Eliminar empleado */}
          <button
            type="button"
            className="empleado-action-btn delete"
            title="Eliminar empleado"
            aria-label={`Eliminar empleado ${empleado.nombre} ${empleado.apellido}`}
            onClick={() => handleOpenDeleteModal(empleado)}
          >
            <i className="bi bi-trash3"></i>
          </button>
        </div>
      ),
    },
  ];

  // Rango de registros visibles
  const firstRecord = totalRecords === 0 ? 0 : (page - 1) * limit + 1;

  const lastRecord = Math.min(page * limit, totalRecords);

  return (
    <section className="empleados">
      {/* Encabezado */}
      <div className="empleados-header">
        <div className="empleados-heading">
          <h1>Empleados</h1>
          <p>Administrá los empleados municipales.</p>
        </div>

        <button
          className="primary-button"
          type="button"
          onClick={handleOpenCreateModal}
        >
          <i className="bi bi-plus-lg"></i>
          <span>Nuevo empleado</span>
        </button>
      </div>

      {/* Barra de búsqueda */}
      <div className="empleados-toolbar">
        <div className="empleados-search-group">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Buscar por DNI, nombre, correo..."
            onSearch={handleSearch}
          />

          <button
            type="button"
            className="empleados-clear-filters"
            onClick={() => {
              setSearch("");
              setSearchApplied("");
              setPage(1);
            }}
            disabled={!search && !searchApplied && page === 1}
            title="Limpiar filtros"
            aria-label="Limpiar filtros"
          >
            <i className="bi bi-arrow-counterclockwise"></i>
            <span>Limpiar</span>
          </button>
        </div>

        <span className="empleados-total-badge">
          <i className="bi bi-people"></i>
          {totalRecords} {totalRecords === 1 ? "empleado" : "empleados"}
        </span>
      </div>

      {/* Error */}
      {error && (
        <div className="empleados-error" role="alert">
          <i className="bi bi-exclamation-circle"></i>

          <span>{error}</span>

          <button type="button" onClick={cargarEmpleados}>
            Reintentar
          </button>
        </div>
      )}

      {/* Tabla */}
      <div className="empleados-content">
        {loading ? (
          <div className="empleados-loading">
            <span
              className="spinner-border spinner-border-sm"
              aria-hidden="true"
            ></span>

            <span>Cargando empleados...</span>
          </div>
        ) : error ? null : (
          <>
            <DataTable
              columns={columns}
              data={empleados}
              rowKey="id_empleado"
            />

            {/* Pie de tabla */}
            <div className="empleados-footer">
              <div className="empleados-count">
                {totalRecords === 0 ? (
                  <span>
                    {searchApplied
                      ? "No se encontraron empleados para esa búsqueda."
                      : "Todavía no hay empleados registrados."}
                  </span>
                ) : (
                  <>
                    <span className="empleados-count-label">Mostrando</span>

                    <strong>
                      {firstRecord}–{lastRecord}
                    </strong>

                    <span className="empleados-count-label">de</span>

                    <strong>{totalRecords}</strong>

                    <span className="empleados-count-label">
                      {totalRecords === 1 ? "empleado" : "empleados"}
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

      {/* Modal */}
      {isEmpleadoModalOpen && (
        <EmpleadoModal
          title={
            empleadoModalMode === "create"
              ? "Nuevo empleado"
              : empleadoModalMode === "view"
                ? "Datos del empleado"
                : "Editar empleado"
          }
          mode={empleadoModalMode}
          empleadoId={selectedEmpleadoId}
          onClose={handleCloseEmpleadoModal}
          onSave={handleGuardarEmpleado}
        />
      )}
      {/* Modal de confirmación de eliminación */}
      <ConfirmModal
        isOpen={isConfirmModalOpen}
        title="Eliminar empleado"
        message={
          empleadoAEliminar
            ? `¿Estás seguro de que querés eliminar a ${empleadoAEliminar.nombre} ${empleadoAEliminar.apellido}?`
            : "¿Estás seguro de que querés eliminar este empleado?"
        }
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </section>
  );
}

export default Empleados;
